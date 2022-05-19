
import { IQuestion, QuestionnaireData } from "@i4mi/fhir_questionnaire";
import { Bundle, BundleHTTPVerb, BundleType, I4MIBundle, Media, MediaStatus, Observation, ObservationStatus, Questionnaire, QuestionnaireResponse, Reference } from "@i4mi/fhir_r4";

// aspec ratio of the PRISM-S plate
const PRISM_RATIO = Math.SQRT2;
// width of the real PRISM-S plate in cm
const PRISM_WIDTH = 29.4;
// width of the generated SVG image in pixel
const SVG_WIDTH = 500;

export class Position {
    // the horizontal position of the black disc in pixel, measured from the left
    horizontal: number;
    // the vertical position of the black disc in pixel, measured from the top
    vertical: number;

    constructor(_horizontal: number, _vertical: number) {
        this.horizontal = _horizontal;
        this.vertical = _vertical;
    }

    /**
     * Gets the position translated to centimeters on a corresponding real PRISM-S plate (in A4)
     * @param _plateWidth   the width of the virtual prism plate in pixel
     * @returns             the vertical and horizontal positions
     *                        in cm on a corresponding real PRISM-S plate (in A4 size)
     */
    getCentimeterPosition(_plateWidth: number): {horizontal: number, vertical: number} {
        const pixelPerCm = _plateWidth / PRISM_WIDTH;
        return {
            horizontal: this.horizontal / pixelPerCm,
            vertical: this.vertical / pixelPerCm
        };
    }

    /**
     * Calculates the distance between two positions in pixel.
     * CAUTION: When comparing PRISM discs, mind to give the coordinates of the center of the disc,
     * not the upper left corner (which is the coordinate of the image representing the disc)
     * @param _position     the position object to compare to
     * @returns             the distance in pixel between the two positions
     */
    getDistance(_position: Position): number {
        const horizontalDistance = _position.horizontal - this.horizontal;
        const verticalDistance = _position.vertical - this.vertical;
        return Math.sqrt(Math.pow(horizontalDistance, 2) + Math.pow(verticalDistance, 2));
    }

    /**
     * Calculates the distance between two positions in cm.
     * CAUTION: When comparing PRISM discs, mind to give the coordinates of the center of the disc,
     * not the upper left corner (which is the coordinate of the image representing the disc)
     * @param _position     the position object to compare to
     * @param _plateWidth   the width of the virtual prism plate in pixel
     * @returns             the distance in cm on a corresponding real PRISM-S plate (in A4 size)
     */
    getCentimeterDistance(_position: Position, _plateWidth: number): number {
        const pixelPerCm = _plateWidth / PRISM_WIDTH;
        return this.getDistance(_position) / pixelPerCm;
    }
}

interface PrismInitializer {
    blackDiscPosition: Position;
    yellowDiscPosition: Position;
    canvasWidth: number;
    date?: Date;
    questionnaire?: Questionnaire
}

export default class PrismSession {
    // position of the black disc
    blackDiscPosition: Position = new Position(0,0);
    // position of the yellow disc
    yellowDiscPosition: Position = new Position(0,0);
    // the date when the PRISM-S was done
    date: Date = new Date();
    // the with of the virtual PRISM-S
    canvasWidth: number = 1;
    private questionnaireData?: QuestionnaireData;
    private observation?: Observation;
    private media?: Media;

    constructor(_data: PrismSession | PrismInitializer ) {
        if (_data.hasOwnProperty('getUploadBundle')) { // it's of type PrismSession
            Object.assign(this, _data);
        } else {
            const init = _data as PrismInitializer
            this.blackDiscPosition = init.blackDiscPosition;
            this.yellowDiscPosition = init.yellowDiscPosition;
            this.date = init.date || new Date();
            this.canvasWidth = init.canvasWidth;
            if (init.questionnaire) {
                this.questionnaireData = new QuestionnaireData(init.questionnaire);
            }
        }
    }

    fillFromFHIR(_observation: Observation, _media: Media, _answers: QuestionnaireResponse, _questionnaire: Questionnaire) {
        this.observation = _observation,
        this.media = _media;
        this.questionnaireData = new QuestionnaireData(_questionnaire);
        this.questionnaireData.restoreAnswersFromQuestionnaireResponse(_answers);
    }


    getFollowUpQuestions(): IQuestion[] {
     return this.questionnaireData?.items || [];
    }

