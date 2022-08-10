import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import Banner, {BANNER_TYPE} from '../components/Banner';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import {STORAGE} from './App';

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;

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
            <BackButton
              color={colors.white}
              onPress={() => {
                this.props.navigation.navigate('MainStackScreen', {screen: 'Main'});
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.t('assessment.title')}</Text>
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
                position: 'relative',
                paddingBottom: verticalScale(55)
              }}>
              <AppButton
                label={this.props.t('assessment.addEntry')}
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
                  label={this.props.t('assessment.archive')}
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
    alignItems: 'center'
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

export default connect(mapStateToProps, undefined)(withTranslation()(AssessmentMain));
