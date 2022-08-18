import {ContactPointSystem, Reference, RelatedPerson} from '@i4mi/fhir_r4';
import {v4 as uuidv4} from 'uuid';

export default class EmergencyContact {
  given: string[] = [];
  family = '';
  phone = '';
  image?: {
    contentType: string;
    data: string;
  };
  fhirResource: RelatedPerson = {id: '', patient: {id: ''}};

  constructor(_data: Partial<EmergencyContact> | RelatedPerson) {
    if ((_data as RelatedPerson).resourceType && (_data as RelatedPerson).resourceType === 'RelatedPerson') {
      this.fillFromResource(_data as RelatedPerson);
    } else {
      Object.assign(this, _data);
    }
  }

  fillFromResource(_fhirResource: RelatedPerson) {
    this.fhirResource = _fhirResource;
    if (_fhirResource.name && _fhirResource.name.length > 0) {
      let usualNameIndex = _fhirResource.name.findIndex((n) => n.use === 'usual');
      if (usualNameIndex < 0) {
        usualNameIndex = 0;
      }
      this.given = _fhirResource.name[usualNameIndex].given || [''];
      this.family = _fhirResource.name[usualNameIndex].family || '';
    } else {
      this.given = [''];
      this.family = '';
    }
    if (_fhirResource.telecom && _fhirResource.telecom.length > 0) {
      this.phone = _fhirResource.telecom.find((t) => t.system === 'phone')?.value || '';
    } else {
      this.phone = '';
    }
    if (
      _fhirResource.photo &&
      _fhirResource.photo[0] &&
      _fhirResource.photo[0].data &&
      _fhirResource.photo[0].contentType
    ) {
      this.image = {
        contentType: _fhirResource.photo[0].contentType,
        data: _fhirResource.photo[0].contentType + ';base64,' + _fhirResource.photo[0].data
      };
    }
  }

  getInitials(): string {
    return (this.given[0].substring(0, 1) + this.family.substring(0, 1)).toUpperCase();
  }

  setGivenName(_given: string): void {
    this.given[0] = _given;
  }

  setFamilyName(_family: string): void {
    this.family = _family;
  }

  setPhone(_phone: string): void {
    this.phone = _phone;
  }

  setImage(_img: {contentType: string; data: string}): void {
    this.image = _img;
  }

  getNameString(): string {
    let name = '';
    this.given.forEach((givenName) => {
      name += givenName + ' ';
    });
    return name + this.family;
  }

  getGivenNameString(): string {
    let name = '';
    this.given.forEach((givenName) => {
      name += givenName + ' ';
    });
    return name.substring(0, name.length - 1);
  }

  /**
   * Function which shortens the name of a person if necessary and returns them on two lines
   * @returns the first- and surname of the person seperated on two lines
   */
  getNameOnTwoLinesString(): string {
    const firstName = this.getGivenNameString();
    const surname = this.family;
    return this.getShortenedString(firstName, 14).concat(this.getShortenedString('\n' + surname, 14));
  }

  /**
   * Function which shortens the input string if it is longer then the given input number
   * @returns the input string
   */
  private getShortenedString(inputString: string, maxStringLength: number): string {
    if (inputString.length > maxStringLength) {
      return inputString.substring(0, inputString.length - 4).concat('...');
    } else {
      return inputString;
    }
  }

  getPatientReference(): Reference {
    return this.fhirResource.patient;
  }

  getUniqueColor(): string {
    const stringUniqueHash = [...this.getNameString()].reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${stringUniqueHash % 360}, 40%, 45%)`;
  }

  isEqual(_contact: EmergencyContact): boolean {
    return (
      this.fhirResource?.id === _contact.fhirResource?.id ||
      (this.family === _contact.family && this.given[0] === _contact.given[0] && this.phone === _contact.phone)
    );
  }

  createFhirResource(_patientReference: Reference, _data?: Partial<EmergencyContact>): RelatedPerson {
    const family = _data?.family || this.family;
    const given = _data?.given || this.given;
    const phone = _data?.phone || this.phone;
    const image = _data?.image || this.image;
    if (phone && !(!family && !given)) {
      return {
        id: this.fhirResource.id || 'temp-' + uuidv4(),
        resourceType: 'RelatedPerson',
        name: [
          {
            family: family,
            given: given
          }
        ],
        telecom: [
          {
            system: ContactPointSystem.PHONE,
            value: phone
          }
        ],
        photo: image
          ? [
              {
                contentType: image.contentType,
                data: image.data.split('base64,')[1],
                title: 'Profilbild.' + image.contentType.split('/')[1]
              }
            ]
          : [],
        active: true,
        patient: _patientReference,
        relationship: [
          {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/v2-0131',
                code: 'C',
                display: 'Emergency Contact'
              }
            ]
          }
        ]
      };
    } else {
      throw new Error(
        'Missing arguments. Please provide at least given name, family name and phone number for creating the FHIR resource.'
      );
    }
  }
}
