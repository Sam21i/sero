import React, {Component} from 'react';
import {ActivityIndicator, ImageBackground, Platform, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import MainNotification from '../components/MainNotification';
import EmergencyContactContainer from '../components/EmergencyContactContainer';
import EmergencyNumberContainer from '../components/EmergencyNumberContainer';
import MidataService from '../model/MidataService';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import * as userProfileActions from '../store/userProfile/actions';
import * as midataServiceActions from '../store/midataService/actions';
import UserProfile from '../model/UserProfile';
import EmergencyContact from '../model/EmergencyContact';
import LocalesHelper from '../locales';
import AppButton from '../components/AppButton';
import {appStyles, colors, scale, verticalScale} from '../styles/App.style';
import {CarePlan} from '@i4mi/fhir_r4';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  localesHelper: LocalesHelper;
  uploadPendingResources: () => void;
  setEmergencyContacts: (e: EmergencyContact[]) => void;
  setSecurityPlan: (plan: CarePlan) => void;
  setSecurityPlanHistory: (plans: CarePlan[]) => void;
}

interface State {
  emergencyContactsLoaded: boolean;
}

class Main extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      emergencyContactsLoaded: false
    };
    if (this.props.midataService.isAuthenticated()) {
      this.loadEmergencyContacts();
      this.loadSecurityPlans();
      this.props.uploadPendingResources();
    }
  }

  editContacts(): void {
    this.props.navigation.navigate('Contacts');
  }

  loadEmergencyContacts(): void {
    try {
      this.props.midataService
        .fetchEmergencyContactsForUser(this.props.userProfile.getFhirId())
        .then((contacts) => {
          this.props.setEmergencyContacts(contacts);
          this.setState({
            emergencyContactsLoaded: true
          });
        })
        .catch((e) => {
          console.log('could not load related persons', e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  loadSecurityPlans(): void {
    if (this.props.midataService.isAuthenticated()) {
      // fetch current security plan
      this.props.midataService
        .fetchSecurityPlans()
        .then((plans) => {
          if (plans.length > 0) {
            this.props.setSecurityPlan(plans[0]);
          }
        })
        .catch((e) => {
          console.log(e);
        });
      // fetch security plan history
      this.props.midataService
        .fetchSecurityPlans(true)
        .then((plans) => {
          if (plans.length > 0) {
            this.props.setSecurityPlanHistory(plans);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            {this.state.emergencyContactsLoaded && (
              <EmergencyContactContainer
                emergencyContacts={this.props.userProfile.getEmergencyContacts()}
                localesHelper={this.props.localesHelper}
                onPressOptionsButton={this.editContacts.bind(this)}
              />
            )}
            {!this.state.emergencyContactsLoaded && (
              <View style={{width: scale(274), justifyContent: 'center'}}>
                <ActivityIndicator
                  size='large'
                  color={colors.white}
                />
              </View>
            )}
            <EmergencyNumberContainer />
          </View>
          <View style={styles.bottomView}>
            <MainNotification />
          </View>
          <View style={appStyles.buttonContainer}>
            <AppButton
              label={this.props.localesHelper.localeString('securityplan.title')}
              icon={
                '<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 	 viewBox="0 0 118.7 147.3" style="enable-background:new 0 0 118.7 147.3;" xml:space="preserve"> <style type="text/css"> 	.st0{fill:none;stroke:#FFFFFF;stroke-width:4;stroke-linejoin:round;} 	.st1{fill:none;stroke:#FFFFFF;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;} 	.st2{fill:none;stroke:#FFFFFF;stroke-width:4;} </style> <g> 	<g> 		<path class="st0" d="M112.6,78.5L99.8,67.9c-1.1-1.1-2.8-1.2-4-0.2c-11.9,14.7-22.9,30.2-32.9,46.3c-11.7,18.8-9.8,24.1-9.8,24.1 			c-0.9,1.8-2.4,5.5-0.8,6.8s4.7-1,6.2-2.3c0,0,5.5,0.6,20.7-16.1c12.5-14,24.1-28.7,34.7-44.2C114.4,80.9,113.9,79.3,112.6,78.5z" 			/> 		<path class="st1" d="M88.1,64.7c-7.8,8.8-14.9,18.2-21.2,28.2"/> 		<path class="st2" d="M111.7,77.7l4.9-6.5c0.5-1.1,0.1-2.4-1-3l-7.3-5.9c-1.1-0.9-2.4-1-3-0.2l-4.7,6.5 M63,114.1l16,12.5"/> 		<path class="st0" d="M87.1,22.5h6v35.9 M43.2,127.6H2V22.5h6.1 M32.1,104.8h25.2 M24.4,109.9h-10V99.5h10V109.9z M32.2,79h34 			 M24.4,84h-10V73.7h10V84z M32.3,53H80 M24.6,58.3H14.4V47.9h10L24.6,58.3z M47.4,10.9c-2.3,0-4.3,1.8-4.3,4.2v0.1 			c-0.2,2.3,1.6,4.3,3.9,4.5c2.3,0.2,4.3-1.6,4.5-3.9c0-0.1,0-0.2,0-0.3l0,0c0.2-2.4-1.6-4.4-4-4.5C47.5,10.8,47.5,10.8,47.4,10.9 			L47.4,10.9z M80,19.4c0.1-3-2.3-5.4-5.3-5.5c0,0,0,0,0,0H61.2c-1.1,0-2-0.8-2.3-1.8C58,5.6,52,1.2,45.5,2.1h-0.3 			c-4.9,1-8.8,4.9-9.5,9.9c-0.2,1.1-1.2,1.8-2.3,1.8H20.1c-2.9,0.1-5.3,2.5-5.2,5.5v14.8H80V19.4z"/></g></g></svg>'
              }
              position='right'
              color={colors.primary}
              onPress={() => {
                this.props.navigation.navigate('Securityplan');
              }}
            />
            <AppButton
              label={this.props.localesHelper.localeString('prismS.title')}
              icon={
                '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 26.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 146.7 146.7" style="enable-background:new 0 0 146.7 146.7;" xml:space="preserve"> <style type="text/css"> .st0{fill:#FFFFFF;} .st1{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-miterlimit:10;} .st2{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-linejoin:round;} </style> <g> <path class="st0" d="M45,89.7c14.3,0,25.9-11.6,25.9-25.9S59.2,38,45,38S19.1,49.6,19.1,63.8l0,0l0,0C19.1,78.1,30.7,89.7,45,89.7" /> <circle class="st1" cx="107.9" cy="88.9" r="17.7"/> <rect x="10.8" y="29.8" class="st2" width="125" height="87.1"/> </g> </svg>'
              }
              position='right'
              color={colors.gold}
              onPress={() => {
                //this.props.navigation.navigate('Assessment')
              }}
            />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  topView: {
    height: verticalScale(165) + (Platform.OS === 'android' ? 80 - verticalScale(54) : 0),
    flexDirection: 'row'
  },
  bottomView: {
    flex: 0.92,
    backgroundColor: 'rgba(255, 255, 255, 0.65)'
  }
});

function mapStateToProps(state: AppStore) {
  return {
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore,
    localesHelper: state.LocalesHelperStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    setEmergencyContacts: (contacts: EmergencyContact[]) => userProfileActions.setEmergencyContacts(dispatch, contacts),
    setSecurityPlan: (plan: CarePlan) => userProfileActions.setSecurityPlan(dispatch, plan),
    setSecurityPlanHistory: (plans: CarePlan[]) => userProfileActions.setSecurityPlanHistory(dispatch, plans),
    uploadPendingResources: () => midataServiceActions.uploadPendingResources(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
