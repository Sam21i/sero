import React, {Component} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import ButtonContainer from '../components/ButtonContainer';
import MainNotification from '../components/MainNotification';
import EmergencyContactContainer from '../components/EmergencyContactContainer';
import EmergencyNumberContainer from '../components/EmergencyNumberContainer';
import LocalesHelper from '../locales';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
}

interface State {}

export default class Main extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <EmergencyContactContainer></EmergencyContactContainer>
            <EmergencyNumberContainer></EmergencyNumberContainer>
          </View>
          <View style={styles.bottomView}>
            <MainNotification></MainNotification>
          </View>
          <ButtonContainer
            navigation={this.props.navigation}
            localesHelper={this.props.localesHelper}></ButtonContainer>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  topView: {
    flex: 1,
    flexDirection: 'row',
  },
  bottomView: {
    flex: 0.92,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
});
