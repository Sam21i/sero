import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import UserProfile from '../model/UserProfile';
import { AppStore } from '../store/reducers';
import * as userProfileActions from '../store/userProfile/actions';

interface PropsType {
  userProfile: UserProfile;
}

interface State {}

class SecurityplanContainer extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
    console.log('security plan', this.props.userProfile.getCurrentSecurityPlan())
  }

  render() {
    return (
      <SafeAreaView edges={['top', 'bottom']}>
        <Text>Securityplan</Text>
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
      
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityplanContainer);