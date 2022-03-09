import Action from '../helpers/Action';
import {REMOVE_EMERGENCY_CONTACT, SET_EMERGENCY_CONTACTS, UPDATE_USER_PROFILE} from '../definitions';
import {UserProfileData} from './reducer';
import EmergencyContact from '../../model/EmergencyContact';

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