import base64 from 'react-native-base64'
import { IQuestion, QuestionnaireData } from "@i4mi/fhir_questionnaire";
import { Bundle, BundleHTTPVerb, BundleType, I4MIBundle, Media, MediaStatus, Observation, ObservationStatus, Questionnaire, QuestionnaireResponse, Reference } from "@i4mi/fhir_r4";

const PRISM_RATIO = Math.SQRT2;               // aspec ratio of the PRISM-S plate
const PRISM_WIDTH = 29.4;                     // width of the real PRISM-S plate in cm
const SVG_WIDTH = 500;                        // width of the generated SVG image in pixel 
const PRISM_BLACK = '#000000';                // colour of the black disc
const PRISM_YELLOW = '#fbb300';               // colour of the yellow circle
const PRISM_YELLOW_RADIUS_RATIO = 0.2381 / 2; // diameter of yellow circle is 23.81% of plate width
const PRISM_BLACK_RADIUS_RATIO = 0.1701 / 2;  // diameter of black plate is 17,01% of plate width
const YELLOW_DISC_MARGIN_RATIO = 0.068;       // distance of the yellow circle to bottom / right is 6.8% of plate width



export const PRISM_OBSERVATION_CODE = {
  system: 'http://midata.coop/prisms',
  code: 'selfAssessment',
  display: 'Self-assessment of the suicidal urge and the personal meaning of this urge by the affected person using the PRISM-S method.'
}

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
            horizontal: Math.round(10 * this.horizontal / pixelPerCm) / 10,
            vertical: Math.round(this.vertical / pixelPerCm) / 10
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
        return Math.round(this.getDistance(_position) / pixelPerCm) / 10;
    }

    /**
     * 
     * @returns true if both vertical and horizontal values are 0
     */
    isZero(): boolean {
      return this.vertical === 0 && this.horizontal === 0;
    }
}

interface PrismInitializer {
    blackDiscPosition: Position;
    canvasWidth: number;
    date?: Date;
    questionnaire?: Questionnaire
}

export interface PrismResources {
    observation: Observation,
    media: Media,
    questionnaireResponse: QuestionnaireResponse,
    questionnaire: Questionnaire
}

export default class PrismSession {
    // position of the black disc
    blackDiscPosition: Position = new Position(0,0);
    // position of the yellow disc
    yellowCirclePosition: Position = new Position(0,0);
    // the date when the PRISM-S was done
    date: Date = new Date();
    // the width of the virtual PRISM-S
    canvasWidth: number = 1;
    private questionnaireData?: QuestionnaireData;
    private observation?: Observation;
    private media?: Media;
    private image?: {
      contentType: string;
      data: string;
    };

