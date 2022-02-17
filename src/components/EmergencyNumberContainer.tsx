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
import {
  AppFonts,
  scale,
  TextSize,
  windowHeight,
  windowWidth,
} from '../styles/App.style';
import AppButton from './AppButton';
import EmergencyNumberButton from './EmergencyNumberButton';

interface EmergencyNumberContainerProps {}

export default class EmergencyContact extends Component<EmergencyNumberContainerProps> {
  render() {
    return (
      <View style={styles.view}>
        <View style={styles.topTextView}>
          <Text style={styles.topText}>Notfall</Text>
        </View>
        <View style={styles.iconView}>
          <EmergencyNumberButton></EmergencyNumberButton>
        </View>
        <View style={styles.bottomTextView}>
          <Text style={styles.bottomText}>anrufen</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#rgba(255, 0, 0, 0.3)',
  },
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: 'white',
  },
  iconView: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: 'white',
  },
});
