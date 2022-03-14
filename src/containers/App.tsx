import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import Main from './Main';
import Info from './Info';
import Settings from './Settings';
import OnBoarding from './OnBoarding';

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
import Securityplan from './Securityplan';
import Contacts from './Contacts';
import Assessment from './Assessment';
import Orientation from 'react-native-orientation-locker';

interface PropsType {}

interface State {
  showRealApp: boolean;
}

export enum STORAGE {
  SHOULD_DISPLAY_INTRO = '@displayIntro',
}

const OnBoardingStack = createStackNavigator();

function OnBoardingStackScreen({route}: {route: any}) {
  return (
    <OnBoardingStack.Navigator>
      <OnBoardingStack.Screen
        name="mainWelcome"
        component={Welcome}
        options={{headerShown: false}}
      />
      <OnBoardingStack.Screen
        name="mainOnBoarding"
        component={OnBoarding}
        options={{headerShown: false}}
      />
    </OnBoardingStack.Navigator>
  );
}

const MainStack = createStackNavigator();

function MainStackScreen({route}: {route: any}) {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen
        name="Home"
        component={Main}
        options={{
          gestureDirection: 'vertical'
        }}></MainStack.Screen>
      <MainStack.Screen
        name="Contacts"
        component={Contacts}
        options={{
          animationEnabled: false
        }}></MainStack.Screen>
        <MainStack.Screen
          name="Assessment"
          component={Assessment}
          options={{
            animationEnabled: false
          }}></MainStack.Screen>
    </MainStack.Navigator>
  );
}

const InfoStack = createStackNavigator();

