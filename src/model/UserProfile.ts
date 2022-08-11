import {
  CarePlan,
  CarePlanStatus,
  Patient,
  PatientAdministrativeGender,
  PatientCommunication,
  Reference
} from '@i4mi/fhir_r4';

import DEFAULT_CONTACTS from '../resources/static/defaultContacts';
import EmergencyContact from './EmergencyContact';
import PrismSession, {PrismResources} from './PrismSession';
import SecurityPlanModel from './SecurityPlan';

export default class UserProfile {
  patientResource: Patient = {id: ''};
  emergencyContacts: EmergencyContact[] = [];
  securityPlanHistory: SecurityPlanModel[] = [];
  currentSecurityPlan: SecurityPlanModel = new SecurityPlanModel({});
  prismSessions: PrismSession[] = [];

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
      this.emergencyContacts = _attributes.emergencyContacts.map((c) => new EmergencyContact(c));
    }
    if (_attributes.securityPlanHistory) {
      this.securityPlanHistory = _attributes.securityPlanHistory.map((sp) => new SecurityPlanModel(sp));
    }
    if (_attributes.currentSecurityPlan) {
      this.currentSecurityPlan = new SecurityPlanModel(_attributes.currentSecurityPlan);
    }
    if (_attributes.prismSessions) {
      this.prismSessions = _attributes.prismSessions.map((ps) => new PrismSession(ps));
    }
  }

  /**
   * CAVE: Modifies store, do not call outside of reducer
   **/
  setEmergencyContacts(_contacts: EmergencyContact[]): void {
    _contacts.forEach((contact) => this.addEmergencyContact(contact));
  }

  /**
   * CAVE: Modifies store, do not call outside of reducer
   **/
  addEmergencyContact(_contact: EmergencyContact): void {
    const index = this.emergencyContacts.findIndex((c) => c.isEqual(_contact));
    if (index === -1) {
      this.emergencyContacts.push(_contact);
    } else {
      this.emergencyContacts[index] = _contact;
    }
  }

  /**
   * CAVE: Modifies store, do not call outside of reducer
   **/
  resetProfileData() {
    this.patientResource = {id: ''};
    this.emergencyContacts = [];
    this.securityPlanHistory = [];
    this.currentSecurityPlan = new SecurityPlanModel({});
    this.prismSessions = [];
  }

  getFhirId(): string {
    if (this.patientResource.id) {
      return this.patientResource.id;
    } else {
      throw new Error('No FHIR resource id set.');
    }
  }

  getEmergencyContacts(): EmergencyContact[] {
    const allContacts = DEFAULT_CONTACTS.map((dc) => new EmergencyContact(dc)).concat(
      this.emergencyContacts.filter((contact) => !contact.fhirResource || contact.fhirResource.active)
    );
    return allContacts;
  }

  hasOnlyDeletedContacts(): boolean {
    if (this.emergencyContacts.length === 0) return false;
    let hasActiveContact = false;
    this.emergencyContacts.forEach((contact) => {
      if (contact.fhirResource.active) hasActiveContact = true;
    });
    return !hasActiveContact;
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

  /**
   * Sets a new current security plan. If you want to archive the current security plan,
   * use the replaceCurrentSecurityPlan() method
   * DO NOT USE OUTSIDE THE REDUCER
   * @param _fhirResource a CarePlan FHIR resource than complies to the SecurityPlan IG
   */
  setSecurityPlan(_fhirResource: CarePlan): void {
    this.currentSecurityPlan = new SecurityPlanModel(_fhirResource);
  }

  /**
   * Sets the history of the security plans.
   * DO NOT USE OUTSIDE THE REDUCER
   * @param _fhirResources an Array of CarePlan resources representing the Security Plan history
   * @throws               an Error if the array contains an active security plan
   */
  setSecurityPlanHistory(_fhirResources: CarePlan[]): void {
    this.securityPlanHistory = _fhirResources.map((r) => {
      if (r.status === CarePlanStatus.ACTIVE) {
        throw new Error('Can not put active Security Plan to history.');
      }
      return new SecurityPlanModel(r);
    });
  }

  /**
   * Replaces and archives the current security plan.
   * DO NOT USE OUTSIDE THE REDUCER
   * @param _plan   the new Security Plan as SecurityPlan object
   */
  replaceCurrentSecurityPlan(_plan: SecurityPlanModel): void {
    const oldSecurityPlan = new SecurityPlanModel(
      this.currentSecurityPlan.getFhirResource(this.getFhirReference() || {})
    );
    oldSecurityPlan.setStatusToArchived();
    this.securityPlanHistory.push(oldSecurityPlan);

    this.currentSecurityPlan = _plan;
  }

  /**
   * Deletes the current security plan and does NOT archive it.
   * DO NOT USE OUTSIDE THE REDUCER
   */
  deleteCurrentSecurityPlan(): void {
    this.currentSecurityPlan = new SecurityPlanModel({});
  }

  /**
   * Deletes a security plan from the archive.
   * DO NOT USE OUTSIDE THE REDUCER
   */
  removeSecurityPlanFromArchive(plan: SecurityPlanModel): void {
    const index = this.securityPlanHistory.findIndex((historyPlan) => historyPlan.hasEqualFhirId(plan.fhirResource));
    if (index === -1) return;
    this.securityPlanHistory.splice(index, 1);
  }

  /**
   * Gets the current Security Plan
   * @returns A representation of the current security plan,
   *          that is thought for read access only.
   */
  getCurrentSecurityPlan(): SecurityPlanModel {
    return this.currentSecurityPlan;
  }

  /**
   * Gets the FHIR resource of the current Security Plan
   * @returns  A CarePlan FHIR resource representing the current security plan
   * @throws   An error if no Patient resource has been set yet to the user profile.
   */
  getSecurityPlanAsFhir(): CarePlan {
    const reference = this.getFhirReference();
    if (!reference) throw new Error('Error in getSecurityPlanasFhir(): UserProfile has no Patient resource set.');
    return this.currentSecurityPlan.getFhirResource(reference);
  }

  /**
   * Returns the history of security plans, without plans with status "entered in error"
   * @returns The history of SecurityPlans as an array.
   */
  getSecurityPlanHistory(): SecurityPlanModel[] {
    return this.securityPlanHistory
      .filter((plan) => plan.fhirResource.status !== CarePlanStatus.ENTERED_IN_ERROR)
      .sort(
        (a, b) => new Date(b.fhirResource.created || 0).valueOf() - new Date(a.fhirResource.created || 0).valueOf()
      );
  }

  /**
   * Creates PRISM-S Sessions from FHIR Resources and stores them to the user profile.
   * Use this to add the previous sessions loaded from MIDATA.
   * DO NOT USE OUTSIDE THE REDUCER
   * @param _resources Array of corresponding Observation, Media,
   *                   QuestionnaireResponse and Questionnaire resources.
   */
  setPrismSessions(_resources: PrismResources[]): void {
    this.prismSessions = _resources.map((r) => new PrismSession(r));
  }

  /**
   * Add a single PrismSession to the existing sessions (without overwriting previous
   * sessions). Use this to
   * DO NOT USE OUTSIDE THE REDUCER
   * @param _session  a PrismSession object representing the session.
   */
  addPrismSession(_session: PrismSession) {
    this.prismSessions.push(_session);
  }

  /**
   * Gets the previous prism sessions the user has done.
   * @returns An array of PrismSession objects.
   */
  getPrismSessions(): PrismSession[] {
    return this.prismSessions.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
  }
}
