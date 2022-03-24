import { createReducer } from '../helpers/reducerCreator';
import { REHYDRATE } from 'redux-persist';
import UserProfile from '../../model/UserProfile';
import { ADD_TO_USER_PROFILE, LOGOUT_AUTHENTICATE_USER, RESOURCE_SENT, SET_EMERGENCY_CONTACTS, UPDATE_USER_PROFILE } from '../definitions';
import EmergencyContact from '../../model/EmergencyContact';
import { Resource } from '@i4mi/fhir_r4';

export type UserProfileData = Partial<UserProfile>;

// Definition of actions listeners
const UserProfileStore = createReducer(new UserProfile(), {
  [REHYDRATE](state: UserProfile, action) {
    if (action.payload && action.payload.UserProfileStore) {
      return new UserProfile(action.payload.UserProfileStore);
    }
    return state;
  },
  [UPDATE_USER_PROFILE](state: UserProfile, action) {
    let newState = new UserProfile(state);
    let newValues: UserProfileData = action.data;
    newState.updateProfile(newValues);
    return newState;
  },
  [SET_EMERGENCY_CONTACTS](state: UserProfile, action: {data: EmergencyContact[]}) {
    let newState = new UserProfile(state);
    newState.setEmergencyContacts(action.data);
    return newState;
  },
  [LOGOUT_AUTHENTICATE_USER](state: UserProfile) {
    let newState = new UserProfile(state);
    newState.resetProfileData();
    return newState;
  },
  [ADD_TO_USER_PROFILE](state: UserProfile, action: {data: EmergencyContact}) {
    let newState = new UserProfile(state);
    newState.addEmergencyContact(new EmergencyContact(action.data));
    return newState;
  },
  [RESOURCE_SENT](
    state: UserProfile,
    action: {
      type: string,
      resource: {
        resource: Resource,
        isUploading: boolean,
        mustBeSynchronized: boolean,
        timestamp: Date
      }
    }) {
      if (action.resource.resource.resourceType === 'RelatedPerson') {
        // the resource id is already updated by reference, but needs to be persisted in store
        return new UserProfile(state);
      } else {
        return state;
      }
  },
});

export default UserProfileStore;
