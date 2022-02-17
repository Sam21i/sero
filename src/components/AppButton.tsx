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

interface CategoryButtonProps {
  label: string;
  icon: string;
  onPress?: () => void;
  style?: {};
}

export default class AppButton extends Component<CategoryButtonProps> {
  render() {
    return (
      <TouchableWithoutFeedback onPress={this.props.onPress}>
        <View style={[styles.button, {...this.props.style}]}>
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
  }
}

const styles = StyleSheet.create({
  // ...
  button: {
    alignSelf: 'flex-end',
    width: windowWidth * 0.8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#C95F1E',
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    flexDirection: 'row',
  },
  buttonText: {
    flex: 3,
    fontSize: 24,
    fontWeight: '400',
    color: 'white',
  },
  iconLeft: {
    flex: 1,
    height: '100%',
  },
  iconRight: {
    height: '100%',
    flex: 1,
  },
});
