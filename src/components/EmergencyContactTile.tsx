import {color} from 'native-base/lib/typescript/theme/styled-system';
import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import EmergencyContact from '../model/EmergencyContact';
import {activeOpacity, AppFonts, colors, isSmallScreen, scale, TextSize} from '../styles/App.style';

interface EmergencyContactProps {
  size: number;
  contact: EmergencyContact;
  onPress?: () => void;
  textStyle?: Record<string, unknown>;
  style?: Record<string, unknown>;
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
      borderRadius: scale(this.props.size / 2),
      backgroundColor: contact.getUniqueColor(),
      justifyContent: 'center'
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
          <View style={[styles.textView]}>
            <Text
              style={styles.text}
              numberOfLines={2}>
              {contact.getNameOnTwoLinesString()}
            </Text>
          </View>
        </View>
      );
    } else {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={this.props.onPress}
            style={{alignItems: 'center'}}>
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
            <View style={[styles.textView]}>
              <Text
                style={styles.text}
                numberOfLines={2}>
                {contact.getNameOnTwoLinesString()}
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
    flex: 1,
    marginTop: scale(15),
    marginRight: scale(10),
    alignItems: 'center',
    height: '100%'
  },
  textView: {
    flex: 3,
    marginTop: scale(5),
    width: '100%'
  },
  text: {
    lineHeight: 24,
    textAlign: 'center',
    color: colors.white,
    fontFamily: AppFonts.medium,
    fontSize: isSmallScreen() ? TextSize.verySmall : TextSize.small
  }
});
