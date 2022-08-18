import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import images from '../resources/images/images';
import {persistor, store} from '../store';
import {colors} from '../styles/App.style';
import AssessmentArchive from './AssessmentArchive';
import AssessmentBoard from './AssessmentBoard';
import AssessmentContacts from './AssessmentContacts';
import AssessmentEndOptions from './AssessmentEndOptions';
import AssessmentImage from './AssessmentImage';
import AssessmentIntroDescription from './AssessmentIntroDescription';
import AssessmentIntroTutorial from './AssessmentIntroTutorial';
import AssessmentMain from './AssessmentMain';
import AssessmentQuestions from './AssessmentQuestions';
import Contacts from './Contacts';
import Information from './Information';
import Main from './Main';
import Onboarding from './Onboarding';
import SecurityplanArchive from './SecurityplanArchive';
import SecurityplanCurrent from './SecurityplanCurrent';
import SecurityplanIntroDescription from './SecurityplanIntroDescription';
import SecurityplanIntroTutorial from './SecurityplanIntroTutorial';
import SecurityplanMain from './SecurityplanMain';
import Settings from './Settings';
import Welcome from './Welcome';
import AssessmentIntroTutorialLandscape from './AssessmentIntroTutorialLandscape';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PropsType {}

interface State {
  showIntro: boolean;
}

export enum STORAGE {
  LANGUAGE = '@userLanguage',
  SHOULD_DISPLAY_ONBOARDING = '@displayOnboarding',
  ASKED_FOR_CONTACT_PERMISSION = '@contactPermission',
  CONTACT_PERMISSION_STATUS_ANDROID = '@contactPermissionStatusAndroid',
  SHOULD_DISPLAY_SECURITYPLAN_INTRO = '@displayAssessmentIntro',
  SHOULD_DISPLAY_ASSESSMENT_INTRO = '@displaySecurityplanIntro',
  ASKED_FOR_CAMERA_PERMISSION = '@cameraPermission',
  CAMERA_PERMISSION_STATUS_ANDROID = '@cameraPermissionStatusAndroid'
}

const OnboardingStack = createStackNavigator();

function OnboardingStackScreen() {
  return (
    <OnboardingStack.Navigator>
      <OnboardingStack.Screen
        name='Welcome'
        component={Welcome}
        options={{headerShown: false}}
      />
      <OnboardingStack.Screen
        name='Onboarding'
        component={Onboarding}
        options={{headerShown: false}}
      />
    </OnboardingStack.Navigator>
  );
}

const MainStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen
        name='Main'
        component={Main}
        options={{animationEnabled: false}}
      />
      <MainStack.Screen
        name='Contacts'
        component={Contacts}
        options={{animationEnabled: false}}
      />
    </MainStack.Navigator>
  );
}

const InformationStack = createStackNavigator();

function InformationStackScreen() {
  return (
    <InformationStack.Navigator>
      <InformationStack.Screen
        name='Information'
        component={Information}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </InformationStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={Settings}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </SettingsStack.Navigator>
  );
}

const SecurityplanIntroStack = createStackNavigator();

function SecurityplanIntroStackScreen() {
  return (
    <SecurityplanIntroStack.Navigator>
      <SecurityplanIntroStack.Screen
        name='SecurityplanIntroDescription'
        component={SecurityplanIntroDescription}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <SecurityplanIntroStack.Screen
        name='SecurityplanIntroTutorial'
        component={SecurityplanIntroTutorial}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </SecurityplanIntroStack.Navigator>
  );
}

const SecurityplanStack = createStackNavigator();

function SecurityplanStackScreen() {
  return (
    <SecurityplanStack.Navigator>
      <SecurityplanStack.Screen
        name='SecurityplanMain'
        component={SecurityplanMain}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <SecurityplanIntroStack.Screen
        name='SecurityplanIntroStackScreen'
        component={SecurityplanIntroStackScreen}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <SecurityplanStack.Screen
        name='SecurityplanArchive'
        component={SecurityplanArchive}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </SecurityplanStack.Navigator>
  );
}

const SecurityplanSessionStack = createStackNavigator();

function SecurityplanSessionStackScreen() {
  return (
    <SecurityplanSessionStack.Navigator>
      <SecurityplanStack.Screen
        name='SecurityplanCurrent'
        component={SecurityplanCurrent}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </SecurityplanSessionStack.Navigator>
  );
}

const AssessmentIntroStack = createStackNavigator();