    constructor(_data: PrismSession | PrismInitializer | PrismResources) {
        if (_data.hasOwnProperty('questionnaireData')) { // it's of type PrismSession
            Object.assign(this, _data);
        } else if (_data.hasOwnProperty('observation') ) {
          console.warn('read everything from Observation');
        } else {
            const init = _data as PrismInitializer
            this.blackDiscPosition = init.blackDiscPosition;
            this.canvasWidth = init.canvasWidth;
            const canvasHeight = init.canvasWidth / PRISM_RATIO;
            this.yellowCirclePosition = new Position(
              init.canvasWidth - ((YELLOW_DISC_MARGIN_RATIO + 2 * PRISM_YELLOW_RADIUS_RATIO) * this.canvasWidth),
              canvasHeight - ((YELLOW_DISC_MARGIN_RATIO + 2 * PRISM_YELLOW_RADIUS_RATIO) * this.canvasWidth)
            )
            this.date = init.date || new Date();

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

    getQuestionnaireData(): QuestionnaireData {
      if (!this.questionnaireData) throw new Error('No QuestionnaireData set, initialize correctly first.');
      return this.questionnaireData;
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

    /**
     * Add an image to the PrismSession (from camera or library)
     * @param contentType  should be image/png or image/jpeg, depending on the image
     * @param data         the image, encoded in Base64
     */
    addImage(image: {contentType: string; data: string}): void {
      this.image = image;
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
                height: Math.round(SVG_WIDTH / PRISM_RATIO).toString(),
                width: SVG_WIDTH.toString(),
                frames: '1',
                content: this.getImage()
              }
    }

    private getImage(): {
      contentType: string;
      data: string;
      title: string;
      creation: string;
    } {
      if (this.image) { // return photo taken
        return {
          contentType: this.image.contentType,
          data: this.image.data,
          title: 'PRISM-S_' + this.date.toISOString().substring(0,16) + '.' + this.image.contentType.split('/')[1],
          creation: this.date.toISOString()
        };
      } else {
        return { // create svg
          contentType: 'image/svg+xml',
          title: 'PRISM-S_' + this.date.toISOString().substring(0,16) + '.svg',
          data: base64.encode(this.drawSVG(
            this.blackDiscPosition, 
            this.yellowCirclePosition, 
            SVG_WIDTH
          )),
          creation: this.date.toISOString()
        };
      }
    }

    private getObservation(_patientReference: Reference): Observation {
      if (this.observation) return this.observation;
      const newObservation = {
            resourceType: 'Observation',
            status: ObservationStatus.FINAL,
            id: 'temp-prism-observation',
            code: {
              coding: [
                PRISM_OBSERVATION_CODE
              ],
              text: 'Self-assessment of the suicidal urge and the personal meaning of this urge by the affected person using the PRISM-S method'
            },
            subject: _patientReference,
            effectiveDateTime: this.date.toISOString(),
            performer: [
                _patientReference
            ],
            component: this.blackDiscPosition.isZero() || this.yellowCirclePosition.isZero()
            ? []
            : [
              {
                code: {
                  coding: [
                    {
                      system: 'http://midata.coop/prisms',
                      code: 'distance',
                      display: 'Distance between the black disc and the yellow circle in cm extrapolated to the A4 format of the PRISM-S board'
                    }
                  ]
                },
                valueQuantity: {
                  value: this.blackDiscPosition.getCentimeterDistance(this.yellowCirclePosition, this.canvasWidth),
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
                      display: 'Value of the x coordinate of the black disk in cm extrapolated to the A4 format of the PRISM-S board'
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
                      display: 'Value of the y coordinate of the black disk in cm extrapolated to the A4 format of the PRISM-S board'
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
                  display: 'Self-assessment in an app with a virtual PRISM-S board'
                }
              ]
            }
          }
      return newObservation;
    }

    /**
     * Draws a SVG image from the positions of the circles
     * @param blackDiscPos      position of the black disc
     * @param yellowCirclePos   position of the yellow circle
     * @param width?            specify width of the drawn image. optional, default is the given
     *                          with of the PRISM-S session (depending on screen size)
     * @returns                 the SVG as a string
     * @throws                  an Error if any of the positions is outside the canvas
     */
    private drawSVG(blackDiscPos: Position, yellowCirclePos: Position, width?: number): string {
      const RATIO = width
        ? width / this.canvasWidth
        : 1;
      const CANVAS_WIDTH = width 
        ? width
        : this.canvasWidth;
      const CANVAS_HEIGHT = CANVAS_WIDTH / PRISM_RATIO;
      const YELLOW_RADIUS = CANVAS_WIDTH * PRISM_YELLOW_RADIUS_RATIO;
      const BLACK_RADIUS = CANVAS_WIDTH * PRISM_BLACK_RADIUS_RATIO;
      if (
        (blackDiscPos.horizontal + BLACK_RADIUS) * RATIO > CANVAS_WIDTH ||
        (blackDiscPos.horizontal - BLACK_RADIUS) * RATIO < 0 ||
        (blackDiscPos.vertical + BLACK_RADIUS) * RATIO > CANVAS_WIDTH ||
        (blackDiscPos.vertical - BLACK_RADIUS) * RATIO < 0 ||
        (yellowCirclePos.horizontal + YELLOW_RADIUS) * RATIO > CANVAS_WIDTH ||
        (yellowCirclePos.horizontal - YELLOW_RADIUS) * RATIO < 0 ||
        (yellowCirclePos.vertical + YELLOW_RADIUS) * RATIO > CANVAS_WIDTH ||
        (yellowCirclePos.vertical - YELLOW_RADIUS) * RATIO < 0
      ) throw new Error('Invalid parameters, at least one position is outside the canvas.');
      // TODO: something here is not quite right when RATIO is not 1
      const image = '<svg width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '" xmlns="http://www.w3.org/2000/svg">\n  <g>\n    ' + 
        '<ellipse id="yellowCircle" ' + 
                  'ry="' + YELLOW_RADIUS + '" ' + 
                  'cy="' + (yellowCirclePos.vertical + YELLOW_RADIUS) * RATIO + '" ' + 
                  'cx="' + (yellowCirclePos.horizontal + YELLOW_RADIUS) * RATIO + '" ' +
                  'fill="' + PRISM_YELLOW + '"/>\n    ' + 
        '<ellipse id="blackDisc" ' + 
                  'ry="' + BLACK_RADIUS + '" ' +
                  'cy="' + (blackDiscPos.vertical + BLACK_RADIUS) * RATIO + '" ' +
                  'cx="' + (blackDiscPos.horizontal + BLACK_RADIUS) * RATIO + '" ' +
                  'fill="' + PRISM_BLACK + '"/>\n  ' + 
        '</g>\n</svg>';
      return image;
    }
}