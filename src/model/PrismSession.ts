import {QuestionnaireData} from '@i4mi/fhir_questionnaire';
import {
  Bundle,
  BundleHTTPVerb,
  BundleType,
  I4MIBundle,
  Media,
  MediaStatus,
  Observation,
  ObservationStatus,
  Questionnaire,
  QuestionnaireResponse,
  Reference
} from '@i4mi/fhir_r4';
import base64 from 'react-native-base64';

export const PRISM_RATIO = Math.SQRT2; // aspec ratio of the PRISM-S plate
export const PRISM_WIDTH = 29.4; // width of the real PRISM-S plate in cm
const SVG_WIDTH = 500; // width of the generated SVG image in pixel
export const PRISM_BLACK = '#000000'; // colour of the black disc
export const PRISM_YELLOW = '#fbb300'; // colour of the yellow circle
export const PRISM_PLATE = '#FFFFFF';
export const PRISM_YELLOW_RADIUS_RATIO = 0.2381 / 2; // diameter of yellow circle is 23.81% of plate width
export const PRISM_BLACK_RADIUS_RATIO = 0.1701 / 2; // diameter of black plate is 17,01% of plate width
export const YELLOW_DISC_MARGIN_RATIO = 0.068; // distance of the yellow circle to bottom / right is 6.8% of plate width

export const PRISM_OBSERVATION_CODE = {
  system: 'http://midata.coop/prisms',
  code: 'selfAssessment',
  display:
    'Self-assessment of the suicidal urge and the personal meaning of this urge by the affected person using the PRISM-S method.'
};

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
  getCentimeterPosition(_plateWidth: number): {horizontal: number; vertical: number} {
    const pixelPerCm = _plateWidth / PRISM_WIDTH;
    return {
      horizontal: Math.round((10 * this.horizontal) / pixelPerCm) / 10,
      vertical: Math.round((10 * this.vertical) / pixelPerCm) / 10
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
    return Math.round(10 * Math.sqrt(Math.pow(horizontalDistance, 2) + Math.pow(verticalDistance, 2))) / 10;
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
    return Math.round((10 * this.getDistance(_position)) / pixelPerCm) / 10;
  }

  /**
   *
   * @returns true if both vertical and horizontal values are 0
   */
  isZero(): boolean {
    return this.vertical === 0 && this.horizontal === 0;
  }
}

export interface PrismInitializer {
  blackDiscPosition?: Position;
  canvasWidth: number;
  date?: Date;
  questionnaire: Questionnaire;
  image?: {
    contentType: string;
    data: string;
  };
}

export interface PrismResources {
  observation: Observation;
  media: Media;
  questionnaireResponse: QuestionnaireResponse;
  questionnaire: Questionnaire;
}

export default class PrismSession {
  // position of the black disc
  blackDiscPosition: Position = new Position(0, 0);
  // position of the yellow disc
  yellowCirclePosition: Position = new Position(0, 0);
  // the date when the PRISM-S was done
  date: Date = new Date();
  // the width of the virtual PRISM-S
  canvasWidth = 1;
  private questionnaireData?: QuestionnaireData;
  private observation?: Observation;
  private media?: Media;
  private image?: {
    contentType: string;
    data: string;
  };

  constructor(_data: PrismSession | PrismResources | PrismInitializer) {
    if (Object.prototype.hasOwnProperty.call(_data, 'questionnaireData')) {
      // it's of type PrismSession
      Object.assign(this, _data);
    } else if (Object.prototype.hasOwnProperty.call(_data, 'observation')) {
      // it's of typ PrismResources
      const resources = _data as PrismResources;
      this.fillFromFHIR(
        resources.observation,
        resources.media,
        resources.questionnaire,
        resources.questionnaireResponse
      );
    } else {
      // it's of type PrismInitializer
      const init = _data as PrismInitializer;
      this.blackDiscPosition = init.blackDiscPosition || this.blackDiscPosition;
      this.canvasWidth = init.canvasWidth;
      this.yellowCirclePosition = this.getDefaultYellowPosition(init.canvasWidth);
      this.date = init.date || new Date();

      if (init.questionnaire) {
        this.questionnaireData = new QuestionnaireData(init.questionnaire);
      }
      if (init.image) {
        this.addImage(init.image);
      }
    }
  }

