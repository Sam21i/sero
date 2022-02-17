import { createReducer } from '../helpers/reducerCreator';
import { REHYDRATE } from 'redux-persist';
import UserProfile from '../../model/UserProfile';
import { ADD_TO_USER_PROFILE, LOGOUT_AUTHENTICATE_USER, SET_ASSISTED_ZIP, RESOURCE_SENT, UPDATE_USER_PROFILE } from '../definitions';

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
    [RESOURCE_SENT](state: UserProfile, action) {
        let newState = new UserProfile(state);
        const resource = action.resource.resource;
        if (resource.resourceType === 'QuestionnaireResponse' && resource.questionnaire === 'http://to.be.defined|0.1') { // TODO correct URL
            newState.updateSituationQuestionnaireResponse(resource);
        }
        return newState;
    },
    [ADD_TO_USER_PROFILE](state: UserProfile, action) {
        let newState = new UserProfile(state);
        const resource = action.data;
        if (resource.resourceType === 'QuestionnaireResponse' && resource.questionnaire === 'http://to.be.defined|0.1') { // TODO correct URL
            newState.updateSituationQuestionnaireResponse(resource);
        }
        return newState;
    },
    [LOGOUT_AUTHENTICATE_USER](state: UserProfile) {
        let newState = new UserProfile(state);
        newState.resetProfileData();
        return newState;
    },
    [SET_ASSISTED_ZIP](state: UserProfile, action) {
        let newState = new UserProfile(state);
        newState.setAssistedZip(action.data);
        return newState;
    }
});

export default UserProfileStore;
