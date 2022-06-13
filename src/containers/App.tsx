import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import Main from './Main';
import Info from './Information';
import Settings from './Settings';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createStackNavigator} from '@react-navigation/stack';
import RNBootSplash from 'react-native-bootsplash';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SvgCss} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from './Welcome';
import {store, persistor} from '../store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import SecurityplanMain from './SecurityplanMain';
import Contacts from './Contacts';
import SecurityplanCurrent from './SecurityplanCurrent';
import SecurityplanArchive from './SecurityplanArchive';
import AssessmentMain from './AssessmentMain';
import AssessmentBoard from './AssessmentBoard';
import AssessmentArchive from './AssessmentArchive';
import AssessmentIntroDescription from './AssessmentIntroDescription';
import AssessmentIntroTutorial from './AssessmentIntroTutorial';
import AssessmentQuestions from './AssessmentQuestions';
import {colors} from '../styles/App.style';
import Onboarding from './Onboarding';
import AssessmentImage from './AssessmentImage';
import Information from './Information';

interface PropsType {}

interface State {
  showIntro: boolean;
}

export enum STORAGE {
  SHOULD_DISPLAY_ONBOARDING = '@displayOnboarding',
  ASKED_FOR_CONTACT_PERMISSION = '@contactPermission',
  PERMISSION_STATUS_ANDROID = '@contactPermissionStatusAndroid',
  SHOULD_DISPLAY_ASSESSMENT_INTRO = '@displayAssessmentIntro'
}

const OnboardingStack = createStackNavigator();

