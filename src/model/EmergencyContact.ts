import { ContactPointSystem, Reference, RelatedPerson } from '@i4mi/fhir_r4';

export default class EmergencyContact {
    given: string[] = [];
    family: string = '';
    phone: string = '';
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

    fillFromResource(_fhirResource: RelatedPerson){
        this.fhirResource = _fhirResource;
        if (_fhirResource.name && _fhirResource.name.length > 0) {
            let usualNameIndex = _fhirResource.name.findIndex(n => n.use === 'usual');
            if (usualNameIndex < 0) {
                usualNameIndex = 0;
            }
            this.given = _fhirResource.name[usualNameIndex].given || [''];
            this.family = _fhirResource.name[usualNameIndex].family || ''
        } else {
            this.given = [''];
            this.family = '';
        }
        if (_fhirResource.telecom && _fhirResource.telecom.length > 0) {
            this.phone = _fhirResource.telecom.find(t => t.system === 'phone')?.value || '';
        } else {
            this.phone = '';
        }
    }

    getInitials(): string {
        return (
            this.given[0].substring(0,1) +
            this.family.substring(0,1)
        ).toUpperCase();
    }

    setImage(_img: {contentType: string; data: string}): void {
        this.image = _img;
    }

    getNameString(): string {
        let name = '';
        this.given.forEach(givenName => {
            name += givenName + ' ';
        });
        return name + this.family;
    }

    getPatientReference(): Reference {
        return this.fhirResource.patient;
    }

    createFhirResource(_data: Partial<EmergencyContact>, _patientReference: Reference): RelatedPerson {
        if (_data.family && _data.given && _data.given.length > 0 && _data.phone) {
            return  {
                resourceType: 'RelatedPerson',
                name: [
                    {
                        family: _data.family,
                        given: _data.given
                    }
                ],
                telecom: [
                    {
                        system: ContactPointSystem.PHONE,
                        value: _data.phone
                    }
                ],
                photo: _data.image
                        ? [
                            {
                                contentType: _data.image.contentType,
                                data: _data.image.data.split('base64,')[1],
                                title: 'Profilbild' + _data.image.contentType.split('/')[1]
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
            }
        } else {
            throw new Error('Missing arguments. Please provide at least given name, family name and phone number for creating the FHIR resource.');
        }
    }
}