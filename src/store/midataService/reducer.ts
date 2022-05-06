import {createReducer} from '../helpers/reducerCreator';
import MidataService from '../../model/MidataService';
import {REHYDRATE} from 'redux-persist';
import {Resource} from '@i4mi/fhir_r4';
import {
  UserAuthenticationData,
  UPDATE_USER_AUTHENTICATION,
  LOGOUT_AUTHENTICATE_USER,
  ADD_RESOURCE,
  ADD_RESOURCE_TO_SYNCHRONIZE,
  RESOURCE_SENT
} from '../definitions';
import Config from 'react-native-config';

// Definition of actions listeners
const MiDataServiceStore = createReducer(new MidataService(), {
  [REHYDRATE](state: MidataService, action) {
    if (action.payload && action.payload.MiDataServiceStore) {
      if (action.payload.MiDataServiceStore.hasOwnProperty('pendingResources')) {
        action.payload.MiDataServiceStore.pendingResources.forEach((item) => {
          item.isUploading = false;
        });
      }

      if (!action.payload.MiDataServiceStore.currentSession.hasOwnProperty('server')) {
        action.payload.MiDataServiceStore.currentSession.server = Config.host;
      }

      return new MidataService(action.payload.MiDataServiceStore);
    }
    return state;
  },
  [UPDATE_USER_AUTHENTICATION](state: MidataService, action) {
    let newState = new MidataService(state);
    let newValues: UserAuthenticationData = action.data;
    newState.authenticateUser(
      newValues.accessToken,
      newValues.accessTokenExpirationDate,
      newValues.refreshToken,
      newValues.server
    );
    return newState;
  },
  [ADD_RESOURCE](state: MidataService, action) {
    let newState = new MidataService(state);
    const index = newState.pendingResources.findIndex((resource) => resource.resource === action.data);
    if (index === -1) {
      // only add, when exact same resource is not already in queue
      newState.pendingResources.push({resource: action.data, isUploading: false, mustBeSynchronized: false});
    }
    return newState;
  },
  [ADD_RESOURCE_TO_SYNCHRONIZE](state: MidataService, action) {
    let newState = new MidataService(state);
    let index = newState.pendingResources.findIndex((resource) => resource.resource.id === action.data.id);
    if (index === -1) {
      // only add, when exact same resource is not already in queue
      newState.pendingResources.push({
        resource: action.data,
        isUploading: false,
        mustBeSynchronized: action.data.id.indexOf('temp') === -1 // don't have to sync resources with temp id
      });
    } else {
      // when the resource with the same id is already in queue, we replace it with the newer version
      newState.pendingResources[index] = {
        resource: action.data,
        isUploading: false,
        mustBeSynchronized: action.data.id.indexOf('temp') === -1 // don't have to sync resources with temp id
      };
    }
    return newState;
  },
  [RESOURCE_SENT](state: MidataService, action) {
    let newState = new MidataService(state);
    let resource = action.resource.resource as Resource;

    // remove from pending resources
    let resourceIndex = newState.pendingResources.findIndex((item) => {
      return item.resource == resource;
    });

    if (resourceIndex > -1) {
      newState.pendingResources.splice(resourceIndex, 1);
    }

    return newState;
  },
  [LOGOUT_AUTHENTICATE_USER](state: MidataService) {
    let newState = new MidataService(state);
    newState.logoutUser();
    newState.pendingResources = [];
    return newState;
  }
});

export default MiDataServiceStore;
