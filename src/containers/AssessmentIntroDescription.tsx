import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale, windowWidth} from '../styles/App.style';
import {ScrollView} from 'react-native-gesture-handler';
import PrismSession from '../model/PrismSession';
import {SvgCss} from 'react-native-svg';
import images from '../resources/images/images';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  userProfile: UserProfile;
  prismSession: PrismSession;
}

interface State {}

class AssessmentIntroDescription extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
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
            <View style={styles.pageTitleView}>
              <Text style={styles.pageTitleText}>{this.props.localesHelper.localeString('assessment.title')}</Text>
            </View>
          </View>
          {
            <View style={styles.bottomView}>
              <ScrollView>
                <View style={{height: verticalScale(55)}}></View>
                <View style={styles.content}>
                  <Text style={styles.title}>{this.props.localesHelper.localeString('assessment.intro.title')}</Text>
                  <Text style={styles.description}>
                    {this.props.localesHelper.localeString('assessment.intro.description')}
                  </Text>
                  <SvgCss
                    xml={images.imagesSVG.prism.example}
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
                  <View style={styles.listContainer}>
                    {this.renderListItem(this.props.localesHelper.localeString('assessment.intro.explanation.item1'))}
                    {this.renderListItem(this.props.localesHelper.localeString('assessment.intro.explanation.item2'))}
                    {this.renderListItem(this.props.localesHelper.localeString('assessment.intro.explanation.item3'))}
                  </View>
                </View>
                <AppButton
                  label={this.props.localesHelper.localeString('common.next')}
                  icon={images.imagesSVG.common.continue}
                  position='right'
                  color={colors.gold}
                  onPress={() => {
                    this.props.navigation.navigate('AssessmentIntroTutorial');
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

  renderListItem(item: string) {
    return (
      <View style={styles.row}>
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
    paddingBottom: scale(20)
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

export default connect(mapStateToProps, undefined)(AssessmentIntroDescription);
