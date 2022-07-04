import 'intl';

import memoize from 'lodash.memoize';
import {I18nManager} from 'react-native';
import I18n from 'react-native-i18n';
import * as RNLocalize from 'react-native-localize';

// Import all locales
import * as de from '../resources/locales/de.json';
import * as fr from '../resources/locales/fr.json';
import * as it from '../resources/locales/it.json';

const DEFAULT_LOCALE = 'de';
const translationKey: {[index: string]: any} = {de: de, fr: fr, it: it};

// Initialisation of languages:
// Should the app fallback to Deutsh if user locale doesn't exists
I18n.defaultLocale = DEFAULT_LOCALE;
I18n.fallbacks = true;

const translate = memoize(
  (key: string, config: any) => I18n.t(key, config),
  (key: string, config: any) => (config ? key + JSON.stringify(config) : key)
);

//Store object:
export default class LocalesHelper {
  currentLang: string | undefined;
  private static isAppLocalesLoaded = false;

  constructor(localizationHelper?: Partial<LocalesHelper>) {
    if (localizationHelper !== undefined && localizationHelper.currentLang !== undefined) {
      this.updateLanguage(localizationHelper.currentLang);
    } else {
      this.currentLang = I18n.locale;
      this.loadAppLocalization();
    }

    require('intl/locale-data/jsonp/de-CH');
  }

  loadAppLocalization = () => {
    if (!LocalesHelper.isAppLocalesLoaded) {
      // fallback if no available language fits
      const fallback = {languageTag: DEFAULT_LOCALE, isRTL: false};
      const {languageTag, isRTL} = RNLocalize.findBestAvailableLanguage(Object.keys(translationKey)) || fallback;
      this.updateLanguage(languageTag, isRTL);
      LocalesHelper.isAppLocalesLoaded = true;
    }
  };

  localeString(name: string, params = {}) {
    return translate(name, params);
  }

  updateLanguage(language: string, isRTL = false) {
    if (language !== this.currentLang) {
      // clear translation cache
      translate.cache.clear();
      // update layout direction
      I18nManager.forceRTL(isRTL);

      // set i18n-js config
      I18n.translations = {[language]: translationKey[language]};
      I18n.locale = language;

      this.currentLang = language;
    }
  }

  getDevicePreferedLanguage(): string {
    const fallback = {languageTag: DEFAULT_LOCALE, isRTL: false};
    const {languageTag} = RNLocalize.findBestAvailableLanguage(Object.keys(translationKey)) || fallback;
    return languageTag;
  }

  getCurrentLanguage() {
    return I18n.locale;
  }

  getDefaultLanguage() {
    return I18n.defaultLocale;
  }

  getAvailableLanguage() {
    return translationKey;
  }
}
