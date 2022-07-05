import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {SvgCss} from 'react-native-svg';

import images from '../resources/images/images';
import {scale} from '../styles/App.style';

interface PropsType {
  onPress?: () => void;
}

const SIZE = scale(20);

export default class BackButton extends Component<PropsType> {
  render() {
    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={this.props.onPress}>
        <SvgCss
          xml={images.imagesSVG.common.chevronBack}
          width={SIZE}
          height={SIZE}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: scale(40),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
