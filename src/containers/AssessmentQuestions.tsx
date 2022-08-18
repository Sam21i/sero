import {IQuestion} from '@i4mi/fhir_questionnaire';
import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation-locker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import {ASSESSMENT_END_SPEECH_BUBBLE_MODE} from '../components/AssessmentEndOptionsSpeechBubble';
import AssessmentQuitSpeechBubble, {ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE} from '../components/AssessmentQuitSpeechBubble';
import BackButton from '../components/BackButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import Question from '../components/Question';
import MidataService from '../model/MidataService';
import PrismSession, {PrismInitializer} from '../model/PrismSession';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import * as midataServiceActions from '../store/midataService/actions';
import {AppStore} from '../store/reducers';
import * as userProfileActions from '../store/userProfile/actions';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import AssessmentEndOptions from './AssessmentEndOptions';

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;

  addResource: (r: Resource) => void;
  addPrismSession: (s: PrismSession) => void;
  route: {params: {prismData: PrismInitializer}};
}

interface State {
  prismSession: PrismSession | undefined;
  quitBubbleVisible: boolean;
  endBubbleVisible: boolean;
}

class AssessmentQuestions extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      prismSession: new PrismSession(props.route.params.prismData),
      quitBubbleVisible: false,
      endBubbleVisible: false
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
    });
  }

  save() {
    const ref = this.props.userProfile.getFhirReference();
    if (ref && this.state.prismSession) {
      const prismBundle = this.state.prismSession.getUploadBundle(ref);
      prismBundle.id = 'prism-bundle'; // needs a temporary id or there will be errors in midataActions
      // upload to MIDATA
      this.props.addResource(prismBundle);
      // and also add to UserProfile
      this.props.addPrismSession(this.state.prismSession);
    } else {
      console.log('Entweder noch keine User Reference oder Prism Session vorhanden.');
    }
    this.props.navigation.navigate('AssessmentSessionStackScreen', {screen: 'AssessmentEndOptions'});
  }

  cancel() {
    this.setState({quitBubbleVisible: true});
  }

  onChangeText(newText: string, question: IQuestion) {
    this.state.prismSession?.getQuestionnaireData().updateQuestionAnswers(question, {
      answer: {
        de: newText
      },
      code: {
        valueString: newText
      }
    });
  }

  onCloseQuit(mode: ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE) {
    switch (mode) {
      case ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE.yes:
        this.props.navigation.navigate('AssessmentStackScreen', {screen: 'AssessmentMain'});
        break;
      case ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE.no:
        this.setState({quitBubbleVisible: false});
        break;
      default:
        this.setState({quitBubbleVisible: false});
    }
  }

  onCloseEnd(mode: ASSESSMENT_END_SPEECH_BUBBLE_MODE) {
    switch (mode) {
      case ASSESSMENT_END_SPEECH_BUBBLE_MODE.securityplan:
        this.props.navigation.navigate('SecurityplanStackScreen', {screen: 'SecurityplanCurrent'});
        break;
      case ASSESSMENT_END_SPEECH_BUBBLE_MODE.mainPage:
        this.props.navigation.navigate('Main');
        break;
      case ASSESSMENT_END_SPEECH_BUBBLE_MODE.emergencyContact:
        break;
      default:
        this.setState({endBubbleVisible: false});
    }
  }

  renderHeader() {
    let svgImage = '';
    let base64Image = {
      contentType: '',
      data: ''
    };
    try {
      base64Image = this.state.prismSession?.getBase64Image() || base64Image;
    } catch (e) {
      console.log(e);
    }
    try {
      svgImage = this.state.prismSession?.getSVGImage() || '';
    } catch (e) {
      console.log(e);
    }
    return (
      <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
        <View style={{height: verticalScale(55)}} />
        <Text
          style={{
            paddingBottom: scale(10),
            color: colors.primary2_60opac,
            fontFamily: AppFonts.bold,
            fontSize: scale(TextSize.big)
          }}>
          {this.props.t('assessment.followUpTitle')}
        </Text>

        {svgImage !== '' && (
          <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
            <SvgCss
              xml={svgImage}
              style={[
                styles.imageSvg,
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
            <TouchableOpacity
              style={{marginLeft: scale(10), marginBottom: scale(5)}}
              onPress={() => {
                this.props.navigation.pop();
              }}>
              <SvgCss
                xml={images.imagesSVG.common.retry}
                style={styles.retryIcon}
                width={scale(30)}
                height={scale(50)}
              />
            </TouchableOpacity>
          </View>
        )}
        {base64Image.contentType !== '' && (
          <Image
            style={[
              styles.imageBase64,
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
            source={{uri: 'data:' + base64Image.contentType + ';base64,' + base64Image.data}}
          />
        )}
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={{position: 'relative', right: -scale(20), marginVertical: scale(20)}}>
        {[
          {
            label: 'common.save',
            color: colors.gold,
            icon: images.imagesSVG.common.save,
            onPress: this.save.bind(this)
          },
          {
            label: 'common.cancel',
            color: colors.grey,
            icon: images.imagesSVG.common.cancel,
            onPress: this.cancel.bind(this)
          }
        ].map((button, index) => (
          <AppButton
            key={'appButton_' + index}
            label={this.props.t(button.label)}
            position='right'
            icon={button.icon}
            color={button.color}
            onPress={button.onPress}
            style={styles.button}
          />
        ))}
      </View>
    );
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
                this.props.navigation.pop();
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topViewTextTitle}>{this.props.t('assessment.addEntry')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            {!this.state.quitBubbleVisible && (
              <KeyboardAwareFlatList
                removeClippedSubviews={false}
                extraScrollHeight={verticalScale(50)}
                ListHeaderComponent={this.renderHeader.bind(this)}
                data={this.state.prismSession?.getQuestionnaireData().getQuestions()}
                renderItem={(listElement) => (
                  <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
                    <Question
                      question={listElement.item}
                      onChangeText={this.onChangeText.bind(this)}
                      isArchiveMode={false}
                    />
                  </View>
                )}
                keyExtractor={(item) => item.id}
                ListFooterComponent={this.renderFooter.bind(this)}
              />
            )}
            {this.state.quitBubbleVisible && (
              <AssessmentQuitSpeechBubble
                navigation={this.props.navigation}
                onClose={this.onCloseQuit.bind(this)}
              />
            )}
            {this.state.endBubbleVisible && (
              <AssessmentEndOptions
                navigation={this.props.navigation}
                onClose={this.onCloseEnd.bind(this)}
              />
            )}
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
  topView: {
    backgroundColor: colors.gold50opac,
    flex: 1,
    flexDirection: 'row'
  },
  topTextView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  topViewTextTitle: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.normal)
  },
  topViewTextDescr: {
    color: colors.black,
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall)
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
    flex: 7.9,
    backgroundColor: colors.white65opac
  },
  imageBase64: {
    width: '100%',
    maxHeight: scale(300),
    minHeight: scale(225),
    resizeMode: 'contain',
    marginVertical: scale(15)
  },
  imageSvg: {
    width: scale(297 * 0.9),
    height: scale(210 * 0.9),
    marginVertical: scale(15)
  },
  icon: {
    flex: 1,
    height: '100%'
  },
  listItemContent: {
    flex: 3
  },
  listItemContentIcon: {
    flex: 1,
    margin: 10
  },
  button: {
    height: scale(50),
    width: scale(225),
    marginBottom: scale(20)
  },
  retryIcon: {
    alignSelf: 'center'
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
    addResource: (r: Resource) => midataServiceActions.addResource(dispatch, r),
    addPrismSession: (s: PrismSession) => userProfileActions.addNewPrismSession(dispatch, s)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AssessmentQuestions));
