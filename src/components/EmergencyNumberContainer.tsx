import {background} from 'native-base/lib/typescript/theme/styled-system';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';

import {AppFonts, colors, isSmallScreen, scale, TextSize} from '../styles/App.style';
import EmergencyNumberButton from './EmergencyNumberButton';

class EmergencyContact extends Component<WithTranslation> {
  render() {
    return (
      <View style={styles.view}>
        <View style={styles.iconView}>
          <EmergencyNumberButton />
        </View>
        <View style={styles.bottomTextView}>
          <Text style={styles.bottomText}>{this.props.t('main.callEmergencyTop')}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    paddingLeft: scale(16),
    paddingBottom: scale(16),
    paddingTop: scale(16),
    backgroundColor: colors.primary50opac,
    justifyContent: 'flex-end'
  },
  iconView: {
    flex: 0
  },
  bottomTextView: {
    flex: 0
  },
  bottomText: {
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: AppFonts.medium,
    fontSize: isSmallScreen() ? TextSize.verySmall : TextSize.small,
    color: colors.white
  }
});

export default withTranslation()(EmergencyContact);
