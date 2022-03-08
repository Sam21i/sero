import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
import {colors, scale, verticalScale} from '../styles/App.style';
import EmergencyContactIcon from '../resources/images/icons/icon_emergencyContact.svg';

interface EmergencyNumberButtonProps {
  onPress?: () => void;
}

export default class EmergencyNumberButton extends Component<EmergencyNumberButtonProps> {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.button]}>
          <EmergencyContactIcon width='100%' height='100%'/>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
    width: scale(90),
    height: verticalScale(75),
    paddingVertical: verticalScale(15),
    paddingLeft: scale(10),
    paddingRight: scale(20),
    backgroundColor: colors.petrol,
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 100,
  },
});