function OnboardingStackScreen({route}: {route: any}) {
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

function MainStackScreen({route}: {route: any}) {
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

function InformationStackScreen({route}: {route: any}) {
  return (
    <InformationStack.Navigator>
      <InformationStack.Screen
        name='Information'
        component={Information}
      />
    </InformationStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen({route}: {route: any}) {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name='Settings'
        component={Settings}
      />
    </SettingsStack.Navigator>
  );
}

const SecurityplanStack = createStackNavigator();

function SecurityplanStackScreen({route}: {route: any}) {
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

      <SecurityplanStack.Screen
        name='SecurityplanCurrent'
        component={SecurityplanCurrent}
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

const AssessmentIntroStack = createStackNavigator();

function AssessmentIntroStackScreen({route}: {route: any}) {
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
    </AssessmentIntroStack.Navigator>
  );
}

const AssessmentStack = createStackNavigator();

function AssessmentStackScreen({route}: {route: any}) {
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

function AssessmentSessionStackScreen({route}: {route: any}) {
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
            <NavigationContainer
              onStateChange={(state) => {
                const mainScreenHistoryIndex =
                  state?.history?.findIndex((historyEntry) => historyEntry.key.indexOf('MainStackScreen') > -1) || -1;
                if (mainScreenHistoryIndex > 0) {
                  if (
                    state?.history &&
                    (state.history[mainScreenHistoryIndex - 1].key as string).indexOf('OnboardingStackScreen') > -1
                  ) {
                    // we just navigated from OnBoarding to MainScreen
                    // now we clear everything in the history before the MainScreen
                    // (I feel like there must be an easier way of doing this, but I couldn't find it)
                    state?.history?.splice(0, mainScreenHistoryIndex);
                  }
                }
              }}>
              <StatusBar />
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
                    'AssessmentStackScreen',
                    'AssessmentSessionStackScreen'
                  ].includes(route.name)
                    ? () => {
                        return null;
                      }
                    : undefined
                })}>
                <Tab.Screen
                  name='OnboardingStackScreen'
                  component={OnboardingStackScreen}
                  options={{tabBarStyle: {display: 'none'}}}
                />
                <Tab.Screen
                  name='MainStackScreen'
                  component={MainStackScreen}
                  options={{
                    tabBarIcon: ({focused, color, size}) =>
                      generateTabIcon(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2{fill:#EBEBEB;stroke:#808080;stroke-linejoin:round;stroke-width:2px;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M52,30.33,33.69,13.6a1.8,1.8,0,0,0-2.38,0L13,30.33A1.52,1.52,0,0,0,14.18,33h4.39V50.09a1.85,1.85,0,0,0,1.92,1.76h24a1.85,1.85,0,0,0,1.92-1.76V33h4.39A1.52,1.52,0,0,0,52,30.33ZM27.59,51.85V40.11a1.61,1.61,0,0,1,1.68-1.53h6.46a1.61,1.61,0,0,1,1.68,1.53V51.85"/></g></g></svg>',
                        focused,
                        color
                      )
                  }}
                />
                <Tab.Screen
                  name='InformationStackScreen'
                  component={InformationStackScreen}
                  options={{
                    tabBarIcon: ({focused, color, size}) =>
                      generateTabIcon(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2{fill:#EBEBEB;stroke:#808080;stroke-linejoin:round;stroke-width:2px;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M39.12,35.06a6.63,6.63,0,1,0-13.25,0V49a6.63,6.63,0,1,0,13.25,0ZM32.5,22.79a6.74,6.74,0,1,0-6.63-6.74A6.68,6.68,0,0,0,32.5,22.79Z"/></g></g></svg>',
                        focused,
                        color
                      )
                  }}
                />
                <Tab.Screen
                  name='SettingsStackScreen'
                  component={SettingsStackScreen}
                  options={{
                    tabBarIcon: ({focused, color, size}) =>
                      generateTabIcon(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2{fill:#EBEBEB;stroke:#808080;stroke-linejoin:round;stroke-width:2px;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M53.15,33.8V31.2a2.28,2.28,0,0,0-2-2.27l-2.69-.3a2.31,2.31,0,0,1-1.88-1.47,8.51,8.51,0,0,0-.34-.83,2.27,2.27,0,0,1,.3-2.36l1.68-2.11A2.3,2.3,0,0,0,48,18.81L46.18,17a2.28,2.28,0,0,0-3-.17L41,18.49a2.27,2.27,0,0,1-2.36.3,8.51,8.51,0,0,0-.83-.34,2.31,2.31,0,0,1-1.47-1.88l-.3-2.69a2.28,2.28,0,0,0-2.27-2H31.2a2.28,2.28,0,0,0-2.27,2l-.3,2.69a2.31,2.31,0,0,1-1.47,1.88c-.28.1-.56.22-.83.34a2.27,2.27,0,0,1-2.36-.3l-2.11-1.68a2.3,2.3,0,0,0-3.05.17L17,18.81a2.3,2.3,0,0,0-.17,3.05L18.49,24a2.27,2.27,0,0,1,.3,2.36,8.51,8.51,0,0,0-.34.83,2.31,2.31,0,0,1-1.88,1.47l-2.69.3a2.28,2.28,0,0,0-2,2.27v2.6a2.28,2.28,0,0,0,2,2.27l2.69.3a2.31,2.31,0,0,1,1.88,1.47c.1.28.22.56.34.83a2.27,2.27,0,0,1-.3,2.36l-1.68,2.11a2.28,2.28,0,0,0,.17,3L18.81,48a2.3,2.3,0,0,0,3.05.17L24,46.5a2.29,2.29,0,0,1,2.36-.29c.27.12.55.24.83.34a2.31,2.31,0,0,1,1.47,1.88l.3,2.69a2.28,2.28,0,0,0,2.27,2h2.6a2.28,2.28,0,0,0,2.27-2l.3-2.69a2.31,2.31,0,0,1,1.47-1.88c.28-.1.56-.22.83-.34a2.27,2.27,0,0,1,2.36.3l2.11,1.68a2.28,2.28,0,0,0,3-.17L48,46.18a2.28,2.28,0,0,0,.17-3L46.51,41a2.27,2.27,0,0,1-.3-2.36c.12-.27.24-.55.34-.83a2.31,2.31,0,0,1,1.88-1.47l2.69-.3A2.28,2.28,0,0,0,53.15,33.8ZM32.5,42.12a9.62,9.62,0,1,0-9.62-9.62A9.62,9.62,0,0,0,32.5,42.12Z"/></g></g></svg>',
                        focused,
                        color
                      )
                  }}
                />
                <Tab.Screen
                  name='SecurityplanStackScreen'
                  component={SecurityplanStackScreen}
                />
                <Tab.Screen
                  name='AssessmentStackScreen'
                  component={AssessmentStackScreen}></Tab.Screen>
                <Tab.Screen
                  name='AssessmentSessionStackScreen'
                  component={AssessmentSessionStackScreen}
                  options={{
                    tabBarStyle: {display: 'none'}
                  }}></Tab.Screen>
              </Tab.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}
