import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import EmergencyContact from '../model/EmergencyContact';
import {activeOpacity, AppFonts, colors, isSmallScreen, scale, TextSize} from '../styles/App.style';

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
    const image_avatar = {
      width: scale(this.props.size),
      height: scale(this.props.size),
      marginHorizontal: HORIZONTAL_MARGIN,
      borderRadius: scale(this.props.size / 2)
    };

    const textContainerStyle = {
      borderRadius: scale(this.props.size / 2),
      color: colors.white,
      textAlign: 'center',
      fontSize: scale(this.props.size / 2.25)
    };

    let emergencyContactAvatar;
    const contact = this.props.contact;

    const text_avatar = {
      width: scale(this.props.size),
      height: scale(this.props.size),
      marginHorizontal: HORIZONTAL_MARGIN,
      borderRadius: scale(this.props.size / 2),
      backgroundColor: contact.getUniqueColor(),
      textAlignVertical: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    };
    if (contact.image) {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={this.props.onPress}>
            <Image
              style={image_avatar}
              source={{uri: 'data:' + contact.image.data}}
            />
          </TouchableOpacity>
          <View style={[styles.textView, {width: this.props.size + HORIZONTAL_MARGIN}]}>
            <Text
              style={styles.text}
              numberOfLines={2}>
              {contact.getNameString()}
            </Text>
          </View>
        </View>
      );
    } else {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={this.props.onPress}>
            <View style={text_avatar}>
              {!!contact.getNameString() && (
                <Text
                  style={[
                    {
                      ...textContainerStyle
                    },
                    this.props.textStyle
                  ]}>
                  {contact.getInitials()}
                </Text>
              )}
            </View>
            <View style={[styles.textView, {width: this.props.size + HORIZONTAL_MARGIN}]}>
              <Text
                style={styles.text}
                numberOfLines={2}>
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
    marginTop: scale(2.5)
  },
  text: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: AppFonts.medium,
    fontSize: isSmallScreen() ? TextSize.verySmall : TextSize.small
  }
});
