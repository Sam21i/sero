import {UPDATE_LOCALE_LANGUAGE} from '../definitions';
import Action from '../helpers/Action';
import {LocalHelperData} from './reducer';

export function updateAppLanguage(dispatch, lang: LocalHelperData) {
  dispatch(new Action(UPDATE_LOCALE_LANGUAGE, lang).getObjectAction());
}
