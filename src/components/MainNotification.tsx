import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {
  AppFonts,
  colors,
  scale,
  TextSize,
  verticalScale,
} from '../styles/App.style';

interface MainNotificationProps {
  localesHelper: LocalesHelper;
  userProfile: UserProfile;
}

class MainNotification extends Component<MainNotificationProps> {
  render() {
    const userName = this.props.userProfile.getGivenName();
    return (
      <View style={styles.view}>
        <Text style={styles.title}>
          { userName
            ? this.props.localesHelper.localeString('main.greeting', { name: userName,})
            : ' '
          }
        </Text>
        <Text style={styles.text}>
          {this.props.localesHelper.localeString('main.default')}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginTop: verticalScale(40),
    paddingLeft: scale(40),
  },
  title: {
    fontSize: scale(TextSize.big),
    fontFamily: AppFonts.bold,
    color: colors.primary,
    marginBottom: scale(15),
  },
  text: {
    fontSize: scale(TextSize.normal),
    fontFamily: AppFonts.regular,
    color: colors.black,
  },
});

// Link store data to component:
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    userProfile: state.UserProfileStore,
  };
}

export default connect(mapStateToProps)(MainNotification);
