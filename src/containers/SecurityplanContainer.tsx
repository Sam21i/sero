import { CarePlan, CarePlanIntent, CarePlanStatus, Resource, Reference } from '@i4mi/fhir_r4';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import SecurityPlanModel from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import { AppStore } from '../store/reducers';
import * as midataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import { Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface PropsType {
  userProfile: UserProfile;
  synchronizeResource: (r: Resource) => void;
  replaceSecurityPlan: (newPlan: SecurityPlanModel, oldPlan: SecurityPlanModel, u: Reference) => void;
}

interface State {
  securityPlan: SecurityPlanModel;
}

// just for testing, delete before merge
const TEST_PLAN: CarePlan = {
  resourceType: 'CarePlan',
  status: CarePlanStatus.ACTIVE,
  id: 'sicherheitsplan',
  contained: [
      {
          resourceType: 'CarePlan',
          id: 'modul1',
          status: 'active',
          intent: 'plan',
          title: 'Meine Motivation zu leben',
          category: [
              {
                  coding: [
                      {
                          system: 'http://midata.coop/sero/CODESYSTEMTBD',
                          code: 'securityplan/motivation'
                      }
                  ]
              }
          ],
          description: 'Was gibt mir Kraft? Was hält mich am Leben? Was möchte ich noch erleben?',
          activity: [
              {
                  detail: {
                      status: 'unknown',
                      description: 'Fische füttern'
                  }
              }
          ]
      },
      {
          resourceType: 'CarePlan',
          id: 'modul2',
          status: 'active',
          intent: 'plan',
          title: 'Meine Frühwarnzeichen',
          category: [
              {
                  coding: [
                      {
                          system: 'http://midata.coop/sero/CODESYSTEMTBD',
                          code: 'securityplan/warningSigns'
                      }
                  ]
              }
          ],
          description: 'Welche Gedanken, Gefühle oder Verhaltensweisen treten bei mir vor einer suizidalen Krise auf?',
          activity: [
              {
                  detail: {
                      status: 'unknown',
                      description: 'Krokodile küssen'
                  }
              }
          ]
      },
      {
          resourceType: 'CarePlan',
          id: 'modul3',
          status: 'active',
          intent: 'plan',
          title: 'Meine Bewältigungsstrategien',
          category: [
              {
                  coding: [
                      {
                          system: 'http://midata.coop/sero/CODESYSTEMTBD',
                          code: 'securityplan/copingStrategies'
                      }
                  ]
              }
          ],
          description: 'Was tue ich selbst, wenn Suizidgedanken stärker werden? Was hilft mir in solchen Augenblicken?',
          activity: [
              {
                  detail: {
                      status: 'unknown',
                      description: 'Schafe streicheln'
                  }
              }
          ]
      },
      {
          resourceType: 'CarePlan',
          id: 'modul4',
          status: 'active',
          intent: 'plan',
          title: 'Meine Ablenkungsstrategien',
          category: [
              {
                  coding: [
                      {
                          system: 'http://midata.coop/sero/CODESYSTEMTBD',
                          code: 'securityplan/distractionStrategies'
                      }
                  ]
              }
          ],
          description: 'Welche Aktivität tut mir gut? An welchen Orten und Plätzen oder mit welchen Menschen komme ich auf andere Gedanken?',
          activity: [
              {
                  detail: {
                      status: 'unknown',
                      description: 'Hunde hüten'
                  }
              }
          ]
      },
      {
          resourceType: 'CarePlan',
          id: 'modul5',
          status: 'active',
          intent: 'plan',
          title: 'Meine Glaubenssätze',
          category: [
              {
                  coding: [
                      {
                          system: 'http://midata.coop/sero/CODESYSTEMTBD',
                          code: 'securityplan/personalBeliefs'
                      }
                  ]
              }
          ],
          description: 'Was sind meine Glaubenssätze? TEXT TBD',
          activity: [
              {
                  detail: {
                      status: 'unknown',
                      description: 'Wale wählen'
                  }
              }
          ]
      },
      {
          resourceType: 'CarePlan',
          id: 'modul6',
          status: CarePlanStatus.ACTIVE,
          intent: 'plan',
          title: 'Meine professionellen Helfer- und Notfallnummern',
          category: [
              {
                  coding: [
                      {
                          system: 'http://midata.coop/sero/CODESYSTEMTBD',
                          code: 'securityplan/professionalContacts'
                      }
                  ]
              }
          ],
          description: 'Welche Fachpersonen oder Organisationen unterstützen mich im Notfall?',
          activity: [
              {
                  detail: {
                      status: 'unknown',
                      description: 'Beratung LUPS (0900 85 65 65)'
                  }
              },
              {
                  detail: {
                      status: 'unknown',
                      description: 'Die Dargebotene Hand (143)'
                  }
              },
              {
                  detail: {
                      status: 'unknown',
                      description: 'Polizei (117)'
                  }
              }
          ]
      }
  ] as CarePlan[],
  intent: CarePlanIntent.PLAN,
  title: 'Neuer Sicherheitsplan (27.4.)',
  created: new Date().toISOString(),
  subject: {},
  author: {},
  basedOn: [
      {
          reference: '#modul1',
          type: 'CarePlan'
      },
      {
          reference: '#modul2',
          type: 'CarePlan'
      },
      {
          reference: '#modul4',
          type: 'CarePlan'
      },
      {
          reference: '#modul3',
          type: 'CarePlan'
      },
      {
          reference: '#modul5',
          type: 'CarePlan'
      },
      {
          reference: '#modul6',
          type: 'CarePlan'
      }
  ]
}

class SecurityplanContainer extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      securityPlan: this.props.userProfile.getCurrentSecurityPlan()
    };
  }

  updateSecurityPlan(_plan: SecurityPlanModel): void {
    const userReference = this.props.userProfile.getFhirReference();
    if (userReference) {
      this.props.synchronizeResource(_plan.getFhirResource(userReference));
    }
  }

  test() {
    const modules = this.state.securityPlan.getSecurityPlanModules();
    const newOrder = [1,2,3,0,5,4];
    modules[0].entries.push('Neuer Eintrag vom ' + new Date().toLocaleString());
    modules.forEach((module, index) => {
      module.order = newOrder[index];
    });
    this.state.securityPlan.setModulesWithOrder(modules);
    this.updateSecurityPlan(this.state.securityPlan);
  };

  archivePlan() {
    const userReference = this.props.userProfile.getFhirReference();
    if (userReference) {
      this.props.replaceSecurityPlan(
        new SecurityPlanModel(TEST_PLAN), 
        this.state.securityPlan, 
        userReference
      );
    }
  }

  render() {
    return (
      <SafeAreaView edges={['top', 'bottom']}>
        { this.state.securityPlan 
          ? <View>
              <Text>Just for testing, can be trashed</Text>
              <Text>{ this.state.securityPlan.getTitle() }</Text>
              { this.state.securityPlan.getSecurityPlanModules().map(module => {
                return (
                  <View key={module.type}>
                    <Text>Modul: {module.title}</Text>
                    <Text> {module.description}</Text>
                    <Text>TODO...</Text>
                  </View>
                );
              })}
            <TouchableOpacity onPress={this.test.bind(this)}><Text>Click for Test</Text></TouchableOpacity>

            <TouchableOpacity onPress={this.archivePlan.bind(this)}><Text>Click for Archive</Text></TouchableOpacity>
            </View>
          : <Text>SecurityPlan</Text> 
        }
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppStore) {
  return {
      userProfile: state.UserProfileStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    replaceSecurityPlan: (n: SecurityPlanModel, o: SecurityPlanModel, u: Reference) => 
      userProfileActions.replaceSecurityPlan(dispatch, n, o, u),
    synchronizeResource: (r: Resource) => midataServiceActions.synchronizeResource(dispatch, r)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityplanContainer);