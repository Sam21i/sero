import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {ImageBackground, Platform,StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import Banner, {BANNER_TYPE} from '../components/Banner';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
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
          source={images.imagesPNG.backgrounds.moodYellow}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('assessment.title')}</Text>
            </View>
          </View>

          <View style={styles.bottomView}>
            <Banner
              type={BANNER_TYPE.assessment}
              titleColor={colors.gold}
            />
            <View
              style={{
                position: 'relative',
                paddingBottom: verticalScale(55)
              }}>
              <AppButton
                label={this.props.localesHelper.localeString('assessment.addEntry')}
                icon={images.imagesSVG.common.add}
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
              <View
                style={{
                  paddingTop: verticalScale(15),
                  opacity: this.props.userProfile.getPrismSessions().length === 0 ? 0 : 1 // hide archive button if nothing in archive
                }}>
                <AppButton
                  label={this.props.localesHelper.localeString('common.archive')}
                  icon={images.imagesSVG.common.archive}
                  position='right'
                  color={colors.grey}
                  onPress={() => {
                    this.props.navigation.navigate('AssessmentArchive', {screen: 'AssessmentStackScreen'});
                  }}
                  isLargeButton
                  isDisabled={this.props.userProfile.getPrismSessions().length === 0}
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
    paddingTop: verticalScale(60),
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
