import 'intl';
import 'intl-pluralrules';
import 'intl/locale-data/jsonp/de-CH';
import 'intl/locale-data/jsonp/fr-CH';
import 'intl/locale-data/jsonp/it-CH';

import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

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
      if (error || !language) {
        if (error) {
          console.log('Error fetching Languages from asyncstorage ', error);
        }
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
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
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
