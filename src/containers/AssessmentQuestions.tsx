import React, {Component} from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StackNavigationProp} from '@react-navigation/stack';
import {Resource} from '@i4mi/fhir_r4';
import PrismSession, {PrismInitializer} from '../model/PrismSession';
import UserProfile from '../model/UserProfile';
import {connect} from 'react-redux';
import {AppStore} from '../store/reducers';
import LocalesHelper from '../locales';
import * as midataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import MidataService from '../model/MidataService';
import {IQuestion} from '@i4mi/fhir_questionnaire';
import {SvgCss} from 'react-native-svg';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import Question from '../components/Question';
import AssessmentQuitSpeechBubble, {ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE} from '../components/AssessmentQuitSpeechBubble';
import AssessmentEndOptions from './AssessmentEndOptions';
import {ASSESSMENT_END_SPEECH_BUBBLE_MODE} from '../components/AssessmentEndOptionsSpeechBubble';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import EditPencil from '../resources/images/icons/securityplan/pencil.svg';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  localesHelper: LocalesHelper;
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
    } catch (e) {}
    try {
      svgImage = this.state.prismSession?.getSVGImage() || '';
    } catch (e) {}
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
          {this.props.localesHelper.localeString('assessment.followUpTitle')}
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
                this.props.navigation.pop(1);
              }}>
              <EditPencil
                style={styles.editIcon}
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

        <Text
          style={{
            paddingBottom: scale(10),
            color: colors.black,
            fontFamily: AppFonts.medium,
            fontSize: scale(TextSize.small)
          }}>
          {this.props.localesHelper.localeString('assessment.assessmentFollowUpHint')}
        </Text>
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
            icon: '<?xml version="1.0" encoding="iso-8859-1"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 305.002 305.002" style="enable-background:new 0 0 305.002 305.002;" xml:space="preserve"> <g> <g> <path fill="#FFFFFF" d="M152.502,0.001C68.412,0.001,0,68.412,0,152.501s68.412,152.5,152.502,152.5c84.089,0,152.5-68.411,152.5-152.5 S236.591,0.001,152.502,0.001z M152.502,280.001C82.197,280.001,25,222.806,25,152.501c0-70.304,57.197-127.5,127.502-127.5 c70.304,0,127.5,57.196,127.5,127.5C280.002,222.806,222.806,280.001,152.502,280.001z"/> <path fill="#FFFFFF" d="M218.473,93.97l-90.546,90.547l-41.398-41.398c-4.882-4.881-12.796-4.881-17.678,0c-4.881,4.882-4.881,12.796,0,17.678 l50.237,50.237c2.441,2.44,5.64,3.661,8.839,3.661c3.199,0,6.398-1.221,8.839-3.661l99.385-99.385 c4.881-4.882,4.881-12.796,0-17.678C231.269,89.089,223.354,89.089,218.473,93.97z"/> </g> </g></svg>',
            onPress: this.save.bind(this)
          },
          {
            label: 'common.cancel',
            color: colors.grey,
            icon: '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 37.5 37.5"><defs><style>.cls-1,.cls-3{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{stroke:#fff;stroke-width:2.5px;}.cls-4{clip-path:url(#clip-path-2);}</style><clipPath id="clip-path" transform="translate(0 0)"><path class="cls-1" d="M1.25,18.75a17.5,17.5,0,1,0,17.5-17.5,17.51,17.51,0,0,0-17.5,17.5"/></clipPath><clipPath id="clip-path-2" transform="translate(0 0)"><rect class="cls-1" width="37.5" height="37.5"/></clipPath></defs><g class="cls-2"><line class="cls-3" x1="11.25" y1="11.25" x2="26.25" y2="26.25"/><line class="cls-3" x1="26.25" y1="11.25" x2="11.25" y2="26.25"/></g><g class="cls-4"><circle class="cls-3" cx="18.75" cy="18.75" r="17.5"/></g></svg>',
            onPress: this.cancel.bind(this)
          }
        ].map((button, index) => (
          <AppButton
            key={'appButton_' + index}
            label={this.props.localesHelper.localeString(button.label)}
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
    let svgImage = this.state.prismSession?.getSVGImage() || '';
    let base64Image = this.state.prismSession?.getBase64Image() || {
      contentType: '',
      data: ''
    };
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
              <Text style={styles.topViewTextTitle}>
                {this.props.localesHelper.localeString('assessment.addEntry')}
              </Text>
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
                localesHelper={this.props.localesHelper}
                onClose={this.onCloseQuit.bind(this)}
              />
            )}
            {this.state.endBubbleVisible && (
              <AssessmentEndOptions
                navigation={this.props.navigation}
                localesHelper={this.props.localesHelper}
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
    minHeight: scale(81),
    maxHeight: scale(81)
  },
  topTextView: {
    flex: 1,
    paddingLeft: scale(50),
    alignSelf: 'flex-start',
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
    top: verticalScale(45)
  },
  bottomView: {
    flex: 7,
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
  editIcon: {
    alignSelf: 'center'
  }
});

function mapStateToProps(state: AppStore) {
  return {
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore,
    localesHelper: state.LocalesHelperStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    addResource: (r: Resource) => midataServiceActions.addResource(dispatch, r),
    addPrismSession: (s: PrismSession) => userProfileActions.addNewPrismSession(dispatch, s)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentQuestions);
