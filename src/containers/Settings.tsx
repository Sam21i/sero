import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Button,Text,View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import * as miDataServiceActions from '../store/midataService/actions';
import {AppStore} from '../store/reducers';
import {AppFonts, scale, TextSize} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  logoutUser: () => Promise<void>;
}

interface State {}

class Settings extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  logout(): void {
    this.props.logoutUser().then(() => {
      this.props.navigation.navigate('OnboardingStackScreen');
    });
  }

  render() {
    return (
      <SafeAreaView edges={['right', 'bottom', 'left']}>
        <View style={{margin: 25, marginBottom: 50}}>
          <Text style={{fontFamily: AppFonts.regular, fontSize: scale(TextSize.small)}}>
            {this.props.localesHelper.localeString('settings.later')}
          </Text>
        </View>
        <Button
          title={this.props.localesHelper.localeString('settings.logout')}
          onPress={this.logout.bind(this)}
        />
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    logoutUser: () => miDataServiceActions.logoutUser(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
