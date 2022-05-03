import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface PropsType {
  navigation: StackNavigationProp<any>;
}

interface State {}

export default class SecurityplanArchive extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SafeAreaView>
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
          <Text>SecurityplanArchive</Text>
          <Button
            title="back"
            onPress={() => {
              this.props.navigation.goBack();
            }}></Button>
        </View>
      </SafeAreaView>
    );
  }
}