    /**
     * Returns a bundle representing the prism session, ready to upload to MIDATA
     * @returns a valid FHIR bundle of type transaction
     */
    getUploadBundle(_patientReference: Reference): Bundle {
        if (!this.questionnaireData) throw new Error('QuestionnaireData is undefined, can\'t create FHIR bundle');
        const questionnaireResponse = this.questionnaireData.getQuestionnaireResponse('de', _patientReference, this.date);
        const media = this.getMedia(_patientReference);
        const observation = this.getObservation(_patientReference)
        questionnaireResponse.id = 'temp-prism-questionnaireResponse';
        questionnaireResponse.partOf = [
            {
                reference: 'Observation/' + observation.id,
                type: 'Observation'
            }
        ];
        observation.derivedFrom = [
            {
              reference: 'Media/' + media.id,
              type: 'Media'
            }
        ];    
        
        const bundle = new I4MIBundle(BundleType.TRANSACTION);
        bundle.addEntry(BundleHTTPVerb.POST, 'QuestionnaireResponse', questionnaireResponse);
        bundle.addEntry(BundleHTTPVerb.POST, 'Observation', observation);
        bundle.addEntry(BundleHTTPVerb.POST, 'Media', media);

        return bundle;
    }

    private getMedia(_patientReference: Reference): Media {
        return this.media
            ? this.media
            : {
                resourceType: 'Media',
                status: MediaStatus.COMPLETED,
                id: 'temp-prism-media',
                type: {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/media-type',
                      code: 'image',
                      display: 'Image'
                    }
                  ]
                },
                subject: _patientReference,
                createdDateTime: this.date.toISOString(),
                operator: _patientReference,
                height: (SVG_WIDTH / PRISM_RATIO).toString(),
                width: SVG_WIDTH.toString(),
                frames: '1',
                content: {
                  contentType: 'image/svg',
                  data: this.createBase64Svg(),
                  creation: this.date.toISOString()
                }
              }
    }

    private getObservation(_patientReference: Reference): Observation {
        return this.observation 
            ? this.observation
            : {
            resourceType: 'Observation',
            status: ObservationStatus.FINAL,
            id: 'temp-prism-observation',
            code: {
              coding: [
                {
                  system: 'http://midata.coop/prisms',
                  code: 'selfAssessment',
                  display: 'Self-assessment of the suicidal urge and the personal meaning of this urge by the affected person using the PRISM-S method.'
                }
              ],
              text: 'Self-assessment of the suicidal urge and the personal meaning of this urge by the affected person using the PRISM-S method.'
            },
            subject: _patientReference,
            effectiveDateTime: this.date.toISOString(),
            performer: [
                _patientReference
            ],
            component: [
              {
                code: {
                  coding: [
                    {
                      system: 'http://midata.coop/prisms',
                      code: 'distance',
                      display: 'Distance between the black disc and the yellow circle in cm extrapolated to the A4 format of the PRISM-S board.'
                    }
                  ]
                },
                valueQuantity: {
                  value: this.blackDiscPosition.getCentimeterDistance(this.yellowDiscPosition, this.canvasWidth),
                  system: 'http://unitsofmeasure.org',
                  code: 'cm',
                  unit: 'Centimeter'
                }
              },
              {
                code: {
                  coding: [
                    {
                      system: 'http://midata.coop/prisms',
                      code: 'xCoordinate',
                      display: 'Value of the x coordinate of the black disk in cm extrapolated to the A4 format of the PRISM-S board.'
                    }
                  ]
                },
                valueQuantity: {
                  value: this.blackDiscPosition.getCentimeterPosition(this.canvasWidth).horizontal,
                  system: 'http://unitsofmeasure.org',
                  code: 'cm',
                  unit: 'Centimeter'
                }
              },
              {
                code: {
                  coding: [
                    {
                      system: 'http://midata.coop/prisms',
                      code: 'yCoordinate',
                      display: 'Value of the y coordinate of the black disk in cm extrapolated to the A4 format of the PRISM-S board.'
                    }
                  ]
                },
                valueQuantity: {
                  value: this.blackDiscPosition.getCentimeterPosition(this.canvasWidth).vertical,
                  code: 'cm',
                  unit: 'Centimeter'
                }
              }
            ],
            method: {
              coding: [
                {
                  system: 'http://midata.coop/prisms',
                  code: 'appMethod',
                  display: 'Self-assessment in an app with a virtual PRISM-S board.'
                }
              ]
            }
          }
    }

    /**
     * Creates an SVG image of the PRISM-S plate
     * @returns     the SVG image as a base64 string
     */
    private createBase64Svg(): string {
        const height = SVG_WIDTH / PRISM_RATIO;
        const imageString = '';
        return 'data:image/svg;base64,' + Buffer.from(imageString).toString('base64');
    }

    private calculateCentimeters(): number {
        return 0;
    }
}