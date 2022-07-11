import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import {AppFonts, colors, scale, TextSize} from '../styles/App.style';
import EmergencyNumberButton from './EmergencyNumberButton';

class EmergencyContact extends Component<WithTranslation> {
  render() {
    return (
      <View style={styles.view}>
        <View style={styles.topTextView}>
          <Text style={styles.topText}>{this.props.t('main.callEmergencyTop')}</Text>
        </View>
        <View style={styles.iconView}>
          <EmergencyNumberButton />
        </View>
        <View style={styles.bottomTextView}>
          <Text style={styles.bottomText}>{this.props.t('main.callEmergencyBottom')}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: colors.primary50opac
  },
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white
  },
  iconView: {
    flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  bottomTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white
  }
});

export default withTranslation()(EmergencyContact);
