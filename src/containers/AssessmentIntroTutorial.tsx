import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale, windowWidth} from '../styles/App.style';
import {ASSESSMENT_RESOURCES} from '../resources/static/assessmentIntroResources';
import {ScrollView} from 'react-native-gesture-handler';
import PrismSession from '../model/PrismSession';
import {SvgCss} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE} from './App';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  userProfile: UserProfile;
  prismSession: PrismSession;
}

interface State {}

class AssessmentIntroTutorial extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
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
            <View style={styles.pageTitleView}>
              <Text style={styles.pageTitleText}>{this.props.localesHelper.localeString('assessment.title')}</Text>
            </View>
          </View>
          {
            <View style={styles.bottomView}>
              <ScrollView>
                <View style={{height: verticalScale(55)}}></View>
                <View style={styles.content}>
                  <Text style={styles.title}>{ASSESSMENT_RESOURCES.tutorial.title}</Text>
                  <Text style={styles.description}>{ASSESSMENT_RESOURCES.tutorial.description}</Text>
                  <Text style={styles.description}>{ASSESSMENT_RESOURCES.tutorial.questions}</Text>
                  <View style={styles.listContainer}>
                    {ASSESSMENT_RESOURCES.tutorial.questionList.map((item, index) => {
                      return this._renderListItem(item, index);
                    })}
                  </View>
                  <SvgCss
                    xml={ASSESSMENT_RESOURCES.tutorial.prismImage}
                    style={[
                      styles.image,
                      {
                        shadowColor: colors.black,
                        shadowOffset: {
                          width: scale(5),
                          height: scale(5)
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: scale(5)
                      }
                    ]}
                  />
                  <Text style={styles.distance}>{ASSESSMENT_RESOURCES.tutorial.distance}</Text>
                </View>
                <AppButton
                  label={this.props.localesHelper.localeString('common.start')}
                  icon={
                    '<?xml version="1.0" encoding="UTF-8"?> <svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 50.12 50.12"> <defs> <style>.cls-1,.cls-2,.cls-3{fill:none;}.cls-4{clip-path:url(#clippath);}.cls-2{stroke-linecap:round;stroke-linejoin:round;}.cls-2,.cls-3{stroke:#fff;stroke-width:2.5px;}.cls-5{clip-path:url(#clippath-1);}</style> <clipPath id="clippath"> <rect class="cls-1" x=".06" y=".06" width="50" height="50" /> </clipPath> <clipPath id="clippath-1"> <rect class="cls-1" x=".06" y=".06" width="50" height="50" /> </clipPath> </defs> <g class="cls-4"> <circle class="cls-3" cx="25.06" cy="25.06" r="23.81" /> </g> <polyline class="cls-2" points="23.63 39.35 37.92 25.06 23.63 10.77" /> <g class="cls-5"> <line class="cls-2" x1="36.01" y1="25.06" x2="2.68" y2="25.06" /> </g> </svg>'
                  }
                  position='right'
                  color={colors.gold}
                  onPress={() => {
                    AsyncStorage.setItem(STORAGE.SHOULD_DISPLAY_ASSESSMENT_INTRO, 'false').then(() => {
                      this.props.navigation.reset({
                        index: 0,
                        routes: [{name: 'AssessmentSessionStackScreen'}]
                      });
                    });
                  }}
                  isLargeButton
                />
                <View style={{height: verticalScale(55)}}></View>
              </ScrollView>
            </View>
          }
          <View style={styles.emergencyButton}>
            <EmergencyNumberButton />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  _renderListItem(item: string, key: number) {
    return (
      <View
        style={styles.row}
        key={key}>
        <View style={styles.bulletView}>
          <Text style={styles.bulletPoint}>{'\u2022' + ' '}</Text>
        </View>
        <View style={styles.bulletTextView}>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  pageTitleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(40)
  },
  pageTitleText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  bottomView: {
    flex: 7,
    backgroundColor: colors.white65opac
  },
  content: {
    paddingLeft: scale(40),
    paddingRight: scale(20)
  },
  title: {
    paddingBottom: scale(10),
    color: colors.primary2_60opac,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  description: {
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    paddingBottom: scale(10)
  },
  distance: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.small),
    paddingTop: scale(20),
    paddingBottom: scale(40)
  },
  image: {
    width: scale(297 * 0.75),
    height: scale(210 * 0.75),
    marginVertical: scale(15)
  },
  explanation: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.small)
  },
  listContainer: {
    paddingVertical: scale(10),
    paddingBottom: scale(10)
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    paddingBottom: scale(10)
  },
  bulletView: {
    width: scale(10)
  },
  bulletPoint: {
    color: colors.gold,
    fontSize: scale(TextSize.small)
  },
  bulletTextView: {
    flex: 1
  },
  bulletText: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.small)
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

export default connect(mapStateToProps, undefined)(AssessmentIntroTutorial);
