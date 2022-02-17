import React, {Component} from 'react';
import {Text, Image, StyleSheet, Pressable} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import {STORAGE} from './App';
import {StackNavigationProp} from '@react-navigation/stack';
import AppIntroSlider from 'react-native-app-intro-slider';
import {ON_BOARDING_ITEMS} from '../resources/static/onBoardingItems';
import {
  colors,
  AppFonts,
  windowHeight,
  windowWidth,
  scale,
} from '../styles/App.style';
import {TaskIntent} from '@i4mi/fhir_r4';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import UserProfile from '../model/UserProfile';
import {OAUTH_CONFIG} from '../model/UserSession';
import {authorize} from 'react-native-app-auth';
import Config from 'react-native-config';
import {AppStore} from '../store/reducers';
import * as miDataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import {connect} from 'react-redux';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  updateUserProfile: (userProfile: Partial<UserProfile>) => void;
  authenticateUser: (
    accessToken: string,
    accessTokenExpirationDate: string,
    refreshToken: string,
    server: string,
  ) => void;
}

interface State {
  currentSlide: number;
}

class OnBoarding extends Component<PropsType, State> {
  slider: any;

  constructor(props: PropsType) {
    super(props);

    this.state = {
      currentSlide: 0,
    };
  }

  authenthicate(): Promise<void> {
    return new Promise((resolve, reject) => {
      OAUTH_CONFIG.additionalParameters = {
        ...{
          language: this.props.localesHelper.getCurrentLanguage(),
        },
      };
      authorize(OAUTH_CONFIG)
        .then(authResult => {
          this.props.authenticateUser(
            authResult.accessToken,
            authResult.accessTokenExpirationDate,
            authResult.refreshToken,
            Config.host,
          );
          this.props.midataService.getUserData().then(profileResource => {
            this.props.updateUserProfile(profileResource);
          });
          return resolve();
        })
        .catch(error => {
          console.log('auth failed or cancelled', error);
        });
    });
  }
  registerOrLogin() {
    this.authenthicate().then(this.onDone.bind(this));
  }

  onDone() {
    try {
      AsyncStorage.setItem(STORAGE.SHOULD_DISPLAY_INTRO, 'false');
    } catch (e) {
      // saving error
    }
    this.props.navigation.navigate('MainScreen');
  }

  _renderItem = ({item}) => {
    let renderedItem;
    if (item.isMidataScreen) {
      renderedItem = (
        <SafeAreaView style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <Image
            source={item.image}
            style={{
              width: windowWidth * 0.7,
              height: windowHeight * 0.1,
              resizeMode: 'contain',
              marginTop: windowHeight * 0.05,
              marginBottom: windowHeight * 0.05,
            }}
          />
          <Text style={styles.text}>{item.text}</Text>
        </SafeAreaView>
      );
    } else {
      renderedItem = (
        <SafeAreaView style={styles.slide}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.text}>{item.text}</Text>
        </SafeAreaView>
      );
    }
    return renderedItem;
  };

  _renderNextButton = () => {
    return (
      <View style={styles.button}>
        <Text style={styles.buttonText}>Weiter</Text>
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.button}>
        <Text style={styles.buttonText}>Weiter zu MIDATA</Text>
      </View>
    );
  };

  render() {
    return (
      <>
        <AppIntroSlider
          ref={(ref: AppIntroSlider) => (this.slider = ref)}
          renderItem={this._renderItem}
          data={ON_BOARDING_ITEMS}
          renderDoneButton={this._renderDoneButton}
          onDone={this.registerOrLogin.bind(this)}
          renderNextButton={this._renderNextButton}
          bottomButton={true}
          dotStyle={{
            backgroundColor: '#C4C4C4',
            width: 15,
            height: 15,
            borderRadius: 100,
            marginHorizontal: 6,
          }}
          activeDotStyle={{
            backgroundColor: '#005561',
            width: 15,
            height: 15,
            borderRadius: 100,
            marginHorizontal: 6,
          }}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#EFEEED',
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'normal',
    paddingHorizontal: windowWidth * 0.1,
    marginTop: windowHeight * 0.1,
  },
  image: {
    width: windowWidth * 0.7,
    height: windowWidth * 0.7,
    resizeMode: 'contain',
    marginBottom: windowHeight * 0.05,
    marginTop: windowHeight * 0.05,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: '#005561',
    width: windowWidth * 0.5,
    marginHorizontal: windowWidth * 0.2,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '400',
    letterSpacing: 0.25,
    color: 'white',
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 50,
  },
});

// Link store data to component :
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    updateUserProfile: (userProfile: Partial<UserProfile>) =>
      userProfileActions.updateUserProfile(dispatch, userProfile),
    authenticateUser: (
      accessToken: string,
      accessTokenExpirationDate: string,
      refreshToken: string,
      server: string,
    ) =>
      miDataServiceActions.authenticateUser(
        dispatch,
        accessToken,
        accessTokenExpirationDate,
        refreshToken,
        server,
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);
