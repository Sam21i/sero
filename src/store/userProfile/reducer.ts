import { createReducer } from '../helpers/reducerCreator';
import { REHYDRATE } from 'redux-persist';
import UserProfile from '../../model/UserProfile';
import { ADD_TO_USER_PROFILE, LOGOUT_AUTHENTICATE_USER, SET_EMERGENCY_CONTACTS, UPDATE_USER_PROFILE } from '../definitions';
import { Bundle } from '@i4mi/fhir_r4';
import EmergencyContact from '../../model/EmergencyContact';

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
    [SET_EMERGENCY_CONTACTS](state: UserProfile, action: {data: Bundle}) {
        let newState = new UserProfile(state);
        const resource = action.data;
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
    }
});

export default UserProfileStore;
