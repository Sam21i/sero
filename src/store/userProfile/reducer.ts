import {CarePlan, CarePlanStatus, RelatedPerson, Resource} from '@i4mi/fhir_r4';
import {REHYDRATE} from 'redux-persist';

import EmergencyContact from '../../model/EmergencyContact';
import PrismSession, {PrismResources} from '../../model/PrismSession';
import SecurityPlanModel from '../../model/SecurityPlan';
import UserProfile from '../../model/UserProfile';
import {
  ADD_PRISM_SESSION,
  ADD_SECURITY_PLAN,
  ADD_TO_USER_PROFILE,
  LOGOUT_AUTHENTICATE_USER,
  REPLACE_SECURITY_PLAN,
  RESOURCE_SENT,
  SET_EMERGENCY_CONTACTS,
  SET_PRISM_SESSIONS,
  SET_SECURITY_PLAN_HISTORY,
  UPDATE_USER_PROFILE
} from '../definitions';
import {createReducer} from '../helpers/reducerCreator';

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
    const newState = new UserProfile(state);
    const newValues: UserProfileData = action.data;
    newState.updateProfile(newValues);
    return newState;
  },
  [SET_EMERGENCY_CONTACTS](state: UserProfile, action: {data: EmergencyContact[]}) {
    const newState = new UserProfile(state);
    newState.setEmergencyContacts(action.data);
    return newState;
  },
  [LOGOUT_AUTHENTICATE_USER](state: UserProfile) {
    const newState = new UserProfile(state);
    newState.resetProfileData();
    return newState;
  },
  [ADD_TO_USER_PROFILE](state: UserProfile, action: {data: Resource}) {
    if (action.data.resourceType === 'RelatedPerson') {
      const newState = new UserProfile(state);
      newState.addEmergencyContact(new EmergencyContact(action.data as RelatedPerson));
      return newState;
    } else {
      return state;
    }
  },
  [ADD_SECURITY_PLAN](state: UserProfile, action: {data: CarePlan}) {
    const newState = new UserProfile(state);
    newState.setSecurityPlan(action.data);
    return newState;
  },
  [SET_SECURITY_PLAN_HISTORY](state: UserProfile, action: {data: CarePlan[]}) {
    const newState = new UserProfile(state);
    newState.setSecurityPlanHistory(action.data);
    return newState;
  },
  [REPLACE_SECURITY_PLAN](state: UserProfile, action: {data: SecurityPlanModel}) {
    const newState = new UserProfile(state);
    newState.replaceCurrentSecurityPlan(action.data);
    return newState;
  },
  [SET_PRISM_SESSIONS](state: UserProfile, action: {data: PrismResources[]}) {
    const newState = new UserProfile(state);
    newState.setPrismSessions(action.data);
    return newState;
  },
  [ADD_PRISM_SESSION](state: UserProfile, action: {data: PrismSession}) {
    const newState = new UserProfile(state);
    newState.addPrismSession(action.data);
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
    const resource = action.resource.resource;
    if (resource.resourceType === 'RelatedPerson') {
      // the resource id is already updated by reference, but needs to be persisted in store
      return new UserProfile(state);
    } else if (resource.resourceType === 'CarePlan') {
      const carePlan = action.resource.resource as CarePlan;
      const newResourceId = carePlan.id + '';

      const newState = new UserProfile(state);
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
