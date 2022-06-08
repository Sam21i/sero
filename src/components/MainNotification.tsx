import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';

interface PropsType {
  localesHelper: LocalesHelper;
  userProfile: UserProfile;
}

class MainNotification extends Component<PropsType> {
  render() {
    const userName = this.props.userProfile.getGivenName();
    return (
      <View style={styles.view}>
        <Text style={styles.title}>
          {userName ? this.props.localesHelper.localeString('main.greeting', {name: userName}) : ' '}
        </Text>
        <Text style={styles.text}>{this.props.localesHelper.localeString('main.default')}</Text>
      </View>
    );
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
    color: colors.primary,
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

export default connect(mapStateToProps)(MainNotification);
