import 'react-native-get-random-values';

import {applyMiddleware, compose, createStore} from 'redux';
import logger from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

import reducers from './reducers';

// Storage configuraiton :
const storage = createSensitiveStorage({
  keychainService: 'myKeychain',
  sharedPreferencesName: 'mySharedPrefs'
});

const persistConfig = {
  timeout: 0,
  key: 'root',
  storage: storage,
  whitelist: ['LocalesHelperStore', 'ServiceDataStore', 'MiDataServiceStore', 'UserProfileStore']
  // debug: true
};
const persistedReducers = persistReducer(persistConfig, reducers);

// Middleware configuration :
const middlewares = [
  __DEV__ && logger // add logger only on dev mode.
].filter(Boolean);

const enhancer = compose(applyMiddleware(...middlewares));

// Instanciation of store :
export const store = createStore(persistedReducers, enhancer);
export const persistor = persistStore(store);
