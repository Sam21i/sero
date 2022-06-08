import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';
import EmergencyNumberButton from './EmergencyNumberButton';

interface EmergencyNumberContainerProps {
  localesHelper: LocalesHelper;
}

class EmergencyContact extends Component<EmergencyNumberContainerProps> {
  render() {
    return (
      <View style={styles.view}>
        <View style={styles.topTextView}>
          <Text style={styles.topText}>{this.props.localesHelper.localeString('main.callEmergencyTop')}</Text>
        </View>
        <View style={styles.iconView}>
          <EmergencyNumberButton />
        </View>
        <View style={styles.bottomTextView}>
          <Text style={styles.bottomText}>{this.props.localesHelper.localeString('main.callEmergencyBottom')}</Text>
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

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps)(EmergencyContact);
