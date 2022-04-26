import { Resource } from '@i4mi/fhir_r4';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import SecurityPlanModel from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import { AppStore } from '../store/reducers';
import * as midataServiceActions from '../store/midataService/actions';
import { Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface PropsType {
  userProfile: UserProfile;
  synchronizeResource: (r: Resource) => void;
}

interface State {
  securityPlan: SecurityPlanModel;
}

class SecurityplanContainer extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      securityPlan: this.props.userProfile.getCurrentSecurityPlan()
    };
    console.log('security plan', this.state.securityPlan);
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
    synchronizeResource: (r: Resource) => midataServiceActions.synchronizeResource(dispatch, r)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityplanContainer);