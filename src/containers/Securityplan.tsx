import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface PropsType {}

interface State {}

export default class Securityplan extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SafeAreaView edges={['top', 'bottom']}>
        <Text>Securityplan</Text>
      </SafeAreaView>
    );
  }
}
