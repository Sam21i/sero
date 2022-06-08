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
  message: string;
}

interface State {}

class SecurityPlanNotification extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {};
  }

  render() {
    const userName = this.props.userProfile.getGivenName();
    const messageParts = this.props.message.split(':');
    return (
      <View style={styles.view}>
        <Text style={styles.title}>
          {userName ? userName : ''}
        </Text>
        {messageParts.length === 1 ? (
          <Text
            numberOfLines={3}
            style={styles.text}
            adjustsFontSizeToFit>
            {messageParts[0]}
          </Text>
        ) : (
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
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingLeft: scale(40),
    paddingRight: scale(20),
  },
  title: {
    fontSize: scale(TextSize.big),
    fontFamily: AppFonts.bold,
    color: colors.primary,
    marginBottom: scale(10)
  },
  text: {
    fontSize: scale(TextSize.small),
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

export default connect(mapStateToProps)(SecurityPlanNotification);
