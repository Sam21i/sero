import {
  Patient,
  PatientAdministrativeGender,
  PatientCommunication,
  QuestionnaireResponse,
  Reference,
} from '@i4mi/fhir_r4';

export default class UserProfile {
  private patientResource: Patient = {id: ''};
  private situationQuestionnaireResponse: QuestionnaireResponse | undefined;

  constructor(userProfile?: Partial<UserProfile>) {
    if (userProfile) {
      this.updateProfile(userProfile);
    }
  }

  updateProfile(attributs: Partial<UserProfile>) {
    Object.assign(this, attributs);
  }

  resetProfileData() {
    this.patientResource = {id: ''};
  }

  getGender(): PatientAdministrativeGender | undefined {
    if (this.patientResource.id === '') return undefined;
    return this.patientResource.gender;
  }

  getBirthYear(): string | undefined {
    return this.patientResource.id === '' || !this.patientResource.birthDate
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

  getFhirReference(): Reference | undefined {
    if (this.patientResource.id !== '') {
      return {
        display: this.getFullName(),
        reference: 'Patient/' + this.patientResource.id,
      };
    } else {
      return undefined;
    }
  }

  updateSituationQuestionnaireResponse(response: QuestionnaireResponse): void {
    if (
      !this.situationQuestionnaireResponse ||
      (this.situationQuestionnaireResponse?.authored &&
        response.authored &&
        this.situationQuestionnaireResponse.authored < response.authored)
    ) {
      this.situationQuestionnaireResponse = response;
    }
  }

  getSituationQuestionnaireResponse(): QuestionnaireResponse | undefined {
    return this.situationQuestionnaireResponse;
  }
}
