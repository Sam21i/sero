import React, {Component} from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import ButtonContainer from '../components/ButtonContainer';
import MainNotification from '../components/MainNotification';
import EmergencyContactContainer from '../components/EmergencyContactContainer';
import EmergencyNumberContainer from '../components/EmergencyNumberContainer';
import MidataService from '../model/MidataService';
import { AppStore } from '../store/reducers';
import { connect } from 'react-redux';
import * as userProfileActions from '../store/userProfile/actions';
import { Bundle } from '@i4mi/fhir_r4';
import UserProfile from '../model/UserProfile';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  setEmergencyContacts: (b: Bundle) => void;
}

interface State {}

class Main extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.loadEmergencyContacts();
    this.state = {};
  }

  loadEmergencyContacts(): void {
      if (this.props.midataService.isAuthenticated()) {
          this.props.midataService.fetch('/fhir/Patient').then(p => {
              console.log('patient', p)
          })
        // this.props.midataService.fetchEmergencyContactsForUser(this.props.userProfile.getFhirId())
        //   this.props.midataService.fetch('/fhir/RelatedPerson?active=true&patient=' + this.props.userProfile.getFhirId())
        // .then((result) => {
        //     console.log('fetched emergency contacts', result)
        //     this.props.setEmergencyContacts(result as Bundle);
        // })
        // .catch((e) => {
        //     console.log('could not load related persons', e)
        // })
      }
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_yellow.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <EmergencyContactContainer></EmergencyContactContainer>
            <EmergencyNumberContainer></EmergencyNumberContainer>
          </View>
          <View style={{flex: 0.92}}>
            <MainNotification></MainNotification>
          </View>
          <ButtonContainer navigation={this.props.navigation}></ButtonContainer>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
});


function mapStateToProps(state: AppStore) {
    return {
        midataService: state.MiDataServiceStore,
        userProfile: state.UserProfileStore
    };
}

function mapDispatchToProps(dispatch: Function) {
    return {
        setEmergencyContacts: (bundle: Bundle) => userProfileActions.setEmergencyContacts(dispatch, bundle),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
