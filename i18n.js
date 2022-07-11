import 'intl';
import 'intl-pluralrules';
import 'intl/locale-data/jsonp/de-CH';
import 'intl/locale-data/jsonp/fr-CH';
import 'intl/locale-data/jsonp/it-CH';

import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

// Import all locales
import * as de from './src/resources/locales/de.json';
import * as fr from './src/resources/locales/fr.json';
import * as it from './src/resources/locales/it.json';

export const LANGUAGES = {
  de,
  fr,
  it
};

const LANG_CODES = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    AsyncStorage.getItem('userLanguage', (error, language) => {
      // if error fetching stored data or no language was stored
      // display errors when in DEV mode as console statements
      if (error || !language) {
        if (error) {
          console.log('Error fetching Languages from asyncstorage ', error);
        } else {
          console.log('No language is set, choosing English as fallback');
        }
        console.log(RNLocalize.getLocales());
        console.log(RNLocalize.findBestAvailableLanguage(LANG_CODES));
        const findBestAvailableLanguage = RNLocalize.findBestAvailableLanguage(LANG_CODES) || 'de';

        callback(findBestAvailableLanguage.languageTag || 'de');
        return;
      }
      callback(language);
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init: () => {},
  cacheUserLanguage: (language) => {
    AsyncStorage.setItem('userLanguage', language);
  }
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    resources: {
      de: {
        translation: require('./src/resources/locales/de.json')
      },
      fr: {
        translation: require('./src/resources/locales/fr.json')
      },
      it: {
        translation: require('./src/resources/locales/it.json')
      }
    },
    fallbackLng: 'de',
    supportedLngs: ['de', 'fr', 'it'],
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false
    },
    defaultNS: 'translation'
  });

export default i18n;
