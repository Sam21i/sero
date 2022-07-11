import {combineReducers} from 'redux';

import MiDataServiceStore from './midataService/reducer';
import UserProfileStore from './userProfile/reducer';

// Combine all reducers :
const store = Object.assign(
  {},
  {
    MiDataServiceStore,
    UserProfileStore
  }
);
export default combineReducers(store);

export type AppStore = typeof store;
