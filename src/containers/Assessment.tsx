import React, { Component } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Orientation from "react-native-orientation-locker";
import { StackNavigationProp } from "@react-navigation/stack";

interface PropsType {
    navigation: StackNavigationProp<any>;
}

interface State {}

export default class Assessment extends Component<PropsType, State> {
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

  }

  render() {
    return (
      <SafeAreaView edges={["top", "bottom"]}>
        <Text>Assessment (quer)</Text>
      </SafeAreaView>
    );
  }
}
