import Action from '../helpers/Action';
import {ADD_SECURITY_PLAN, DELETE_SECURITY_PLAN, REMOVE_EMERGENCY_CONTACT, REPLACE_SECURITY_PLAN, SET_EMERGENCY_CONTACTS, UPDATE_USER_PROFILE} from '../definitions';
import {UserProfileData} from './reducer';
import EmergencyContact from '../../model/EmergencyContact';
import SecurityPlanModel from '../../model/SecurityPlan';
import { CarePlan } from '@i4mi/fhir_r4';

export function updateUserProfile(dispatch, userProfileInfo: UserProfileData) {
  dispatch(
      new Action(UPDATE_USER_PROFILE, userProfileInfo).getObjectAction()
  );
}

export function setEmergencyContacts(dispatch, contacts: EmergencyContact[]) {
  dispatch(
    new Action(SET_EMERGENCY_CONTACTS, contacts).getObjectAction()
  );
}

export function removeEmergencyContact(dispatch, contact: EmergencyContact) {
  dispatch(
    new Action(REMOVE_EMERGENCY_CONTACT, contact).getObjectAction()
  );
}

export function setSecurityPlan(dispatch, plan: CarePlan) {
  dispatch(
    new Action(ADD_SECURITY_PLAN, plan).getObjectAction()
  );
}

export function deleteSecurityPlan(dispatch) {
  dispatch(
    new Action(DELETE_SECURITY_PLAN).getObjectAction()
  );
}

export function replaceSecurityPlan(dispatch, plan: SecurityPlanModel) {
  dispatch(
    new Action(REPLACE_SECURITY_PLAN, plan).getObjectAction()
  );
}
