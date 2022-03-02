import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {AppFonts, scale, TextSize, windowWidth} from '../styles/App.style';

interface CategoryButtonProps {
  label: string;
  icon: string;
  onPress?: () => void;
  style?: {};
  position: string;
}

export default class AppButton extends Component<CategoryButtonProps> {
  render() {
    if (this.props.position === 'right') {
      return (
        <TouchableWithoutFeedback onPress={this.props.onPress}>
          <View style={[styles.buttonRight, {...this.props.style}]}>
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
          <View style={[styles.buttonLeft, {...this.props.style}]}>
            <Text
              style={[
                styles.buttonText,
                this.props.icon == undefined ? {textAlign: 'center'} : {},
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
  // ...
  buttonRight: {
    alignSelf: 'flex-end',
    width: windowWidth * 0.8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#C95F1E',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    flexDirection: 'row',
  },
  buttonLeft: {
    alignSelf: 'flex-start',
    width: windowWidth * 0.8,
    paddingVertical: 10,
    paddingHorizontal: scale(10),
    paddingLeft: scale(30),
    backgroundColor: '#C95F1E',
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: 'row',
  },
  buttonText: {
    flex: 3,
    fontSize: scale(TextSize.big),
    fontFamily: AppFonts.medium,
    color: 'white',
    alignSelf: 'center',
  },
  iconLeft: {
    flex: 1,
    width: scale(50),
    height: scale(50),
  },
  iconRight: {
    flex: 1,
    width: '100%',
  },
});
