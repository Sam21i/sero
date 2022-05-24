import React, {Component} from 'react';
import {Text} from 'react-native';
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
import MidataService from '../model/MidataService';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  localesHelper: LocalesHelper;
  addResource: (r: Resource) => void;
}

interface State {}

class Assessment extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
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
    // TODO: richtig implementieren mit GUI und so ;-), und dann den Teil hier löschen
    const prismSession = new PrismSession({
      // Position der schwarzen Scheibe am Schluss des Assessments (also wie es abgespeichert wird) - in tatsächlichen Pixel
      blackDiscPosition: new Position(100, 100), 
      // Angabe wie breit (lange Seite) das Feld auf dem Device dargestellt wird - in tatsächlichen Pixel
      canvasWidth: 500,
      // der Questionnaire, der die Folgefragen definiert - TODO: das muss noch so gelöst werden dass es von MIDATA geladen wird, aber fürs erste geht das so
      questionnaire: PRISM_QUESTIONNAIRE as Questionnaire
    });

    // hier werden die Fragenobjekte aus dem Questionnaire geholt, die dann auch zum rendern verwendet werden können
    const questionaire = prismSession.getQuestionnaireData();

    // da wir im Beispiel nichts rendern, iterieren wir einfach über die Fragen und "beantworten" sie
    questionaire.getQuestions().forEach(q => {
      if (q.type === QuestionnaireItemType.GROUP && q.subItems) {
        // Fragen vom Typ GROUP haben Unter-Items, aber keine eigene Frage / Antwort
        // also beantworten wir die Unter-Items (theoretisch können diese auch wieder vom Typ GROUP sein, 
        // aber in diesem Questionnaire haben wir nur zwei Ebenen, also müssen wir diesen Fall nicht berücksichtigen)
        q.subItems.forEach(sq => {
          questionaire.updateQuestionAnswers(sq, {
            answer: {
              de: 'Das ist eine Antwort auf eine Unterfrage. 🚇' // hier kann man den Displaystring in der jeweiligen Sprache abspeichern
            },
            code: {
              valueString: 'Das ist eine Antwort auf eine Unterfrage. 🚇' // bei Freitext-Fragen wie wir es hier haben, 
                                                                          // ist der code / valueString gleich wie der Displaystring
            }
          });
        });
      } else { // hier kommen wir zu den Fragen, die nicht vom Typ GROUP sind (erste Ebene), die müssen wir auch noch beantworten
        questionaire.updateQuestionAnswers(q, {
          answer: {
            de: 'Das ist eine Antwort auf eine Überfrage. 🔝' // hier kann man den Displaystring in der jeweiligen Sprache abspeichern
          },
          code: {
            valueString: 'Das ist eine Antwort auf eine Überfrage. 🔝' // bei Freitext-Fragen wie wir es hier haben, 
                                                                       // ist der code / valueString gleich wie der Displaystring
          }
        });
      }
    });

    // nun ist die Position der Scheibe gesetzt und die Fragen beantwortet
    // also können wir das Upload-Bundle generieren
    // dazu brauchen wir noch die User Referenz
    const ref = this.props.userProfile.getFhirReference();
    if (ref) {
      const prismBundle = prismSession.getUploadBundle(ref)
      console.log('PRISM Bundle:', prismBundle);
      // upload to MIDATA
      this.props.addResource(prismBundle);
    }

    // 🛑 hier ist das Ende der Test- und Beispielimplementation 🛑

  }

  render() {
    return (
      <SafeAreaView edges={['top', 'bottom']}>
        <Text>Assessment (quer)</Text>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Assessment);