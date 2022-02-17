import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {windowHeight, windowWidth} from '../styles/App.style';
import AppButton from './AppButton';

interface MainNotificationProps {}

export default class MainNotification extends Component<MainNotificationProps> {
  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.title}>Hallo Hans-Rudolf</Text>
        <View style={styles.innerView}>
          <Text style={styles.text}>
            Gut gemacht, du hattest gestern einen tollen Spaziergang.
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginVertical: windowHeight * 0.05,
    justifyContent: 'space-evenly',
    //backgroundColor: '#ff0000',
    paddingLeft: windowWidth * 0.1,
  },
  innerView: {
    flex: 1,
    //backgroundColor: '#fff000',
    paddingRight: windowWidth * 0.1,
    paddingTop: windowHeight * 0.02,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C95F1E',
  },
  text: {
    fontSize: 20,
    fontWeight: '400',
    color: 'black',
  },
});
