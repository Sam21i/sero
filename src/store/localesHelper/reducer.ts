import {REHYDRATE} from 'redux-persist';

import LocalesHelper from '../../locales';
import {UPDATE_LOCALE_LANGUAGE} from '../definitions';
import {createReducer} from '../helpers/reducerCreator';

export type LocalHelperData = string;

// Definition of actions listeners
const LocalesHelperStore = createReducer(new LocalesHelper(), {
  [REHYDRATE](state: LocalesHelper, action) {
    if (action.payload && action.payload.LocalesHelperStore) {
      return new LocalesHelper(action.payload.LocalesHelperStore);
    }
    return state;
  },
  [UPDATE_LOCALE_LANGUAGE](state: LocalesHelper, action) {
    const newState = new LocalesHelper(state);
    const newLang: string = action.data;
    newState.updateLanguage(newLang);
    return newState;
  }
});

export default LocalesHelperStore;