  /**
   * Initializes the PRISM-S session from a set of resources.
   * @param _observation      Observation resource
   * @param _media            Media resource referred in the Observation
   * @param _questionnaire    Questionnaire resource that defines the Questions
   * @param _answers?         QuestionnaireResponse resource that defines the answers to the questions (optional)
   */
  fillFromFHIR(
    _observation: Observation,
    _media: Media,
    _questionnaire: Questionnaire,
    _answers?: QuestionnaireResponse
  ) {
    (this.observation = _observation), (this.media = _media);
    if (_media.content.contentType && _media.content.data) {
      this.image = {
        contentType: _media.content.contentType,
        data: _media.content.data
      };
    }
    this.canvasWidth = _media.width ? parseInt(_media.width) : SVG_WIDTH;
    this.questionnaireData = new QuestionnaireData(_questionnaire);
    if (_answers) {
      this.questionnaireData.restoreAnswersFromQuestionnaireResponse(_answers);
    }
    this.date = _observation.effectiveDateTime ? new Date(_observation.effectiveDateTime) : new Date();
    this.yellowCirclePosition = this.getDefaultYellowPosition(this.canvasWidth);
    if (_observation.component) {
      const horizontalComp = _observation.component.find((comp) => {
        const coding = comp.code.coding?.find(
          (coding) => coding.system === 'http://midata.coop/prisms' && coding.code === 'xCoordinate'
        );
        return coding !== undefined;
      });
      const verticalComp = _observation.component.find((comp) => {
        const coding = comp.code.coding?.find(
          (coding) => coding.system === 'http://midata.coop/prisms' && coding.code === 'yCoordinate'
        );
        return coding !== undefined;
      });
      if (horizontalComp?.valueQuantity?.value && verticalComp?.valueQuantity?.value) {
        this.blackDiscPosition = new Position(
          this.getPixelFromA4Cm(horizontalComp.valueQuantity.value, this.canvasWidth),
          this.getPixelFromA4Cm(verticalComp.valueQuantity.value, this.canvasWidth)
        );
      }
    }
  }

  /**
   * Compares two PrismSession for equality.
   * @param other the PrismSession instance to compare.
   */
  isEqual(other: PrismSession): boolean {
    if (this.observation && other.observation) {
      if (this.observation.id && other.observation.id) {
        return this.observation.id === other.observation.id;
      } else {
        return false;
      }
    } else {
      return this === other;
    }
  }

  /**
   * Returns the model of QuestionnaireData. Use .getQuestions() to receive the actual IQuestion items,
   * and .updateQuestionAnswers() to set an answer to a question.
   * @returns   The Questionnaire as a model ready for manipulation and generate QuestionnaireResponse
   * @throws    An error if no Questionnaire was provided beforehand and the QuestionnaireData could not have been initialized.
   */
  getQuestionnaireData(): QuestionnaireData {
    if (!this.questionnaireData) throw new Error('No QuestionnaireData set, initialize correctly first.');
    return this.questionnaireData;
  }

  /**
   * Returns a boolean value representing whether any questions for the particular Questionnaire have been answered or not.
   * Caution does not work for Questionnaires that have nested subitems exceeding 1 level.
   * @returns   true if any questions have been answered and false if none have been answered.
   */
  anyQuestionsAnswered(): boolean {
    // TODO: use recursion in case of nested items
    // TODO: move in FHIR library
    this.questionnaireData?.getQuestions().forEach((question) => {
      if (question.subItems) {
        question.subItems.forEach((question) => {
          if (question.selectedAnswers.length > 0) {
            return true;
          }
        });
      } else {
        if (question.selectedAnswers.length > 0) {
          return true;
        }
      }
    });
    return false;
  }

  /**
   * Returns a bundle representing the prism session, ready to upload to MIDATA
   * @returns a valid FHIR bundle of type transaction
   */
  getUploadBundle(_patientReference: Reference): Bundle {
    if (!this.questionnaireData) throw new Error("QuestionnaireData is undefined, can't create FHIR bundle");
    const questionnaireResponse = this.questionnaireData.getQuestionnaireResponse('de', _patientReference, this.date);
    const media = this.getMedia(_patientReference);
    const observation = this.getObservation(_patientReference);
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
   * Gets a date string of the prismSession creation date
   * @param locale
   * @returns locale representation of the date
   */
  getLocaleDate(locale: string): string {
    if (this.date) {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date(this.date));
    } else {
      return '';
    }
  }

  /**
   * Add an image to the PrismSession (from camera or library)
   * @param contentType  should be image/png or image/jpeg, depending on the image
   * @param data         the image, encoded in Base64
   */
  addImage(image: {contentType: string; data: string}): void {
    this.image = image;
  }

  /**
   * Gets the PRISM-S board as a SVG image string
   * @returns   the SVG as a string (NOT base64 encoded) or an empty string
   *            if no SVG image is available
   */
  getSVGImage(): string {
    if (this.image && !this.image.contentType.includes('svg')) {
      return '';
    }
    if (!this.image) {
      const svgString = this.drawSVG(this.blackDiscPosition, this.yellowCirclePosition, SVG_WIDTH);
      this.image = {
        contentType: 'image/svg+xml',
        data: base64.encode(svgString)
      };
      return svgString;
    }
    return base64.decode(this.image.data);
  }

