import { createReducer } from '../helpers/reducerCreator';
import { REHYDRATE } from 'redux-persist';
import UserProfile from '../../model/UserProfile';
import { ADD_SECURITY_PLAN, ADD_TO_USER_PROFILE, DELETE_SECURITY_PLAN, LOGOUT_AUTHENTICATE_USER, REPLACE_SECURITY_PLAN, RESOURCE_SENT, SET_EMERGENCY_CONTACTS, SET_SECURITY_PLAN_HISTORY, UPDATE_USER_PROFILE } from '../definitions';
import EmergencyContact from '../../model/EmergencyContact';
import { CarePlan, Resource } from '@i4mi/fhir_r4';
import { SecurityPlan } from '../../model/SecurityPlan';

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
  [ADD_SECURITY_PLAN](state: UserProfile, action: {data: CarePlan}) {
    let newState = new UserProfile(state);
    newState.setSecurityPlan(action.data)
    return newState;
  },
  [DELETE_SECURITY_PLAN](state: UserProfile) {
    let newState = new UserProfile(state);
    newState.deleteCurrentSecurityPlan();
    return newState;
  },
  [REPLACE_SECURITY_PLAN](state: UserProfile, action: {data: SecurityPlan}) {
    let newState = new UserProfile(state);
    newState.replaceCurrentSecurityPlan(action.data)
    return newState;
  },
  [SET_SECURITY_PLAN_HISTORY](state: UserProfile, action: {data: CarePlan[]}) {
    let newState = new UserProfile(state);
    newState.setSecurityPlanHistory(action.data);
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
      if (action.resource.resource.resourceType === 'RelatedPerson' || action.resource.resource.resourceType === 'CarePlan') {
        // the resource id is already updated by reference, but needs to be persisted in store
        return new UserProfile(state);
      } else {
        return state;
      }
  },
});

export default UserProfileStore;
