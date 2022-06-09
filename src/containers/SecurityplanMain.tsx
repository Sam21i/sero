import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import {SecurityPlanModule} from '../model/SecurityPlan';
import MainNotification, {NOTIFICATION_TYPE} from '../components/MainNotification';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  userProfile: UserProfile;
  addResource: (r: Resource) => void;
  synchronizeResource: (r: Resource) => void;
}

interface State {
  bubbleVisible: boolean;
  listVisible: boolean;
  modules: SecurityPlanModule[];
}

const NOTIFICATION_OPTIONS = ['motivation', 'copingStrategies', 'distractionStrategies', 'personalBeliefs'];

class SecurityplanMain extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: true,
      listVisible: false,
      modules: this.props.userProfile.getCurrentSecurityPlan().getSecurityPlanModules()
    };
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
        this.props.localesHelper.localeString(
          'securityplan.notification.' +
            NOTIFICATION_OPTIONS[NOTIFICATION_OPTIONS.findIndex((item) => item === selectedModule.type)]
        ) + selectedEntry
      );
    } else {
      return this.props.localesHelper.localeString('securityplan.defaultHint');
    }
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('securityplan.title')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <View style={{height: verticalScale(55)}}></View>
            <MainNotification type={NOTIFICATION_TYPE.securityplan} />
            <View
              style={{
                position: 'relative'
              }}>
              <AppButton
                label={this.props.localesHelper.localeString('securityplan.current')}
                icon={
                  '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 118.67 147.33"><defs><style>.cls-1,.cls-3,.cls-4,.cls-5{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3,.cls-4,.cls-5{stroke:#fff;stroke-width:4px;}.cls-3,.cls-4{stroke-linejoin:round;}.cls-4{stroke-linecap:round;}</style><clipPath id="clip-path" transform="translate(-22.48 -1.72)"><circle class="cls-1" cx="74.65" cy="75.38" r="107.5"/></clipPath></defs><g class="cls-2"><path class="cls-3" d="M135.08,80.18,122.25,69.62a2.94,2.94,0,0,0-4-.21,464.18,464.18,0,0,0-32.89,46.26c-11.7,18.84-9.8,24.15-9.8,24.15-.91,1.8-2.44,5.46-.76,6.82s4.67-1,6.17-2.33c0,0,5.52.57,20.65-16.12A429.77,429.77,0,0,0,136.32,84,3.19,3.19,0,0,0,135.08,80.18Z" transform="translate(-22.48 -1.72)"/><path class="cls-4" d="M110.59,66.39a210.15,210.15,0,0,0-21.2,28.18" transform="translate(-22.48 -1.72)"/><path class="cls-5" d="M134.13,79.46,139,73A2.35,2.35,0,0,0,138,70l-7.31-5.89c-1.06-.86-2.38-1-3-.18L123,70.41m-37.57,45.4,16,12.53" transform="translate(-22.48 -1.72)"/><path class="cls-3" d="M109.53,24.26h6V60.15M65.67,129.34H24.48V24.26h6.14m24,82.22H79.78m-32.89,5.17h-10V101.24h10Zm7.75-30.9h34m-41.77,5h-10V75.4h10Zm7.89-31h47.7M47.11,60H36.91V49.6h10Zm22.8-47.41a4.24,4.24,0,0,0-4.31,4.16v.11a4.21,4.21,0,1,0,8.41.25v0A4.27,4.27,0,0,0,70,12.56Zm32.57,8.51a5.36,5.36,0,0,0-5.26-5.46H83.66a2.32,2.32,0,0,1-2.27-1.83A11.84,11.84,0,0,0,68,3.83l-.31,0a12,12,0,0,0-9.54,9.9,2.31,2.31,0,0,1-2.26,1.83H42.58a5.36,5.36,0,0,0-5.23,5.46V35.82h65.13Z" transform="translate(-22.48 -1.72)"/></g></svg>'
                }
                position='right'
                color={colors.primary}
                onPress={() => {
                  this.props.navigation.navigate('SecurityplanCurrent');
                }}
                isLargeButton
              />
              <View style={{height: verticalScale(15)}}></View>
              <AppButton
                label={this.props.localesHelper.localeString('common.archive')}
                icon={
                  '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
                }
                position='right'
                color={colors.grey}
                onPress={() => {
                  this.props.navigation.navigate('SecurityplanArchive');
                }}
                isLargeButton
                isDisabled={this.props.userProfile.getSecurityPlanHistory().length === 0}
              />
            </View>
            <View style={{height: verticalScale(55)}}></View>
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(50)
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
    flex: 1
  },
  bottomView: {
    flex: 7,
    backgroundColor: colors.white65opac
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

export default connect(mapStateToProps, undefined)(SecurityplanMain);