function InfoStackScreen({route}: {route: any}) {
  return (
    <InfoStack.Navigator>
      <InfoStack.Screen
        name="Information"
        component={Info}
        options={{}}></InfoStack.Screen>
    </InfoStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();

function SettingsStackScreen({route}: {route: any}) {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        options={{}}></SettingsStack.Screen>
    </SettingsStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function generateTabIcon(icon: string, focused: boolean, color: string) {
  if (focused) return <SvgCss xml={icon.replace('#888376', color)} />;

  return <SvgCss xml={icon} />;
}

//
export default class App extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      showRealApp: false,
    };
    this.checkContentToDisplay();
  }

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  async checkContentToDisplay() {
    await AsyncStorage.getItem(STORAGE.SHOULD_DISPLAY_INTRO).then(value => {
      if (value !== null) {
        this.setState({
          showRealApp: true,
        });
      }
      RNBootSplash.hide();
    });
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" />
              <Tab.Navigator
                screenOptions={({route}) => ({
                  tabBarShowLabel: false,
                  headerShown: false,
                  tabBarStyle: {backgroundColor: '#EBEAE8'},
                  tabBarActiveTintColor: '#C95F1E',
                  tabBarInactiveTintColor: '#808080',
                  tabBarButton: ['OnBoarding', 'Securityplan'].includes(
                    route.name,
                  )
                    ? () => {
                        return null;
                      }
                    : undefined,
                })}>
                {!this.state.showRealApp ? (
                  <Tab.Screen
                    name="OnBoarding"
                    component={OnBoardingStackScreen}
                    options={{tabBarStyle: {display: 'none'}}}
                  />
                ) : (
                  <></>
                )}
                <Tab.Screen
                  name="MainScreen"
                  component={MainStackScreen}
                  options={{
                    tabBarIcon: ({focused, color, size}) =>
                      generateTabIcon(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2{fill:#EBEAE8;stroke:#888376;stroke-linejoin:round;stroke-width:2px;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M52,30.33,33.69,13.6a1.8,1.8,0,0,0-2.38,0L13,30.33A1.52,1.52,0,0,0,14.18,33h4.39V50.09a1.85,1.85,0,0,0,1.92,1.76h24a1.85,1.85,0,0,0,1.92-1.76V33h4.39A1.52,1.52,0,0,0,52,30.33ZM27.59,51.85V40.11a1.61,1.61,0,0,1,1.68-1.53h6.46a1.61,1.61,0,0,1,1.68,1.53V51.85"/></g></g></svg>',
                        focused,
                        color,
                      ),
                  }}
                />
                <Tab.Screen
                  name="InfoScreen"
                  component={InfoStackScreen}
                  options={{
                    tabBarIcon: ({focused, color, size}) =>
                      generateTabIcon(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2{fill:#EBEAE8;stroke:#888376;stroke-linejoin:round;stroke-width:2px;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M39.12,35.06a6.63,6.63,0,1,0-13.25,0V49a6.63,6.63,0,1,0,13.25,0ZM32.5,22.79a6.74,6.74,0,1,0-6.63-6.74A6.68,6.68,0,0,0,32.5,22.79Z"/></g></g></svg>',
                        focused,
                        color,
                      ),
                  }}
                />
                <Tab.Screen
                  name="SettingsScreen"
                  component={SettingsStackScreen}
                  options={{
                    tabBarIcon: ({focused, color, size}) =>
                      generateTabIcon(
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2{fill:#EBEAE8;stroke:#888376;stroke-linejoin:round;stroke-width:2px;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M53.15,33.8V31.2a2.28,2.28,0,0,0-2-2.27l-2.69-.3a2.31,2.31,0,0,1-1.88-1.47,8.51,8.51,0,0,0-.34-.83,2.27,2.27,0,0,1,.3-2.36l1.68-2.11A2.3,2.3,0,0,0,48,18.81L46.18,17a2.28,2.28,0,0,0-3-.17L41,18.49a2.27,2.27,0,0,1-2.36.3,8.51,8.51,0,0,0-.83-.34,2.31,2.31,0,0,1-1.47-1.88l-.3-2.69a2.28,2.28,0,0,0-2.27-2H31.2a2.28,2.28,0,0,0-2.27,2l-.3,2.69a2.31,2.31,0,0,1-1.47,1.88c-.28.1-.56.22-.83.34a2.27,2.27,0,0,1-2.36-.3l-2.11-1.68a2.3,2.3,0,0,0-3.05.17L17,18.81a2.3,2.3,0,0,0-.17,3.05L18.49,24a2.27,2.27,0,0,1,.3,2.36,8.51,8.51,0,0,0-.34.83,2.31,2.31,0,0,1-1.88,1.47l-2.69.3a2.28,2.28,0,0,0-2,2.27v2.6a2.28,2.28,0,0,0,2,2.27l2.69.3a2.31,2.31,0,0,1,1.88,1.47c.1.28.22.56.34.83a2.27,2.27,0,0,1-.3,2.36l-1.68,2.11a2.28,2.28,0,0,0,.17,3L18.81,48a2.3,2.3,0,0,0,3.05.17L24,46.5a2.29,2.29,0,0,1,2.36-.29c.27.12.55.24.83.34a2.31,2.31,0,0,1,1.47,1.88l.3,2.69a2.28,2.28,0,0,0,2.27,2h2.6a2.28,2.28,0,0,0,2.27-2l.3-2.69a2.31,2.31,0,0,1,1.47-1.88c.28-.1.56-.22.83-.34a2.27,2.27,0,0,1,2.36.3l2.11,1.68a2.28,2.28,0,0,0,3-.17L48,46.18a2.28,2.28,0,0,0,.17-3L46.51,41a2.27,2.27,0,0,1-.3-2.36c.12-.27.24-.55.34-.83a2.31,2.31,0,0,1,1.88-1.47l2.69-.3A2.28,2.28,0,0,0,53.15,33.8ZM32.5,42.12a9.62,9.62,0,1,0-9.62-9.62A9.62,9.62,0,0,0,32.5,42.12Z"/></g></g></svg>',
                        focused,
                        color,
                      ),
                  }}
                />
                <Tab.Screen name="Securityplan" component={Securityplan} />
              </Tab.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    );
  }
}
