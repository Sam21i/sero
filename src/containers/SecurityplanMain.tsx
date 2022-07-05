import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import Banner, {BANNER_TYPE} from '../components/Banner';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {SecurityPlanModule} from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

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
          source={images.imagesPNG.backgrounds.moodLightOrange}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <BackButton
              onPress={() => {
                this.props.navigation.navigate('MainStackScreen', {screen: 'Main'});
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('securityplan.title')}</Text>
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
                label={this.props.localesHelper.localeString('securityplan.current')}
                icon={images.imagesSVG.common.securityplan}
                position='right'
                color={colors.primary}
                onPress={() => {
                  this.props.navigation.navigate('SecurityplanCurrent');
                }}
                isLargeButton
              />
              <View
                style={{
                  paddingTop: verticalScale(15),
                  opacity: this.props.userProfile.getSecurityPlanHistory().length === 0 ? 0 : 1 // hide archive button if nothing in archive
                }}>
                <AppButton
                  label={this.props.localesHelper.localeString('common.archive')}
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
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

export default connect(mapStateToProps, undefined)(SecurityplanMain);
