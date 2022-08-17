import React, {Component} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {SvgCss} from 'react-native-svg';

import images from '../resources/images/images';
import {activeOpacity, colors, scale, verticalScale} from '../styles/App.style';

export default class EmergencyNumberButton extends Component {
  callEmergency() {
    console.warn('Emergency Number is still hardcoded');
    Linking.openURL('tel:144');
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={() => {
          this.callEmergency();
        }}>
        <View style={[styles.button]}>
          <SvgCss
            xml={images.imagesSVG.common.emergencyContact}
            width='100%'
            height='100%'
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
    width: scale(90),
    height: scale(78),
    paddingVertical: verticalScale(15),
    marginBottom: scale(28),
    paddingLeft: scale(10),
    paddingRight: scale(20),
    backgroundColor: colors.petrol,
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 100
  }
});
