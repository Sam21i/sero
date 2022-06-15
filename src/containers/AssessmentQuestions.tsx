import React, {Component} from 'react';
import {FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StackNavigationProp} from '@react-navigation/stack';
import {Resource} from '@i4mi/fhir_r4';
import PrismSession, {Position, PrismInitializer} from '../model/PrismSession';
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
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import {ASSESSMENT_RESOURCES} from '../resources/static/assessmentIntroResources';
import Question from '../components/Question';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  localesHelper: LocalesHelper;
  addResource: (r: Resource) => void;
  addPrismSession: (s: PrismSession) => void;
  route: {params: {prismData: PrismInitializer}}
}

interface State {
  prismSession: PrismSession | undefined;
}

class AssessmentQuestions extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      prismSession: new PrismSession(props.route.params.prismData)
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
    });
    /** 🛑 das ist eine Test- und Beispielimplementation wie eine PRISM-Session 🛑
    // erstellt und gespeichert wird
    const prismSession = new PrismSession({
      // Position der schwarzen Scheibe am Schluss des Assessments (also wie es abgespeichert wird) - in tatsächlichen Pixel
      blackDiscPosition: new Position(100, 100),
      // Angabe wie breit (lange Seite) das Feld auf dem Device dargestellt wird - in tatsächlichen Pixel
      canvasWidth: 500,
      // der Questionnaire, der die Folgefragen definiert - TODO: das muss noch so gelöst werden dass es von MIDATA geladen wird, aber fürs erste geht das so
      questionnaire: PRISM_QUESTIONNAIRE as Questionnaire
    });

    // hier werden die Fragenobjekte aus dem Questionnaire geholt, die dann auch zum rendern verwendet werden können
    this.setState({
      prismSession: prismSession
    });**/

    // 🛑 hier ist das Ende der Test- und Beispielimplementation 🛑
  }


  save() {
    // 🛑 Test- und Beispielimplementation 🛑
    // nun ist die Position der Scheibe gesetzt und die Fragen beantwortet
    // also können wir das Upload-Bundle generieren
    // dazu brauchen wir noch die User Referenz
    const ref = this.props.userProfile.getFhirReference();
    if (ref && this.state.prismSession) {
      const prismBundle = this.state.prismSession.getUploadBundle(ref);
      prismBundle.id = 'prism-bundle'; // needs a temporary id or there will be errors in midataActions
      // upload to MIDATA
      this.props.addResource(prismBundle);
      console.log(prismBundle);
      // and also add to UserProfile
      this.props.addPrismSession(this.state.prismSession);
    } else {
      console.log('Entweder noch keine User Reference oder Prism Session vorhanden.');
    }
    // 🛑 hier ist das Ende der Test- und Beispielimplementation 🛑
  }

  onChangeText(newText: string, question: IQuestion) {
    this.state.prismSession?.getQuestionnaireData().updateQuestionAnswers(question, {
      answer: {
        de: newText // hier kann man den Displaystring in der jeweiligen Sprache abspeichern
      },
      code: {
        valueString: newText // bei Freitext-Fragen wie wir es hier haben,
        // ist der code.valueString gleich wie der Displaystring
      }
    });
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
            <ScrollView>
              {/* View for PRISM-Image and Description */}
              <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
                <View style={{height: verticalScale(55)}}></View>
                <Text
                  style={{
                    paddingBottom: scale(10),
                    color: colors.primary2_60opac,
                    fontFamily: AppFonts.bold,
                    fontSize: scale(TextSize.big)
                  }}>
                  {this.props.localesHelper.localeString('assessment.followUpTitle')}
                </Text>
                { svgImage !== '' && 
                  <SvgCss
                    xml={svgImage}
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
                }
                { base64Image.contentType !== '' &&
                            <Image
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
                              source={{uri: 'data:' + base64Image.data}}
                          />
                          }
                <Text
                  style={{
                    paddingBottom: scale(10),
                    color: colors.black,
                    fontFamily: AppFonts.bold,
                    fontSize: scale(TextSize.verySmall)
                  }}>
                  {this.props.localesHelper.localeString('assessment.assessmentFollowUpHint')}
                </Text>

                {this.state.prismSession && (
                  <View>
                    <FlatList
                      scrollEnabled={false}
                      data={this.state.prismSession.getQuestionnaireData().getQuestions()}
                      renderItem={(listElement) => (
                        <Question
                          question={listElement.item}
                          onChangeText={this.onChangeText}></Question>
                      )}
                      keyExtractor={(item) => item.id}
                      ListFooterComponent={
                        <View style={{marginBottom: 20, backgroundColor: '#f5f5f5'}}>
                          <Text
                            onPress={() => {
                              this.save.bind(this);
                              this.props.navigation.navigate('AssessmentStackScreen', {screen: 'AssessmentMain'});
                            }}>
                            [speichern]
                          </Text>
                        </View>
                      }
                    />
                  </View>
                )}
              </View>
            </ScrollView>
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
    flex: 1
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
  image: {
    width: scale(297 * 0.75),
    height: scale(210 * 0.75),
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
