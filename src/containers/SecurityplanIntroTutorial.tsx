import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import PrismSession from '../model/PrismSession';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, appStyles, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import {STORAGE} from './App';

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;
  userProfile: UserProfile;
  prismSession: PrismSession;
  route: {params: {canGoBack: boolean}};
}

interface State {
  canGoBack: boolean;
}

class SecurityplanIntroTutorial extends Component<PropsType, State> {
  scrollViewRef: any;
  handleScroll: any;
  constructor(props: PropsType) {
    super(props);
    this.scrollViewRef = React.createRef();
    this.state = {canGoBack: props.route.params.canGoBack};
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
          <View style={appStyles.topViewSecurityplan}>
            <BackButton
              color={colors.white}
              onPress={() => {
                this.state.canGoBack
                  ? this.props.navigation.pop()
                  : this.props.navigation.navigate('SecurityplanCurrent', {isEditMode: true});
              }}
            />
            <View style={styles.pageTitleView}>
              <Text style={styles.pageTitleText}>{this.props.t('securityplan.title')}</Text>
            </View>
          </View>
          {
            <View style={styles.bottomView}>
              <ScrollView ref={(ref) => (this.scrollViewRef = ref)}>
                <View style={{height: verticalScale(55)}}></View>
                <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
                  <Text style={styles.title}>{this.props.t('common.tutorial')}</Text>
                  <Text style={styles.bulletText}>{this.props.t('securityplan.tutorial.content')}</Text>
                  <View style={{height: scale(40)}}></View>
                </View>
                {this.state.canGoBack && (
                  <AppButton
                    label={this.props.t('common.start')}
                    icon={images.imagesSVG.common.start}
                    position='right'
                    color={colors.primary}
                    onPress={() => {
                      AsyncStorage.setItem(STORAGE.SHOULD_DISPLAY_SECURITYPLAN_INTRO, 'false').then(() => {
                        this.props.navigation.reset({
                          index: 0,
                          routes: [
                            {
                              name: 'SecurityplanSessionStackScreen',
                              params: {isEditMode: true}
                            }
                          ]
                        });
                      });
                    }}
                    isLargeButton
                  />
                )}
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
    top: verticalScale(47)
  },
  pageTitleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
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
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

export default connect(mapStateToProps, undefined)(withTranslation()(SecurityplanIntroTutorial));
