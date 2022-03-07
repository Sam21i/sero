import { Reference, RelatedPerson } from "@i4mi/fhir_r4";

export default class EmergencyContact {
    given : string[];
    family : string;
    phone: string;
    image?: {
        contentType: string;
        data: string;
    };
    fhirResource: RelatedPerson;


    constructor(_fhirResource: RelatedPerson){
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
}