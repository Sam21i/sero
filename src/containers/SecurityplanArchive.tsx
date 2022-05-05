import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  userProfile: UserProfile;
  addResource: (r: Resource) => void;
  synchronizeResource: (r: Resource) => void;
}

interface State {
  bubbleVisible: boolean;
}

class SecurityplanArchive extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: false
    };
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewTextTitle}>{this.props.localesHelper.localeString('common.archive')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <ScrollView>
              <View style={{height: 70, width: '100%'}}></View>

              <View style={{backgroundColor: colors.white, height: 300, width: '100%'}}>
                <Text>Place your Securityplan Archive here</Text>
              </View>

              <AppButton
                label={this.props.localesHelper.localeString('common.back')}
                icon={
                  '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
                }
                position="right"
                color={colors.tumbleweed}
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{height: scale(50), width: scale(200), paddingVertical: scale(10), marginVertical: 50}}
              />
            </ScrollView>
          </View>
          <View style={styles.emergencyButton}>
            <EmergencyNumberButton />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topView: {
    backgroundColor: 'rgba(203, 95, 11, 0.5)',
    flex: 1
  },
  topTextView: {
    flex: 1,
    paddingLeft: scale(50),
    alignSelf: 'flex-start',
    justifyContent: 'center'
  },
  topViewTextTitle: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  emergencyButton: {
    position: 'absolute',
    right: -0.2,
    top: scale(55)
  },
  bottomView: {
    flex: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.65)'
  }
});

// Link store data to component :
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

export default connect(mapStateToProps, undefined)(SecurityplanArchive);
