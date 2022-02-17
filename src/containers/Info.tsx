import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Circle, Rect} from 'react-native-svg';
import {windowHeight, windowWidth} from '../styles/App.style';

interface PropsType {}

interface State {}

export default class Info extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SafeAreaView edges={['right', 'bottom', 'left']}>
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
          <Text>Information</Text>
        </View>
      </SafeAreaView>
    );
  }
}
