import Action from '../helpers/Action';
import {SET_EMERGENCY_CONTACTS, UPDATE_USER_PROFILE} from '../definitions';
import {UserProfileData} from './reducer';
import {Bundle} from '@i4mi/fhir_r4';

export function updateUserProfile(dispatch, userProfileInfo: UserProfileData) {
  dispatch(new Action(UPDATE_USER_PROFILE, userProfileInfo).getObjectAction());
}

export function setEmergencyContacts(
  dispatch,
  searchBundle: Bundle,
) {
  dispatch(
    new Action(SET_EMERGENCY_CONTACTS, searchBundle).getObjectAction(),
  );
}
