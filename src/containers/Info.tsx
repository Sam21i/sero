import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Circle, Rect} from 'react-native-svg';
import { connect } from 'react-redux';
import { AppStore } from '../store/reducers';
import LocalesHelper from '../locales';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType {
  localesHelper: LocalesHelper
}

interface State {}

class Info extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SafeAreaView edges={['right', 'bottom', 'left']}>
        <View style={{margin: 25, marginBottom: 50}} >
          <Text style={{fontFamily: AppFonts.regular, fontSize: scale(TextSize.small)}}>
            {this.props.localesHelper.localeString('info.later')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state: AppStore) {
  return {
      localesHelper: state.LocalesHelperStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);