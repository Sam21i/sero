import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {windowWidth} from '../styles/App.style';

interface EmergencyNumberButtonProps {
  onPress?: () => void;
  style?: {};
}

export default class EmergencyNumberButton extends Component<EmergencyNumberButtonProps> {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.button, {...this.props.style}]}>
          <SvgCss
            xml={
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2{fill:none;stroke:#fff;stroke-linejoin:round;stroke-width:1.8px;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M39.12,35.06a6.63,6.63,0,1,0-13.25,0V49a6.63,6.63,0,1,0,13.25,0ZM32.5,22.79a6.74,6.74,0,1,0-6.63-6.74A6.68,6.68,0,0,0,32.5,22.79Z"/></g></g></svg>'
            }
            style={styles.icon}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
    width: windowWidth * 0.24,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#0A5F6C',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
  },
  icon: {
    flex: 1,
  },
});
