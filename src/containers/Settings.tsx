import React, {Component} from 'react';
import {Text, Button} from 'react-native';
import RNRestart from 'react-native-restart';
import {SafeAreaView} from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import MidataService from '../model/MidataService';
import { AppStore } from '../store/reducers';
import * as miDataServiceActions from '../store/midataService/actions';

interface PropsType {
      midataService: MidataService;
      logoutUser: () => void;
}

interface State {}

class Settings extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SafeAreaView edges={['right', 'bottom', 'left']}>
        <Text>Settings</Text>
        {  this.props.midataService.isAuthenticated() &&
            <Button title="logout" onPress={() => {
              this.props.logoutUser();
              RNRestart.Restart()
            }}></Button>
        }
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppStore) {
    return {
        midataService: state.MiDataServiceStore,
        userProfile: state.UserProfileStore
    };
}

function mapDispatchToProps(dispatch: Function) {
    return {
        logoutUser: () => miDataServiceActions.logoutUser(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);