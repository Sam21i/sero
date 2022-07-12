/**
 * @format
 */

import './i18n';

import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
import App from './src/containers/App';

AppRegistry.registerComponent(appName, () => App);
