import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
} from 'react-native';
import EmergencyContact from '../model/EmergencyContact';
import {
  scale,
  TextSize
} from '../styles/App.style';

interface EmergencyContactProps {
  size: any;
  contact: EmergencyContact;
  onPress?: () => void;
  textStyle?: any;
  style?: any;
}

export default class EmergencyContactTile extends Component<EmergencyContactProps> {
    constructor(props: EmergencyContactProps) {
        super(props);
        console.log('contact tile constructor', this.props.contact)
    }

  render() {
    //Image Avatar Styling
    const image_avatar = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
    };

    const textContainerStyle = {
      borderRadius: this.props.size / 2,
      color: 'white',
      fontWeight: '400',
      textAlign: 'center',
      fontSize: this.props.size / 2.5,
    };

    //If source is undefined or not provided then default_text_avatar styles will be used to display default user avatar
    const text_avatar = {
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      backgroundColor: 'green',
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
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <Image
              style={[image_avatar, styles.image]}
              source={{uri: 'data:' + contact.image}}
            />
          </TouchableWithoutFeedback>
          <View style={[styles.textView, {width: this.props.size}]}>
            <Text style={styles.text} adjustsFontSizeToFit>
              {contact.getNameString()}
            </Text>
          </View>
        </View>
      );
    } else {
      emergencyContactAvatar = (
        <View style={styles.view}>
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
          <View style={[styles.textView, {width: this.props.size}]}>
            <Text style={styles.text} adjustsFontSizeToFit>
              {contact.getNameString()}
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
  image: {},
  textView: {
    justifyContent: 'center',
    marginTop: scale(5),
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: scale(TextSize.verySmall -2),
  },
});
