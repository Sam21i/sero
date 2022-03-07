import Action from '../helpers/Action';
import {SET_EMERGENCY_CONTACTS, UPDATE_USER_PROFILE} from '../definitions';
import {UserProfileData} from './reducer';
import EmergencyContact from '../../model/EmergencyContact';

export function updateUserProfile(dispatch, userProfileInfo: UserProfileData) {
  dispatch(
      new Action(UPDATE_USER_PROFILE, userProfileInfo).getObjectAction()
  );
}

export function setEmergencyContacts(
  dispatch,
  contacts: EmergencyContact[],
) {
  dispatch(
    new Action(SET_EMERGENCY_CONTACTS, contacts).getObjectAction(),
  );
}