  /**
   * Gets the PRISM-S board as a base64 encoded string
   * @returns   an object containing contentType (as string)
   *            and the actual image data (as base64 encoded string)
   *            or contentType and data as empty strings if no base64 image is available
   */
  getBase64Image(): {contentType: string; data: string} {
    if (!this.image || this.image.contentType.includes('svg')) {
      return {
        contentType: '',
        data: ''
      };
    }
    return this.image;
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
        };
  }

  private getImage(): {
    contentType: string;
    data: string;
    title: string;
    creation: string;
  } {
    if (this.image) {
      // return photo taken
      return {
        contentType: this.image.contentType,
        data: this.image.data,
        title:
          'PRISM-S_' +
          this.date.toISOString().substring(0, 16) +
          '.' +
          this.image.contentType.split('/')[1].split('+')[0],
        creation: this.date.toISOString()
      };
    } else {
      return {
        // create svg
        contentType: 'image/svg+xml',
        title: 'PRISM-S_' + this.date.toISOString().substring(0, 16) + '.svg',
        data: base64.encode(this.drawSVG(this.blackDiscPosition, this.yellowCirclePosition, SVG_WIDTH)),
        creation: this.date.toISOString()
      };
    }
  }

  private getObservation(_patientReference: Reference): Observation {
    if (this.observation) return this.observation;
    return {
      resourceType: 'Observation',
      status: ObservationStatus.FINAL,
      id: 'temp-prism-observation',
      code: {
        coding: [PRISM_OBSERVATION_CODE],
        text: 'Self-assessment of the suicidal urge and the personal meaning of this urge by the affected person using the PRISM-S method'
      },
      subject: _patientReference,
      effectiveDateTime: this.date.toISOString(),
      performer: [_patientReference],
      component:
        this.blackDiscPosition.isZero() || this.yellowCirclePosition.isZero()
          ? []
          : [
              {
                code: {
                  coding: [
                    {
                      system: 'http://midata.coop/prisms',
                      code: 'distance',
                      display:
                        'Distance between the black disc and the yellow circle in cm extrapolated to the A4 format of the PRISM-S board'
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
                      display:
                        'Value of the x coordinate of the black disk in cm extrapolated to the A4 format of the PRISM-S board'
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
                      display:
                        'Value of the y coordinate of the black disk in cm extrapolated to the A4 format of the PRISM-S board'
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
    };
  }

  /**
   * Gets the position of the yellow circle, on a new canvas with a given width
   * @param _canvasWidth the widht of the canvas the yellow circle is drawn on
   * @returns            the position of the yellow circle as a position element
   */
  private getDefaultYellowPosition(_canvasWidth: number): Position {
    return new Position(
      _canvasWidth - (YELLOW_DISC_MARGIN_RATIO + PRISM_YELLOW_RADIUS_RATIO) * _canvasWidth,
      _canvasWidth / PRISM_RATIO - (YELLOW_DISC_MARGIN_RATIO + PRISM_YELLOW_RADIUS_RATIO) * _canvasWidth
    );
  }

  /**
   * Helper function to calculate how many pixel correspond to a cm on an A4 sheet of paper.
   * @param _cm           the centimeter value on the paper
   * @param _canvasWidth  the pixel width of the canvas representing the paper
   * @returns             the number of pixel that correspond to the given cm value
   */
  private getPixelFromA4Cm(_cm: number, _canvasWidth: number): number {
    const ratio = _canvasWidth / PRISM_WIDTH;
    return Math.round(_cm * ratio);
  }

  /**
   * Draws a SVG image from the positions of the circles
   * @param blackDiscPos      position of the black disc
   * @param yellowCirclePos   position of the yellow circle
   * @param width?            specify width of the drawn image. optional, default is the given
   *                          with of the PRISM-S session (depending on screen size)
   * @returns                 the SVG as a string
   */
  private drawSVG(blackDiscPos: Position, yellowCirclePos: Position, width?: number): string {
    const RATIO = width ? width / this.canvasWidth : 1;
    const CANVAS_WIDTH = width ? width : this.canvasWidth;
    const CANVAS_HEIGHT = CANVAS_WIDTH / PRISM_RATIO;
    const YELLOW_RADIUS = CANVAS_WIDTH * PRISM_YELLOW_RADIUS_RATIO;
    const BLACK_RADIUS = CANVAS_WIDTH * PRISM_BLACK_RADIUS_RATIO;

    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<svg id="prism_board" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      CANVAS_WIDTH +
      ' ' +
      CANVAS_HEIGHT +
      '">\n  <g>\n    ' +
      '<rect id="plate" ' +
      'fill="' +
      PRISM_PLATE +
      '" ' +
      'width="' +
      CANVAS_WIDTH +
      '" ' +
      'height="' +
      CANVAS_HEIGHT +
      '"/>\n    ' +
      '<circle id="yellowCircle" ' +
      'r="' +
      YELLOW_RADIUS +
      '" ' +
      'cy="' +
      yellowCirclePos.vertical * RATIO +
      '" ' +
      'cx="' +
      yellowCirclePos.horizontal * RATIO +
      '" ' +
      'fill="' +
      PRISM_YELLOW +
      '"/>\n    ' +
      '<circle id="blackDisc" ' +
      'r="' +
      BLACK_RADIUS +
      '" ' +
      'cy="' +
      blackDiscPos.vertical * RATIO +
      '" ' +
      'cx="' +
      blackDiscPos.horizontal * RATIO +
      '" ' +
      'fill="' +
      PRISM_BLACK +
      '"/>\n  ' +
      '</g>\n</svg>'
    );
  }
}
