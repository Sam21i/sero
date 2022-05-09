import {createReducer} from '../helpers/reducerCreator';
import {REHYDRATE} from 'redux-persist';
import UserProfile from '../../model/UserProfile';
import {
  ADD_SECURITY_PLAN,
  ADD_TO_USER_PROFILE,
  LOGOUT_AUTHENTICATE_USER,
  REPLACE_SECURITY_PLAN,
  RESOURCE_SENT,
  SET_EMERGENCY_CONTACTS,
  SET_SECURITY_PLAN_HISTORY,
  UPDATE_USER_PROFILE
} from '../definitions';
import EmergencyContact from '../../model/EmergencyContact';
import {CarePlan, CarePlanStatus, RelatedPerson, Resource} from '@i4mi/fhir_r4';
import SecurityPlanModel from '../../model/SecurityPlan';

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
  [ADD_TO_USER_PROFILE](state: UserProfile, action: {data: Resource}) {
    if (action.data.resourceType === 'RelatedPerson') {
      let newState = new UserProfile(state);
      newState.addEmergencyContact(new EmergencyContact(action.data as RelatedPerson));
      return newState;
    } else {
      return state;
    }
  },
  [ADD_SECURITY_PLAN](state: UserProfile, action: {data: CarePlan}) {
    let newState = new UserProfile(state);
    newState.setSecurityPlan(action.data);
    return newState;
  },
  [SET_SECURITY_PLAN_HISTORY](state: UserProfile, action: {data: CarePlan[]}) {
    let newState = new UserProfile(state);
    newState.setSecurityPlanHistory(action.data);
    return newState;
  },
  [REPLACE_SECURITY_PLAN](state: UserProfile, action: {data: SecurityPlanModel}) {
    let newState = new UserProfile(state);
    newState.replaceCurrentSecurityPlan(action.data);
    return newState;
  },
  [RESOURCE_SENT](
    state: UserProfile,
    action: {
      type: string;
      resource: {
        resource: Resource;
        isUploading: boolean;
        mustBeSynchronized: boolean;
        timestamp: Date;
      };
    }
  ) {
    if (action.resource.resource.resourceType === 'RelatedPerson') {
      // the resource id is already updated by reference, but needs to be persisted in store
      return new UserProfile(state);
    } else if (action.resource.resource.resourceType === 'CarePlan') {
      const carePlan = action.resource.resource as CarePlan;
      const newResourceId = carePlan.id + '';

      let newState = new UserProfile(state);
      if (!action.resource.mustBeSynchronized) {
        if (newState.getCurrentSecurityPlan().hasEqualFhirId(carePlan)) {
          // new security plan replacing old one, but already updated, nothing to do here
        }
      } else if (carePlan.status === CarePlanStatus.REVOKED && newState.currentSecurityPlan.hasEqualFhirId(carePlan)) {
        newState.deleteCurrentSecurityPlan();
      } else {
        // fight the reducer voodoo that somewhere got the old temporary id and put it on the careplan
        carePlan.id = newResourceId;
      }
      return newState;
    } else {
      return state;
    }
  }
});

export default UserProfileStore;
