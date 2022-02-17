import React, {Component} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {windowWidth} from '../styles/App.style';
import AppButton from '../components/AppButton';
import {StackNavigationProp} from '@react-navigation/stack';
import ButtonContainer from '../components/ButtonContainer';
import MainNotification from '../components/MainNotification';
import EmergencyContactContainer from '../components/EmergencyContactContainer';
import EmergencyNumberContainer from '../components/EmergencyNumberContainer';

interface PropsType {
  navigation: StackNavigationProp<any>;
}

interface State {}

export default class Main extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/background-yellow.jpg')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={{flex: 1, flexDirection:'row'}}>
            <EmergencyContactContainer></EmergencyContactContainer>
            <EmergencyNumberContainer></EmergencyNumberContainer>
          </View>
          <View style={{flex: 0.92}}>
            <MainNotification></MainNotification>
          </View>
          <ButtonContainer navigation={this.props.navigation}></ButtonContainer>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
});
