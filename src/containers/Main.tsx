import {CarePlan} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {ActivityIndicator, ImageBackground, Platform, StyleSheet, View} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import Banner, {BANNER_TYPE} from '../components/Banner';
import EmergencyContactContainer from '../components/EmergencyContactContainer';
import EmergencyNumberContainer from '../components/EmergencyNumberContainer';
import LocalesHelper from '../locales';
import EmergencyContact from '../model/EmergencyContact';
import MidataService from '../model/MidataService';
import {PrismResources} from '../model/PrismSession';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import * as midataServiceActions from '../store/midataService/actions';
import {AppStore} from '../store/reducers';
import * as userProfileActions from '../store/userProfile/actions';
import {colors, scale, verticalScale} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  localesHelper: LocalesHelper;
  uploadPendingResources: () => void;
  setEmergencyContacts: (e: EmergencyContact[]) => void;
  setSecurityPlan: (plan: CarePlan) => void;
  setSecurityPlanHistory: (plans: CarePlan[]) => void;
  setPrismSessions: (sessions: PrismResources[]) => void;
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
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      if (this.props.midataService.isAuthenticated()) {
        this.loadEmergencyContacts();
        this.loadSecurityPlans();
        this.loadPrismSessions();
        this.props.uploadPendingResources();
      }
    });
  }

  editContacts(): void {
    this.props.navigation.navigate('Contacts');
  }

  loadEmergencyContacts(): void {
    this.setState({
      emergencyContactsLoaded: this.props.userProfile.getEmergencyContacts().length > 1
    });
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

  loadPrismSessions(): void {
    try {
      const userId = this.props.userProfile.getFhirId();
      if (userId && this.props.midataService.isAuthenticated()) {
        this.props.midataService.fetchPrismSessions(userId).then((sessions) => {
          this.props.setPrismSessions(sessions);
        });
      }
    } catch (e) {
      console.log(error);
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
          source={images.imagesPNG.backgrounds.moodLightOrange}
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
            <View style={{height: verticalScale(55)}}></View>
            <Banner
              type={BANNER_TYPE.main}
              navigation={this.props.navigation}
            />
          </View>
          <View
            style={{
              paddingBottom: verticalScale(55),
              position: 'relative',
              backgroundColor: colors.white65opac
            }}>
            <AppButton
              label={this.props.localesHelper.localeString('securityplan.title')}
              icon={images.imagesSVG.common.securityplan}
              position='right'
              color={colors.primary}
              onPress={() => {
                this.props.navigation.navigate('SecurityplanStackScreen');
              }}
              isLargeButton
            />
            <View style={{height: verticalScale(15)}}></View>
            <AppButton
              label={this.props.localesHelper.localeString('assessment.title')}
              icon={images.imagesSVG.common.assessment}
              position='right'
              color={colors.gold}
              onPress={() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{name: 'AssessmentStackScreen'}]
                });
              }}
              isLargeButton
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
    flex: 1,
    backgroundColor: colors.white65opac
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
    setPrismSessions: (sessions: PrismResources[]) => userProfileActions.setPrismSessionsFromMIDATA(dispatch, sessions),
    setSecurityPlanHistory: (plans: CarePlan[]) => userProfileActions.setSecurityPlanHistory(dispatch, plans),
    uploadPendingResources: () => midataServiceActions.uploadPendingResources(dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
