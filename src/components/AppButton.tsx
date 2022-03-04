import React, {Component} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {
  AppFonts,
  scale,
  TextSize,
  verticalScale,
} from '../styles/App.style';

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
          <View
            style={[
              styles.buttonRight,
              {...this.props.style},
              {backgroundColor: this.props.color},
            ]}>
            {this.props.icon != undefined ? (
              //in case of migration (exception)
              <SvgCss xml={this.props.icon} style={styles.iconLeft} />
            ) : (
              <></>
            )}
            <Text
              style={[
                styles.buttonText,
                this.props.icon == undefined ? {textAlign: 'center'} : {},
              ]}>
              {this.props.label}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else if (this.props.position === 'left') {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View
            style={[
              styles.buttonLeft,
              {...this.props.style},
              {backgroundColor: this.props.color},
            ]}>
            <Text
              style={[
                styles.buttonText,
                this.props.icon == undefined ? {textAlign: 'center'} : {},
                {paddingLeft: scale(40)},
              ]}>
              {this.props.label}
            </Text>
            {this.props.icon != undefined ? (
              //in case of migration (exception)
              <SvgCss xml={this.props.icon} style={styles.iconLeft} />
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
    paddingLeft: scale(5),
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    flexDirection: 'row',
  },
  buttonLeft: {
    alignSelf: 'flex-start',
    width: scale(300),
    paddingVertical: verticalScale(15),
    paddingRight: scale(5),
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: 'row',
  },
  buttonText: {
    flex: 3,
    fontSize: scale(TextSize.normal + 2),
    fontFamily: AppFonts.medium,
    color: 'white',
    alignSelf: 'center',
  },
  iconLeft: {
    flex: 1,
    height: '100%',
  },
  iconRight: {
    flex: 1,
    width: '100%',
  },
});