function AssessmentIntroStackScreen() {
  return (
    <AssessmentIntroStack.Navigator>
      <AssessmentIntroStack.Screen
        name='AssessmentIntroDescription'
        component={AssessmentIntroDescription}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />

      <AssessmentIntroStack.Screen
        name='AssessmentIntroTutorial'
        component={AssessmentIntroTutorial}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />

      <AssessmentIntroStack.Screen
        name='AssessmentIntroTutorialLandscape'
        component={AssessmentIntroTutorialLandscape}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </AssessmentIntroStack.Navigator>
  );
}

const AssessmentStack = createStackNavigator();

function AssessmentStackScreen() {
  return (
    <AssessmentStack.Navigator>
      <AssessmentStack.Screen
        name='AssessmentMain'
        component={AssessmentMain}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <AssessmentIntroStack.Screen
        name='AssessmentIntroStackScreen'
        component={AssessmentIntroStackScreen}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <AssessmentSessionStack.Screen
        name='AssessmentArchive'
        component={AssessmentArchive}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </AssessmentStack.Navigator>
  );
}

const AssessmentSessionStack = createStackNavigator();

function AssessmentSessionStackScreen() {
  return (
    <AssessmentSessionStack.Navigator>
      <AssessmentSessionStack.Screen
        name='AssessmentBoard'
        component={AssessmentBoard}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <AssessmentSessionStack.Screen
        name='AssessmentQuestions'
        component={AssessmentQuestions}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <AssessmentSessionStack.Screen
        name='AssessmentImage'
        component={AssessmentImage}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <AssessmentSessionStack.Screen
        name='AssessmentEndOptions'
        component={AssessmentEndOptions}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
      <AssessmentSessionStack.Screen
        name='AssessmentContacts'
        component={AssessmentContacts}
        options={{
          headerShown: false,
          animationEnabled: false
        }}
      />
    </AssessmentSessionStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function generateTabIcon(icon: string, focused: boolean, color: string) {
  if (focused) return <SvgCss xml={icon.replace('#808080', color)} />;
  return <SvgCss xml={icon} />;
}

export default class App extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      showIntro: true
    };
    this.checkContentToDisplay();
  }

  async checkContentToDisplay() {
    await AsyncStorage.getItem(STORAGE.SHOULD_DISPLAY_ONBOARDING).then((intro) => {
      // show intro when nothing is set (first start), or it was explicitly set to true
      this.setState({
        showIntro: intro === null || intro === 'true'
      });
      RNBootSplash.hide();
    });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar
                backgroundColor={colors.white}
                barStyle='dark-content'
              />
              <Tab.Navigator
                initialRouteName={this.state.showIntro ? 'OnboardingStackScreen' : 'MainStackScreen'}
                screenOptions={({route}) => ({
                  tabBarShowLabel: false,
                  headerShown: false,
                  tabBarStyle: {backgroundColor: colors.lightGrey},
                  tabBarActiveTintColor: colors.primary,
                  tabBarInactiveTintColor: colors.grey,
                  tabBarButton: [
                    'OnboardingStackScreen',
                    'SecurityplanStackScreen',
                    'SecurityplanSessionStackScreen',
                    'AssessmentStackScreen',
                    'AssessmentSessionStackScreen'
                  ].includes(route.name)
                    ? () => {
                        return null;
                      }
                    : undefined
                })}>
                <Tab.Screen
                  name='MainStackScreen'
                  component={MainStackScreen}
                  options={{
                    tabBarIcon: ({focused, color}) => generateTabIcon(images.imagesSVG.tabBar.home, focused, color)
                  }}
                />
                <Tab.Screen
                  name='InformationStackScreen'
                  component={InformationStackScreen}
                  options={{
                    tabBarIcon: ({focused, color}) => generateTabIcon(images.imagesSVG.tabBar.info, focused, color)
                  }}
                />
                <Tab.Screen
                  name='SettingsStackScreen'
                  component={SettingsStackScreen}
                  options={{
                    tabBarIcon: ({focused, color}) => generateTabIcon(images.imagesSVG.tabBar.settings, focused, color)
                  }}
                />
                <Tab.Screen
                  name='OnboardingStackScreen'
                  component={OnboardingStackScreen}
                  options={{
                    tabBarStyle: {display: 'none'}
                  }}
                />
                <Tab.Screen
                  name='SecurityplanStackScreen'
                  component={SecurityplanStackScreen}
                />
                <Tab.Screen
                  name='SecurityplanSessionStackScreen'
                  component={SecurityplanSessionStackScreen}
                  options={{
                    tabBarStyle: {display: 'none'}
                  }}
                />
                <Tab.Screen
                  name='AssessmentStackScreen'
                  component={AssessmentStackScreen}
                />
                <Tab.Screen
                  name='AssessmentSessionStackScreen'
                  component={AssessmentSessionStackScreen}
                  options={{
                    tabBarStyle: {display: 'none'}
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}
