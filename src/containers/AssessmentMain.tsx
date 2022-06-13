import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import Banner, {BANNER_TYPE} from '../components/Banner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE} from './App';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  userProfile: UserProfile;
}

interface State {
  shouldShowAssessmentIntro: boolean;
}

class AssessmentMain extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      shouldShowAssessmentIntro: true
    };

    AsyncStorage.getItem(STORAGE.SHOULD_DISPLAY_ASSESSMENT_INTRO).then((viewed) => {
      this.setState({
        shouldShowAssessmentIntro: viewed === 'true'
      });
    });
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_yellow.png')}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('assessment.title')}</Text>
            </View>
          </View>

          <View style={styles.bottomView}>
            <View style={{height: verticalScale(55)}}></View>
            <Banner
              type={BANNER_TYPE.assessment}
              titleColor={colors.gold}
            />
            <View
              style={{
                position: 'relative'
              }}>
              <AppButton
                label={this.props.localesHelper.localeString('assessment.addEntry')}
                icon={
                  '<?xml version="1.0" encoding="UTF-8"?> <svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50.12 50.12"> <defs> <style>.cls-1,.cls-2{fill:none;}.cls-3{clip-path:url(#clippath);}.cls-2{stroke:#fff;stroke-width:2.5px;}</style> <clipPath id="clippath"> <rect class="cls-1" x=".06" y=".06" width="50" height="50" /> </clipPath> </defs> <g class="cls-3"> <circle class="cls-2" cx="25.06" cy="25.06" r="23.81" /> </g> <line class="cls-2" x1="25.06" y1="13.15" x2="25.06" y2="36.96" /> <line class="cls-2" x1="13.15" y1="25.06" x2="36.96" y2="25.06" /> </svg>'
                }
                position='right'
                color={colors.gold}
                onPress={() => {
                  this.state.shouldShowAssessmentIntro
                    ? this.props.navigation.navigate('AssessmentIntroStackScreen')
                    : this.props.navigation.reset({
                        index: 0,
                        routes: [{name: 'AssessmentSessionStackScreen'}]
                      });
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
                  this.props.navigation.navigate('AssessmentArchive', {screen: 'AssessmentStackScreen'});
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
    marginLeft: scale(40)
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
    backgroundColor: colors.gold50opac,
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

export default connect(mapStateToProps, undefined)(AssessmentMain);
