import React, {Component} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import {STORAGE} from './App';
import {StackNavigationProp} from '@react-navigation/stack';
import AppIntroSlider from 'react-native-app-intro-slider';
import {ON_BOARDING_ITEMS} from '../resources/static/onBoardingItems';
import {AppFonts, scale, TextSize, verticalScale} from '../styles/App.style';
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
import Weiter from '../resources/images/common/weiter.svg';
import EmergencyContact from '../model/EmergencyContact';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  updateUserProfile: (userProfile: Partial<UserProfile>) => void;
  setEmergencyContacts: (e: EmergencyContact[]) => void;
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
          this.props.midataService.getUserData().then(profile => {
            this.props.updateUserProfile(profile);
            this.props.midataService.fetchEmergencyContactsForUser(profile.getFhirId())
            .then((contacts) => {
                console.log('fetched emergency contacts', contacts)
                this.props.setEmergencyContacts(contacts);
            })
            .catch((e) => {
                console.log('could not load related persons', e)
            });
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
    return (
      <SafeAreaView style={{flex: 1}} edges={['top']}>
        <ImageBackground
          source={item.background}
          style={styles.backgroundImage}>
          <View style={styles.topView}></View>
          <View style={styles.bottomView}>
            <View style={styles.content}>
              <View style={styles.titleView}>
                <Text style={[styles.title, {color: item.titleColor}]}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
          <View
            style={[styles.slideMarking, {backgroundColor: item.themeColor}]}>
            <Image
              source={item.image}
              resizeMode="contain"
              style={{width: '100%', height: '100%'}}></Image>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  };

  _renderPagination = (activeIndex: number) => {
    let button;
    if (activeIndex < 4) {
      button = (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.slider?.goToSlide(activeIndex + 1, true)}>
            <Text style={styles.buttonText}>
              {this.props.localesHelper.localeString('common.next')}
            </Text>
            <Weiter width={scale(50)} height={scale(50)} />
          </TouchableOpacity>
        </View>
      );
    } else if (activeIndex === 4) {
      button = (
        <View>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => this.registerOrLogin()}>
            <Text style={styles.buttonText}>
              {this.props.localesHelper.localeString('common.midata')}
            </Text>
            <Weiter width={scale(50)} height={scale(50)} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {ON_BOARDING_ITEMS.length > 1 &&
            ON_BOARDING_ITEMS.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex
                    ? {backgroundColor: 'rgba(0, 0, 0, .2)'}
                    : {backgroundColor: 'white'},
                ]}
                onPress={() => this.slider?.goToSlide(i, true)}
              />
            ))}
        </View>
        {button}
      </SafeAreaView>
    );
  };

  render() {
    return (
      <>
        <AppIntroSlider
          ref={(ref: AppIntroSlider) => (this.slider = ref)}
          renderItem={this._renderItem}
          data={ON_BOARDING_ITEMS}
          renderPagination={this._renderPagination}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  topView: {
    flex: 0.26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 0.74,
    backgroundColor: 'rgb(255,255,255)',
    opacity: 0.75,
  },
  content: {
    position: 'absolute',
    top: verticalScale(40),
    paddingLeft: scale(50),
    paddingRight: scale(30),
    width: '100%',
    height: verticalScale(300),
  },
  titleView: {
    paddingRight: scale(40),
    marginBottom: verticalScale(15),
  },
  title: {
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.veryBig),
  },
  text: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.small),
  },
  button: {
    position: 'absolute',
    top: verticalScale(368),
    left: -scale(10),
    width: scale(300),
    paddingVertical: 10,
    paddingHorizontal: scale(10),
    paddingLeft: scale(30),
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'rgb(136,131,117)',
    flexDirection: 'row',
  },
  slideMarking: {
    position: 'absolute',
    width: scale(175),
    height: verticalScale(150),
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 100,
    right: scale(0),
    top: verticalScale(50),
    paddingVertical: verticalScale(30),
    paddingRight: scale(50),
    paddingLeft: scale(20),
  },
  buttonText: {
    flex: 3,
    fontSize: scale(TextSize.big),
    fontFamily: AppFonts.medium,
    color: 'white',
    alignSelf: 'center',
    paddingLeft: scale(30),
  },
  paginationContainer: {
    position: 'absolute',
    top: verticalScale(122.5),
    left: scale(10),
  },
  paginationDots: {
    height: verticalScale(16),
    margin: scale(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: scale(15),
    height: scale(15),
    borderRadius: 10,
    marginHorizontal: scale(7),
  },
});

// Link store data to component:
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
    setEmergencyContacts: (contacts: EmergencyContact[]) => userProfileActions.setEmergencyContacts(dispatch, contacts)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);
