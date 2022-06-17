import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';

interface PropsType {
  navigation?: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  userProfile: UserProfile;
  defaultChance?: number;
  securityplanUpdatedChance?: number;
  positiveChance?: number;
  type: BANNER_TYPE;
  titleColor?: string;
}

export const enum BANNER_TYPE {
  main = 'MAIN',
  securityplan = 'SECURITYPLAN',
  assessment = 'ASSESSMENT'
}

const NOTIFICATION_OPTIONS = ['motivation', 'copingStrategies', 'distractionStrategies', 'personalBeliefs'];

class Banner extends Component<PropsType> {
  randomNumber = Math.random();
  static defaultProps = {
    defaultChance: 2,
    securityplanUpdatedChance: 1,
    positiveChance: 3,
    titleColor: colors.primary
  };

  constructor(props: PropsType) {
    super(props);
    if (props.navigation) {
      props.navigation.addListener('focus', () => {
        this.randomNumber = Math.random();
      });
    }
  }

  renderMessage() {
    const max = this.props.defaultChance + this.props.securityplanUpdatedChance + this.props.positiveChance,
      defaultChance = this.props.defaultChance / max,
      securityplanUpdatedChance = this.props.securityplanUpdatedChance / max;

    if (this.randomNumber < defaultChance) {
      return <Text style={styles.text}>{this.props.localesHelper.localeString('main.default')}</Text>;
    } else if (this.randomNumber < defaultChance + securityplanUpdatedChance) {
      return <Text style={styles.text}>{this.props.localesHelper.localeString('main.securityplanUpdated')}</Text>;
    } else {
      return this.renderPositive();
    }
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  renderPositive() {
    let currentSecurityplan = this.props.userProfile.getCurrentSecurityPlan();
    const filteredModules = currentSecurityplan
      .getSecurityPlanModules()
      .filter((m) => m.entries.length > 0 && m.type !== 'professionalContacts' && m.type !== 'warningSigns');
    if (filteredModules.length !== 0) {
      const selectedModule = filteredModules[this.getRandomInt(filteredModules.length)];
      const selectedEntry = selectedModule.entries[this.getRandomInt(selectedModule.entries.length)];
      const messageParts = (
        this.props.localesHelper.localeString(
          'securityplan.notification.' +
            NOTIFICATION_OPTIONS[NOTIFICATION_OPTIONS.findIndex((item) => item === selectedModule.type)]
        ) + selectedEntry
      ).split(':');
      return (
        <View>
          <Text
            numberOfLines={2}
            style={styles.text}
            adjustsFontSizeToFit>
            {messageParts[0] + ':'}
          </Text>
          <Text
            numberOfLines={2}
            style={styles.text}>
            {'- ' + messageParts[1]}
          </Text>
        </View>
      );
    } else {
      return <Text style={styles.text}>{this.props.localesHelper.localeString('main.default')}</Text>;
    }
  }

  render() {
    const userName = this.props.userProfile.getGivenName();
    if (this.props.type === BANNER_TYPE.securityplan) {
      return (
        <View style={styles.view}>
          <Text style={[styles.title, {color: this.props.titleColor}]}>
            {userName ? this.props.localesHelper.localeString('main.greeting', {name: userName}) : ' '}
          </Text>
          <Text style={styles.text}>{this.props.localesHelper.localeString('securityplan.defaultHint')}</Text>
        </View>
      );
    } else if (this.props.type === BANNER_TYPE.assessment) {
      return (
        <View style={styles.view}>
          <Text style={[styles.title, {color: this.props.titleColor}]}>
            {userName ? this.props.localesHelper.localeString('main.greeting', {name: userName}) : ' '}
          </Text>
          <Text style={styles.text}>{this.props.localesHelper.localeString('assessment.defaultHint')}</Text>
        </View>
      );
    } else {
      return (
        <View
          key={this.props.userProfile.getCurrentSecurityPlan().fhirResource.id}
          style={styles.view}>
          <Text style={[styles.title, {color: this.props.titleColor}]}>
            {userName ? this.props.localesHelper.localeString('main.greeting', {name: userName}) : ' '}
          </Text>
          {this.props.userProfile.getCurrentSecurityPlan().fhirResource.id !== undefined ? this.renderMessage() : ''}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingLeft: scale(40),
    paddingRight: scale(60)
  },
  title: {
    fontSize: scale(TextSize.big),
    fontFamily: AppFonts.bold,
    marginBottom: scale(10)
  },
  text: {
    fontSize: scale(TextSize.normal),
    fontFamily: AppFonts.regular,
    color: colors.black
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    userProfile: state.UserProfileStore
  };
}

export default connect(mapStateToProps)(Banner);
