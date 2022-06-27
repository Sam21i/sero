import React, {Component} from 'react';
import {Text, Image, StyleSheet, ImageBackground, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View} from 'react-native';
import {STORAGE} from './App';
import {StackNavigationProp} from '@react-navigation/stack';
import AppIntroSlider from 'react-native-app-intro-slider';
import {ON_BOARDING_ITEMS} from '../resources/static/onBoardingItems';
import {activeOpacity, AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
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
import AppButton from '../components/AppButton';
import images from '../resources/images/images';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  updateUserProfile: (userProfile: Partial<UserProfile>) => void;
  authenticateUser: (
    accessToken: string,
    accessTokenExpirationDate: string,
    refreshToken: string,
    server: string
  ) => void;
}

interface State {
  currentSlide: number;
  isLoggingIn: boolean;
}

class Onboarding extends Component<PropsType, State> {
  slider: any;

  constructor(props: PropsType) {
    super(props);

    this.state = {
      currentSlide: 0,
      isLoggingIn: false
    };
  }

  authenthicate(): Promise<void> {
    this.setState({isLoggingIn: true});
    return new Promise((resolve, reject) => {
      OAUTH_CONFIG.additionalParameters = {
        ...{
          language: this.props.localesHelper.getCurrentLanguage()
        }
      };
      authorize(OAUTH_CONFIG)
        .then((authResult) => {
          this.props.authenticateUser(
            authResult.accessToken,
            authResult.accessTokenExpirationDate,
            authResult.refreshToken,
            Config.host
          );
          this.props.midataService.getUserData().then((profile) => {
            this.props.updateUserProfile(profile);
            this.setState({isLoggingIn: false});
            return resolve();
          });
        })
        .catch((error) => {
          console.log('auth failed or cancelled', error);
          this.setState({isLoggingIn: false});
        });
    });
  }
  registerOrLogin() {
    // don't process clicks if we already are logging in
    if (!this.state.isLoggingIn) {
      this.authenthicate().then(this.onDone.bind(this));
    }
  }

  onDone() {
    try {
      AsyncStorage.setItem(STORAGE.SHOULD_DISPLAY_ONBOARDING, 'false');
      AsyncStorage.setItem(STORAGE.SHOULD_DISPLAY_ASSESSMENT_INTRO, 'true');
    } catch (e) {
      // saving error
    }
    this.props.navigation.navigate('MainStackScreen');
  }

  _renderItem = ({item}) => {
    return (
      <SafeAreaView
        style={{flex: 1}}
        edges={['top']}>
        <ImageBackground
          source={item.background}
          style={styles.backgroundImage}>
          <View style={styles.topView}></View>
          <View style={styles.bottomView}>
            <View style={styles.content}>
              <View style={styles.titleView}>
                <Text style={[styles.title, {color: item.titleColor}]}>
                  {this.props.localesHelper.localeString(item.title)}
                </Text>
              </View>
              <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}>
                <Text style={styles.text}>{this.props.localesHelper.localeString(item.text)}</Text>
              </ScrollView>
            </View>
          </View>
          <View style={[styles.slideMarking, {backgroundColor: item.themeColor}]}>
            <Image
              source={item.image}
              resizeMode='contain'
              style={{width: '100%', height: '100%'}}
            />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  };

  _renderPagination = (activeIndex: number) => {
    return (
      <SafeAreaView style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {ON_BOARDING_ITEMS.length > 1 &&
            ON_BOARDING_ITEMS.map((_, i) => (
              <TouchableOpacity
                activeOpacity={activeOpacity}
                key={i}
                style={[styles.dot, i === activeIndex ? {backgroundColor: colors.grey} : {backgroundColor: 'white'}]}
                onPress={() => this.slider?.goToSlide(i, true)}
              />
            ))}
        </View>
        <AppButton
          label={this.props.localesHelper.localeString('common.next')}
          icon={images.imagesSVG.common.continue}
          position='left'
          color={colors.grey}
          style={{
            position: 'absolute',
            top: verticalScale(412),
            left: scale(-10)
          }}
          onPress={() => (activeIndex < 4 ? this.slider?.goToSlide(activeIndex + 1, true) : this.registerOrLogin())}
          isLargeButton
        />
      </SafeAreaView>
    );
  };

  render() {
    return (
      <AppIntroSlider
        ref={(ref: AppIntroSlider) => (this.slider = ref)}
        renderItem={this._renderItem}
        data={ON_BOARDING_ITEMS}
        renderPagination={this._renderPagination}
      />
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1
  },
  topView: {
    flex: 0.26
  },
  bottomView: {
    flex: 0.74,
    backgroundColor: colors.white65opac
  },
  content: {
    position: 'absolute',
    top: verticalScale(50),
    paddingLeft: scale(40),
    paddingRight: scale(30)
  },
  titleView: {
    paddingRight: scale(40),
    marginBottom: verticalScale(15)
  },
  title: {
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.veryBig)
  },
  text: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.small)
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
    paddingLeft: scale(20)
  },
  paginationContainer: {
    position: 'absolute',
    top: verticalScale(122.5),
    left: scale(10)
  },
  paginationDots: {
    height: verticalScale(16),
    margin: scale(10),
    flexDirection: 'row'
  },
  dot: {
    width: scale(15),
    height: scale(15),
    borderRadius: 10,
    marginHorizontal: scale(8)
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    updateUserProfile: (userProfile: Partial<UserProfile>) =>
      userProfileActions.updateUserProfile(dispatch, userProfile),
    authenticateUser: (accessToken: string, accessTokenExpirationDate: string, refreshToken: string, server: string) =>
      miDataServiceActions.authenticateUser(dispatch, accessToken, accessTokenExpirationDate, refreshToken, server)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
