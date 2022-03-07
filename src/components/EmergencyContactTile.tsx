import initials from 'initials';
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
  abbr = initials(this.props.text);

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
    if (this.props.imageSource) {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <TouchableWithoutFeedback onPress={this.props.onPress}>
            <Image
              style={[image_avatar, styles.image]}
              source={this.props.imageSource}
            />
          </TouchableWithoutFeedback>
          <View style={[styles.textView, {width: this.props.size}]}>
            <Text style={styles.text} adjustsFontSizeToFit>
              {this.props.text}
            </Text>
          </View>
        </View>
      );
    } else {
      emergencyContactAvatar = (
        <View style={styles.view}>
          <View style={text_avatar}>
            {!!this.props.text && (
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
              {this.props.text}
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
