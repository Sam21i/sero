import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import MainNotification from '../components/MainNotification';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import UserProfile from '../model/UserProfile';
import {AppStore} from '../store/reducers';
import {
  AppFonts,
  appStyles,
  colors,
  scale,
  TextSize,
} from '../styles/App.style';

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
  listVisible: boolean;
}

class Securityplan extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: true,
      listVisible: false,
    };
  }

  render() {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>
                {this.props.localesHelper.localeString('securityplan.title')}
              </Text>
            </View>
            <View style={styles.emergencyButton}>
              <EmergencyNumberButton />
            </View>
          </View>

          <View style={styles.bottomView}>
            <MainNotification />
          </View>
          <View style={appStyles.buttonContainer}>
            <AppButton
              label={this.props.localesHelper.localeString(
                'securityplan.current',
              )}
              icon={
                '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 26.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 146.7 146.7" style="enable-background:new 0 0 146.7 146.7;" xml:space="preserve"> <style type="text/css"> .st0{fill:#FFFFFF;} .st1{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-miterlimit:10;} .st2{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-linejoin:round;} </style> <g> <path class="st0" d="M45,89.7c14.3,0,25.9-11.6,25.9-25.9S59.2,38,45,38S19.1,49.6,19.1,63.8l0,0l0,0C19.1,78.1,30.7,89.7,45,89.7" /> <circle class="st1" cx="107.9" cy="88.9" r="17.7"/> <rect x="10.8" y="29.8" class="st2" width="125" height="87.1"/> </g> </svg>'
              }
              position="right"
              color={colors.primary}
              onPress={() => {
                this.props.navigation.navigate('SecurityplanCurrent');
              }}
            />
            <AppButton
              label={this.props.localesHelper.localeString('common.archive')}
              icon={
                '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 26.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 146.7 146.7" style="enable-background:new 0 0 146.7 146.7;" xml:space="preserve"> <style type="text/css"> .st0{fill:#FFFFFF;} .st1{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-miterlimit:10;} .st2{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-linejoin:round;} </style> <g> <path class="st0" d="M45,89.7c14.3,0,25.9-11.6,25.9-25.9S59.2,38,45,38S19.1,49.6,19.1,63.8l0,0l0,0C19.1,78.1,30.7,89.7,45,89.7" /> <circle class="st1" cx="107.9" cy="88.9" r="17.7"/> <rect x="10.8" y="29.8" class="st2" width="125" height="87.1"/> </g> </svg>'
              }
              position="right"
              color={colors.gold}
              onPress={() => {
                this.props.navigation.navigate('SecurityplanArchive');
              }}
              style={{height: scale(88)}}
            />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(50),
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big),
  },
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(50),
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big),
  },
  emergencyButton: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  topView: {
    backgroundColor: 'rgba(203, 95, 11, 0.5)',
    flex: 1,
    flexDirection: 'row',
  },
  bottomView: {
    flex: 0.92,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
});

// Link store data to component :
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore,
  };
}

export default connect(mapStateToProps, undefined)(Securityplan);
