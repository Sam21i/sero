import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface CategoryButtonProps {
  label: string;
  icon: string;
  color: string;
  position: string;
  onPress?: () => void;
  style?: {};
}

export default class AppButton extends Component<CategoryButtonProps> {
  render() {
    if (this.props.position === 'right') {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View style={[styles.buttonRight, {...this.props.style}, {backgroundColor: this.props.color}]}>
            {this.props.icon != undefined ? (
              <SvgCss
                xml={this.props.icon}
                style={styles.icon}
              />
            ) : (
              <></>
            )}
            <Text style={[styles.buttonText, this.props.icon == undefined ? {textAlign: 'center'} : {}]}>
              {this.props.label}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (this.props.position === 'left') {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View style={[styles.buttonLeft, {...this.props.style}, {backgroundColor: this.props.color}]}>
            <Text
              style={[
                styles.buttonText,
                this.props.icon == undefined ? {textAlign: 'center'} : {},
                {paddingLeft: scale(40)}
              ]}>
              {this.props.label}
            </Text>
            {this.props.icon != undefined ? (
              <SvgCss
                xml={this.props.icon}
                style={styles.icon}
              />
            ) : (
              <></>
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }
}

const styles = StyleSheet.create({
  buttonRight: {
    alignSelf: 'flex-end',
    width: scale(300),
    paddingVertical: verticalScale(15),
    paddingLeft: Platform.OS === 'ios' ? scale(5) : 0,
    borderBottomLeftRadius: scale(50),
    borderTopLeftRadius: scale(50),
    flexDirection: 'row'
  },
  buttonLeft: {
    alignSelf: 'flex-start',
    width: scale(300),
    paddingVertical: verticalScale(15),
    paddingRight: Platform.OS === 'ios' ? scale(5) : 0,
    borderBottomRightRadius: scale(50),
    borderTopRightRadius: scale(50),
    flexDirection: 'row'
  },
  buttonText: {
    flex: 3,
    fontSize: scale(TextSize.normalPlus),
    fontFamily: AppFonts.medium,
    color: colors.white,
    alignSelf: 'center'
  },
  icon: {
    flex: 1,
    height: '100%'
  }
});
