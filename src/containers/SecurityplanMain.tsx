import {Resource} from '@i4mi/fhir_r4';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import i18n from '../../i18n';
import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import Banner, {BANNER_TYPE} from '../components/Banner';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import MidataService from '../model/MidataService';
import {SecurityPlanModule} from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import {STORAGE} from './App';

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;

  midataService: MidataService;
  userProfile: UserProfile;
  addResource: (r: Resource) => void;
  synchronizeResource: (r: Resource) => void;
}

interface State {
  bubbleVisible: boolean;
  listVisible: boolean;
  modules: SecurityPlanModule[];
  shouldShowSecurityplanIntro: boolean;
}

const NOTIFICATION_OPTIONS = ['motivation', 'copingStrategies', 'distractionStrategies', 'personalBeliefs'];

class SecurityplanMain extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: true,
      listVisible: false,
      modules: this.props.userProfile.getCurrentSecurityPlan().getSecurityPlanModules(i18n.language),
      shouldShowSecurityplanIntro: true
    };

    AsyncStorage.getItem(STORAGE.SHOULD_DISPLAY_SECURITYPLAN_INTRO).then((viewed) => {
      this.setState({
        shouldShowSecurityplanIntro: viewed === 'true'
      });
    });
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  getRandomMessage(): string {
    const filteredModules = this.state.modules.filter(
      (m) => m.entries.length > 0 && m.type !== 'professionalContacts' && m.type !== 'warningSigns'
    );
    if (filteredModules.length !== 0) {
      const selectedModule = filteredModules[this.getRandomInt(filteredModules.length)];
      const selectedEntry = selectedModule.entries[this.getRandomInt(selectedModule.entries.length)];
      return (
        this.props.t(
          'securityplan.notification.' +
            NOTIFICATION_OPTIONS[NOTIFICATION_OPTIONS.findIndex((item) => item === selectedModule.type)]
        ) + selectedEntry
      );
    } else {
      return this.props.t('securityplan.defaultHint');
    }
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodLightOrange}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <BackButton
              color={colors.white}
              onPress={() => {
                this.props.navigation.navigate('MainStackScreen', {screen: 'Main'});
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.t('securityplan.title')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <View style={{height: verticalScale(55)}}></View>
            <Banner type={BANNER_TYPE.securityplan} />
            <View
              style={{
                position: 'relative',
                paddingBottom: verticalScale(55)
              }}>
              <AppButton
                label={this.props.t('securityplan.current')}
                icon={images.imagesSVG.common.securityplan}
                position='right'
                color={colors.primary}
                onPress={() => {
                  this.state.shouldShowSecurityplanIntro
                    ? this.props.navigation.navigate('SecurityplanIntroStackScreen')
                    : this.props.navigation.reset({
                        index: 0,
                        routes: [{name: 'SecurityplanSessionStackScreen'}]
                      });
                }}
                isLargeButton
              />
              <View
                style={{
                  paddingTop: verticalScale(15),
                  opacity: this.props.userProfile.getSecurityPlanHistory().length === 0 ? 0 : 1 // hide archive button if nothing in archive
                }}>
                <AppButton
                  label={this.props.t('securityplan.archive')}
                  icon={images.imagesSVG.common.archive}
                  position='right'
                  color={colors.grey}
                  onPress={() => {
                    this.props.navigation.navigate('SecurityplanArchive');
                  }}
                  isLargeButton
                  isDisabled={this.props.userProfile.getSecurityPlanHistory().length === 0}
                />
              </View>
            </View>
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
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
    top: verticalScale(45)
  },
  topView: {
    backgroundColor: colors.primary50opac,
    flex: 1,
    flexDirection: 'row'
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

export default connect(mapStateToProps, undefined)(withTranslation()(SecurityplanMain));
