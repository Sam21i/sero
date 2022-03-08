import initials from 'initials';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import {
  AppFonts,
  colors,
  scale,
  TextSize,
  verticalScale,
} from '../styles/App.style';

interface EmergencyContactProps {
  size: any;
  name: any;
  imageSource: any;
  onPress?: () => void;
  textStyle?: any;
  style?: any;
}

export default class EmergencyContact extends Component<EmergencyContactProps> {
  abbr = initials(this.props.name);

  render() {
    //Image Avatar Styling
    const image_avatar = {
      width: scale(this.props.size),
      height: scale(this.props.size),
      borderRadius: scale(this.props.size / 2),
    };

    const textContainerStyle = {
      borderRadius: scale(this.props.size / 2),
      color: colors.white,
      textAlign: 'center',
      fontSize: scale(this.props.size / 2.25),
    };

    //If source is undefined or not provided then default_text_avatar styles will be used to display default user avatar
    const text_avatar = {
      width: scale(this.props.size),
      height: scale(this.props.size),
      borderRadius: scale(this.props.size / 2),
      backgroundColor: colors.grey,
      textAlignVertical: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    };

    let emergencyContactAvatar;

    if (this.props.imageSource) {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <Image style={image_avatar} source={this.props.imageSource} />
          </TouchableWithoutFeedback>
          <View style={[styles.textView, {width: this.props.size}]}>
            <Text style={styles.text} adjustsFontSizeToFit>
              {this.props.name}
            </Text>
          </View>
        </View>
      );
    } else {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <View style={text_avatar}>
            {!!this.props.name && (
              <Text
                style={[
                  {
                    ...textContainerStyle,
                  },
                  this.props.textStyle,
                ]}>
                {this.abbr}
              </Text>
            )}
          </View>
          <View style={[styles.textView, {width: this.props.size}]}>
            <Text style={styles.text} adjustsFontSizeToFit>
              {this.props.name}
            </Text>
          </View>
        </View>
      );
    }
    return emergencyContactAvatar;
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  textView: {
    marginTop: verticalScale(2.5),
  },
  text: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: AppFonts.medium,
    fontSize: scale(TextSize.verySmall),
  },
});
