import React, {Component} from 'react';
import {FlatList, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StackNavigationProp} from '@react-navigation/stack';
import { Questionnaire, QuestionnaireItemType, Resource } from '@i4mi/fhir_r4';
import PrismSession, { Position } from '../model/PrismSession';
import PRISM_QUESTIONNAIRE  from '../resources/static/Questionnaire.json'
import UserProfile from '../model/UserProfile';
import { connect } from 'react-redux';
import { AppStore } from '../store/reducers';
import LocalesHelper from '../locales';
import * as midataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import MidataService from '../model/MidataService';
import { IQuestion } from '@i4mi/fhir_questionnaire';
import {SvgCss} from 'react-native-svg';
import { Input, NativeBaseProvider } from 'native-base';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  localesHelper: LocalesHelper;
  addResource: (r: Resource) => void;
  addPrismSession: (s: PrismSession) => void;
}

interface State {
  prismSession: PrismSession | undefined;

}

class Assessment extends Component<PropsType, State> {
  answers: {
    [name: string]: string
  } = {}
  constructor(props: PropsType) {
    super(props);

    this.state = {
      prismSession: undefined
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      Orientation.lockToLandscape();
    });
    this.props.navigation.addListener('blur', () => {
      Orientation.lockToPortrait();
    });

    // 🛑 das ist eine Test- und Beispielimplementation wie eine PRISM-Session 🛑
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
    });

    // 🛑 hier ist das Ende der Test- und Beispielimplementation 🛑

  }

  setAnswerForQuestion(question: IQuestion) {
    if (this.answers[question.id]) {
      this.state.prismSession?.getQuestionnaireData().updateQuestionAnswers(
        question,
        {
          answer: {
            de: this.answers[question.id]          // hier kann man den Displaystring in der jeweiligen Sprache abspeichern
          },
          code: {
            valueString: this.answers[question.id] // bei Freitext-Fragen wie wir es hier haben, 
                                                   // ist der code.valueString gleich wie der Displaystring
          }
        }
      )
    }
  }

  save() {
    console.log(this.answers)
    // Set the answers in state to the questionnaireData object
    this.state.prismSession?.getQuestionnaireData().getQuestions().forEach((question) => {
      this.setAnswerForQuestion(question);
      if (question.subItems) {
        question.subItems.forEach(subitem => this.setAnswerForQuestion(subitem));
      }
    });

    // 🛑 Test- und Beispielimplementation 🛑
    // nun ist die Position der Scheibe gesetzt und die Fragen beantwortet
    // also können wir das Upload-Bundle generieren
    // dazu brauchen wir noch die User Referenz
    const ref = this.props.userProfile.getFhirReference();
    if (ref && this.state.prismSession) {
      const prismBundle = this.state.prismSession.getUploadBundle(ref);
      // upload to MIDATA
      this.props.addResource(prismBundle);
      console.log(prismBundle)
      // and also add to UserProfile
      this.props.addPrismSession(this.state.prismSession);
    } else {
      console.log('Entweder noch keine User Reference oder Prism Session vorhanden.');
    }
    // 🛑 hier ist das Ende der Test- und Beispielimplementation 🛑
  }

  renderQuestion(element: {index: number, item: IQuestion}) {
    const question = element.item;
    const questionnaireData = this.state.prismSession?.getQuestionnaireData();
    if (!questionnaireData) { // this should not happen when we already are rendering questions
      return <></>
    }
    switch (question.type) {
      case QuestionnaireItemType.GROUP: return (
        <View key={question.id}>
          <Text>== {question.label.de} ==</Text>
          { question.subItems && question.subItems.map((si: IQuestion, i: number) => this.renderQuestion({index: i, item: si}))}
        </View>
      );
      case QuestionnaireItemType.TEXT: return (
        <NativeBaseProvider key={question.id}>
          <Text>{question.label.de}</Text>
          <Input 
            value={this.answers[question.id]}
            keyboardType={'default'}
            placeholder='gib hier deine Antwort ein'
            autoCorrect={true}
            onChangeText={
              (text) => 
                this.answers[question.id] = text
              //   questionnaireData.updateQuestionAnswers(question, {
              //   answer: {
              //     de: text          // hier kann man den Displaystring in der jeweiligen Sprache abspeichern
              //   },
              //   code: {
              //     valueString: text // bei Freitext-Fragen wie wir es hier haben, 
              //                       // ist der code.valueString gleich wie der Displaystring
              //   }
              // })
            }
          />
        </NativeBaseProvider>
      );
      default: return <Text key={question.id}>Rendering Question Type {question.type} not supported</Text>
    }
  }

  render() {
    let image = '';
    try { image = this.state.prismSession?.getSVGImage() || ''}
    catch(e) { console.log(e) };
    return (
      <SafeAreaView edges={['left', 'right']}>
        { this.state.prismSession && 
          <View>
            <FlatList
              data={this.state.prismSession.getQuestionnaireData().getQuestions()}
              renderItem={(listElement) => this.renderQuestion(listElement)}
              keyExtractor={item => item.id}
              ListFooterComponent={
                <View style={{marginBottom: 20, backgroundColor:'#f5f5f5'}}>
                  <Text onPress={this.save.bind(this)} >[speichern]</Text>
                  {/* TODO: i have no idea, why the image is not displayed at all*/}
                  <SvgCss xml={image}></SvgCss>
                </View>
              }
            />
          </View>
        }       
      </SafeAreaView>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);