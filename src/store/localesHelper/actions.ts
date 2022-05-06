import Action from '../helpers/Action';
import {UPDATE_LOCALE_LANGUAGE} from '../definitions';
import {LocalHelperData} from './reducer';

export function updateAppLanguage(dispatch, lang: LocalHelperData) {
  dispatch(new Action(UPDATE_LOCALE_LANGUAGE, lang).getObjectAction());
}
