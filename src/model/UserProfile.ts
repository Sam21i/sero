import { Patient, PatientAdministrativeGender, PatientCommunication, Reference } from "@i4mi/fhir_r4";
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
    if (_attributes.patientResource) {
      this.patientResource = _attributes.patientResource as Patient;
    }
    if (_attributes.emergencyContacts) {
      this.emergencyContacts = _attributes.emergencyContacts.map(c => new EmergencyContact(c));
    }
  }

  /**
  * CAVE: Modifies store, do not call outside of reducer
  **/
  setEmergencyContacts(_contacts: EmergencyContact[]): void {
    _contacts.forEach(contact => this.addEmergencyContact(contact));
  }

  /**
  * CAVE: Modifies store, do not call outside of reducer
  **/
  addEmergencyContact(_contact: EmergencyContact): void {
    if (_contact.fhirResource === undefined || _contact.fhirResource.active) {
      const index = this.emergencyContacts.findIndex(c => c.isEqual(_contact));
      if (index === -1) {
        this.emergencyContacts.push(_contact);
      } else {
        this.emergencyContacts[index] = _contact;
        console.log('Contact is already in EmergencyContact, replace with new data.', _contact);
      }
    }
  }

  /**
  * CAVE: Modifies store, do not call outside of reducer
  **/
  removeEmergencyContact(_contact: EmergencyContact): void {
    const index = this.emergencyContacts.findIndex(c => c.isEqual(_contact));
    if (index > -1) {
      this.emergencyContacts.splice(index,1);
    }
  }

  /**
  * CAVE: Modifies store, do not call outside of reducer
  **/
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

  getGivenName(): string | undefined {
    const name = this.patientResource.name;
    if (name !== undefined && name.length > 0) {
      const primaryName = name[0];
      let givenName = '';
      if (primaryName.given !== undefined && primaryName.given.length > 0) {
        givenName = primaryName.given[0];
      }
      return givenName;
    }
    return undefined;
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
