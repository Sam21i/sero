import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import EmergencyContact from '../model/EmergencyContact';
import {
  AppFonts,
  colors,
  isSmallScreen,
  scale,
  TextSize,
  verticalScale
} from '../styles/App.style';

interface EmergencyContactProps {
  size: number;
  contact: EmergencyContact;
  onPress?: () => void;
  textStyle?: any;
  style?: any;
}

const HORIZONTAL_MARGIN = 10;

export default class EmergencyContactTile extends Component<EmergencyContactProps> {
    constructor(props: EmergencyContactProps) {
        super(props);
    }

  render() {
    //Image Avatar Styling
    const image_avatar = {
      width: scale(this.props.size),
      height: scale(this.props.size),
      marginHorizontal: HORIZONTAL_MARGIN,
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
      marginHorizontal: HORIZONTAL_MARGIN,
      borderRadius: scale(this.props.size / 2),
      backgroundColor: colors.grey,
      textAlignVertical: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    };

    let emergencyContactAvatar;
    const contact = this.props.contact;

    if (contact.image) {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <TouchableOpacity onPress={this.props.onPress}>
            <Image style={image_avatar} source={{uri: 'data:' + contact.image.data}} />
          </TouchableOpacity>
          <View style={[styles.textView, {width: this.props.size + 2 * HORIZONTAL_MARGIN}]}>
            <Text style={styles.text} numberOfLines={2}>
             {contact.getNameString()}
            </Text>
          </View>
        </View>
      );
    } else {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <TouchableOpacity onPress={this.props.onPress}>
            <View style={text_avatar}>
              {!!contact.getNameString() && (
                <Text
                  style={[
                    {
                      ...textContainerStyle,
                    },
                    this.props.textStyle,
                  ]}>
                  {contact.getInitials()}
                </Text>
              )}
            </View>
            <View style={[styles.textView, {width: this.props.size + 2 * HORIZONTAL_MARGIN}]}>
              <Text style={styles.text} numberOfLines={2} >
                {contact.getNameString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return emergencyContactAvatar;
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  textView: {
    alignSelf: 'center',
    marginHorizontal: 0,
    height: verticalScale(2.5 * (isSmallScreen() ? TextSize.verySmall : TextSize.small)),
    marginTop: verticalScale(2.5),
  },
  text: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: AppFonts.medium,
    fontSize: isSmallScreen() ? TextSize.verySmall : TextSize.small,
  },
});
