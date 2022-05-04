import React, {Component} from 'react';
import {Text, Button} from 'react-native';
import RNRestart from 'react-native-restart';
import {SafeAreaView} from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import MidataService from '../model/MidataService';
import { AppStore } from '../store/reducers';
import * as miDataServiceActions from '../store/midataService/actions';
import LocalesHelper from '../locales';
import {View} from 'react-native';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType {
  localesHelper: LocalesHelper;
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
        <View style={{margin: 25, marginBottom: 50}} >
          <Text style={{fontFamily: AppFonts.regular, fontSize: scale(TextSize.small)}}>
            {this.props.localesHelper.localeString('settings.later')}
          </Text>
        </View>
        {  this.props.midataService.isAuthenticated() &&
            <Button title={this.props.localesHelper.localeString('settings.logout')} onPress={() => {
              this.props.logoutUser();
              RNRestart.Restart();
            }}></Button>
        }
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
        logoutUser: () => miDataServiceActions.logoutUser(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);