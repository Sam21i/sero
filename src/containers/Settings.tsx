import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {CheckIcon, NativeBaseProvider, Select, Switch} from 'native-base';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {Button, ImageBackground, StyleSheet, Text, View} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import BackButton from '../components/BackButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import MidataService from '../model/MidataService';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import * as miDataServiceActions from '../store/midataService/actions';
import {AppStore} from '../store/reducers';
import {AppFonts, appStyles, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import {STORAGE} from './App';

interface State {
  currentLang: string;
  notificationFrequency: string;
}

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  logoutUser: () => Promise<void>;
  userProfile: UserProfile;
}

class Settings extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      currentLang: this.props.i18n.language,
      notificationFrequency: 'wöchentlich'
    };
  }

  logout(): void {
    this.props.logoutUser().then(() => {
      this.props.navigation.navigate('OnboardingStackScreen');
    });
  }

  setLanguageSelect(lang: string) {
    this.setState({currentLang: lang}, () => {
      AsyncStorage.setItem(STORAGE.LANGUAGE, lang);
      this.props.i18n.changeLanguage(lang);
    });
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
    });
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodGrey}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={appStyles.topViewMain}>
            <BackButton />
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.t('settings.title')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <NativeBaseProvider>
              <View style={{height: scale(55)}} />
              <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
                <View>
                  <Text
                    style={{
                      fontFamily: AppFonts.condensedBold,
                      paddingVertical: scale(2.5),
                      fontSize: scale(TextSize.normal),
                      color: colors.primary
                    }}>
                    Konto
                  </Text>
                </View>
                <Text>Du bist angemeldet als {this.props.userProfile.getFullName()}.</Text>

                <Button
                  title={this.props.t('settings.logout')}
                  onPress={this.logout.bind(this)}
                />
                <View>
                  <Text
                    style={{
                      fontFamily: AppFonts.condensedBold,
                      paddingVertical: scale(2.5),
                      fontSize: scale(TextSize.normal),
                      color: colors.primary
                    }}>
                    Sprache
                  </Text>
                </View>
                <Select
                  size={'md'}
                  backgroundColor={colors.white}
                  selectedValue={this.state.currentLang}
                  accessibilityLabel='Choose Service'
                  placeholder='Choose Service'
                  _selectedItem={{
                    bg: colors.lightGrey,
                    endIcon: (
                      <CheckIcon
                        size='5'
                        color={colors.primary}
                      />
                    )
                  }}
                  my={2}
                  onValueChange={(itemValue) => this.setLanguageSelect(itemValue)}>
                  <Select.Item
                    label='Deutsch'
                    value='de'
                  />
                  <Select.Item
                    label='Französisch'
                    value='fr'
                  />
                  <Select.Item
                    label='Italienisch'
                    value='it'
                  />
                </Select>
                <View>
                  <Text
                    style={{
                      fontFamily: AppFonts.condensedBold,
                      paddingVertical: scale(2.5),
                      fontSize: scale(TextSize.normal),
                      color: colors.primary
                    }}>
                    Notifikationen
                  </Text>
                  <Text>Push-Notifikationen</Text>
                  <Switch size='md' />
                  <Text>Häufigkeit der Push-Notifikationen</Text>
                  <Select
                    size={'md'}
                    backgroundColor={colors.white}
                    selectedValue={this.state.notificationFrequency}
                    accessibilityLabel='Häufigkeit'
                    placeholder='Häufigkeit'
                    _selectedItem={{
                      bg: colors.lightGrey,
                      endIcon: (
                        <CheckIcon
                          size='5'
                          color={colors.primary}
                        />
                      )
                    }}
                    my={1}
                    onValueChange={(itemValue) => {
                      console.log(itemValue);
                    }}>
                    <Select.Item
                      label='Täglich'
                      value='täglich'
                    />
                    <Select.Item
                      label='Wöchentlich'
                      value='wöchentlich'
                    />
                    <Select.Item
                      label='Monatlich'
                      value='monatlich'
                    />
                  </Select>
                  <Text>App-Notifikationen</Text>
                  <Switch size='md' />
                </View>
              </View>
            </NativeBaseProvider>
          </View>

          <View style={styles.emergencyButton}>
            <EmergencyNumberButton />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topViewText: {
    color: colors.primary,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  button: {
    marginVertical: scale(10)
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  emergencyButton: {
    position: 'absolute',
    right: -0.2,
    top: verticalScale(47)
  },
  bottomView: {
    flex: 7,
    backgroundColor: colors.white65opac
  }
});

function mapStateToProps(state: AppStore) {
  return {
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    logoutUser: () => miDataServiceActions.logoutUser(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Settings));
