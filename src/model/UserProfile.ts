import { Bundle, Patient, PatientAdministrativeGender, PatientCommunication, Reference, RelatedPerson } from "@i4mi/fhir_r4";
import EmergencyContact from "./EmergencyContact";

export default class UserProfile {
    patientResource: Patient = {id: ''};
    emergencyContacts: EmergencyContact[] = [];

    constructor(_userProfile?: Partial<UserProfile>) {
        if (_userProfile) {
            this.updateProfile(_userProfile);
        }
    }

    updateProfile(_attributes: Partial<UserProfile>) {
        Object.assign(this, _attributes);
    }

    /**
    * CAVE: Modifies store, do not call outside of reducer
    **/
    setEmergencyContacts(_contacts: EmergencyContact[]): void {
        this.emergencyContacts = _contacts;
    }

    resetProfileData() {
        this.patientResource = {id: ''};
        this.emergencyContacts = [];
    }

    getFhirId(): string {
        if (this.patientResource.id) {
            return this.patientResource.id;
        } else {
            throw new Error('No FHIR resource id set.')
        }
    }

    getEmergencyContacts(): EmergencyContact[] {
        return this.emergencyContacts;
    }

    getGender(): PatientAdministrativeGender | undefined {
        if (this.patientResource.id === '') return undefined;
        return this.patientResource.gender;
    }

    getBirthYear(): string | undefined {
        return (this.patientResource.id === '' || !this.patientResource.birthDate)
        ? undefined
        : new Date(this.patientResource.birthDate).getFullYear().toString();
    }

    getPreferredLanguageCode(): string | undefined {
        let language: string | undefined;
        this.patientResource.communication?.forEach((com: PatientCommunication) => {
            if ((!language || com.preferred) && com.language.coding) {
                language = com.language.coding[0].code;
            }
        });
        return language;
    }

    getFullName(): string | undefined {
        const name = this.patientResource.name;
        if (name !== undefined && name.length > 0) {
            const primaryName = name[0];
            let fullName = '';
            if (primaryName.given !== undefined && primaryName.given.length > 0) {
                fullName = primaryName.given[0] + ' ';
            }
            if (primaryName.family && primaryName.family.length > 0) {
                fullName += primaryName.family;
            }
            return fullName;
        }
        return undefined;
    }

    getFhirReference(): Reference | undefined {
        if (this.patientResource.id !== '') {
            return {
                display: this.getFullName(),
                reference: 'Patient/' + this.patientResource.id
            };
        } else {
            return undefined;
        }
    }
}
