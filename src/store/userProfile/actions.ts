import {CarePlan, CarePlanStatus, Reference} from '@i4mi/fhir_r4';

import EmergencyContact from '../../model/EmergencyContact';
import PrismSession, {PrismResources} from '../../model/PrismSession';
import SecurityPlanModel from '../../model/SecurityPlan';
import {
  ADD_PRISM_SESSION,
  ADD_RESOURCE_TO_SYNCHRONIZE,
  ADD_SECURITY_PLAN,
  DELETE_ARCHIVED_SECURITY_PLAN,
  REACTIVATE_SECURITY_PLAN,
  REMOVE_EMERGENCY_CONTACT,
  REPLACE_SECURITY_PLAN,
  SET_EMERGENCY_CONTACTS,
  SET_PRISM_SESSIONS,
  SET_SECURITY_PLAN_HISTORY,
  UPDATE_USER_PROFILE
} from '../definitions';
import Action from '../helpers/Action';
import {addResource, synchronizeResource} from '../midataService/actions';
import {UserProfileData} from './reducer';

export function updateUserProfile(dispatch, userProfileInfo: UserProfileData) {
  dispatch(new Action(UPDATE_USER_PROFILE, userProfileInfo).getObjectAction());
}

export function setEmergencyContacts(dispatch, contacts: EmergencyContact[]) {
  dispatch(new Action(SET_EMERGENCY_CONTACTS, contacts).getObjectAction());
}

export function removeEmergencyContact(dispatch, contact: EmergencyContact) {
  dispatch(new Action(REMOVE_EMERGENCY_CONTACT, contact).getObjectAction());
}

export function setSecurityPlan(dispatch, plan: CarePlan) {
  dispatch(new Action(ADD_SECURITY_PLAN, plan).getObjectAction());
}

export function deleteSecurityPlan(dispatch, plan: SecurityPlanModel, userReference: Reference) {
  plan.setStatusToArchived();
  synchronizeResource(dispatch, plan.getFhirResource(userReference));
}

export function deleteArchivedSecurityPlan(dispatch, planToDelete: SecurityPlanModel) {
  planToDelete.fhirResource.status = CarePlanStatus.ENTERED_IN_ERROR;
  dispatch(new Action(DELETE_ARCHIVED_SECURITY_PLAN, planToDelete).getObjectAction());
  synchronizeResource(dispatch, planToDelete.fhirResource);
}

export function replaceSecurityPlan(
  dispatch,
  newPlan: SecurityPlanModel,
  oldPlan: SecurityPlanModel,
  userReference: Reference
) {
  oldPlan.setStatusToArchived();
  synchronizeResource(dispatch, oldPlan.getFhirResource(userReference, true));
  addResource(dispatch, newPlan.getFhirResource(userReference));
  dispatch(new Action(REPLACE_SECURITY_PLAN, newPlan).getObjectAction());
}

export function reactiveSecurityPlan(
  dispatch,
  planToReactivate: SecurityPlanModel,
  currentPlan: SecurityPlanModel,
  userReference: Reference
) {
  planToReactivate.setStatusToActive();
  currentPlan.setStatusToArchived();
  synchronizeResource(dispatch, planToReactivate.getFhirResource(userReference, false));
  synchronizeResource(dispatch, currentPlan.getFhirResource(userReference, true));
  dispatch(new Action(REACTIVATE_SECURITY_PLAN, planToReactivate).getObjectAction());
}

export function setPrismSessionsFromMIDATA(dispatch, sessions: PrismResources[]) {
  dispatch(new Action(SET_PRISM_SESSIONS, sessions).getObjectAction());
}

export function addNewPrismSession(dispatch, session: PrismSession) {
  dispatch(new Action(ADD_PRISM_SESSION, session).getObjectAction());
}

export function setSecurityPlanHistory(dispatch, plans: CarePlan[]) {
  dispatch(new Action(SET_SECURITY_PLAN_HISTORY, plans).getObjectAction());
}
