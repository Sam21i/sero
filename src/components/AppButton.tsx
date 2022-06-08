import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface CategoryButtonProps {
  label: string;
  icon: string;
  color: string;
  position: string;
  onPress?: () => void;
  style?: {};
  isLargeButton?: boolean;
  isDisabled?: boolean;
}

export default class AppButton extends Component<CategoryButtonProps> {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.onPress}
        disabled={this.props.isDisabled}
        activeOpacity={0.5}>
        <View
          style={[
            this.props.position === 'left' ? styles.buttonLeft : styles.buttonRight,
            {
              ...this.props.style,
              backgroundColor: this.props.color,
              minHeight: this.props.isLargeButton ? scale(82) : scale(50)
            }
          ]}>
          {this.props.position === 'left' && (
            <Text
              numberOfLines={2}
              style={[styles.buttonText, this.props.icon == undefined ? {textAlign: 'center'} : {}]}>
              {this.props.label}
            </Text>
          )}
          {this.props.icon != undefined ? (
            <SvgCss
              xml={this.props.icon}
              style={styles.icon}
            />
          ) : (
            <></>
          )}
          {this.props.position === 'right' && (
            <Text
              numberOfLines={2}
              style={[styles.buttonText, this.props.icon == undefined ? {textAlign: 'center'} : {}]}>
              {this.props.label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonRight: {
    alignSelf: 'flex-end',
    width: scale(300),
    padding: scale(10),
    borderBottomLeftRadius: scale(50),
    borderTopLeftRadius: scale(50),
    flexDirection: 'row'
  },
  buttonLeft: {
    alignSelf: 'flex-start',
    width: scale(300),
    padding: scale(10),
    borderBottomRightRadius: scale(50),
    borderTopRightRadius: scale(50),
    flexDirection: 'row'
  },
  buttonText: {
    flex: 3,
    fontSize: scale(TextSize.normalPlus),
    marginHorizontal: scale(20),
    fontFamily: AppFonts.medium,
    color: colors.white,
    alignSelf: 'center'
  },
  icon: {
    flex: 1,
    height: '100%'
  }
});
