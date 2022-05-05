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
import { SecurityPlanModule } from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import SecurityPlanModuleComponent from '../components/SecurityPlanModuleComponent';
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
  modules: SecurityPlanModule[];
  isEditMode: boolean;
}

class SecurityplanCurrent extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: false,
      isEditMode: false,
      modules: this.props.userProfile.getCurrentSecurityPlan().getSecurityPlanModules()
    };
  }

  editModule(m: SecurityPlanModule): void {
    console.log('TODO edit module', m);
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
              <Text style={styles.topViewTextTitle}>{this.props.localesHelper.localeString('securityplan.current')}</Text>
              <Text style={styles.topViewTextDescr}>tbd</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            {!this.state.bubbleVisible &&
            <ScrollView>
              <AppButton
                label={this.props.localesHelper.localeString('common.options')}
                icon={
                  '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 26.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <g> <path fill="#fff" d="M256,0C114.8,0,0,114.8,0,256s114.8,256,256,256s256-114.9,256-256S397.2,0,256,0z M256,472.3 c-119.3,0-216.3-97-216.3-216.3S136.7,39.7,256,39.7s216.3,97,216.3,216.3S375.3,472.3,256,472.3z" /> </g> </g> <g> <g id="options"> <path fill="#fff" d="M216,146.3c0-22.1,17.9-40,40-40s40,17.9,40,40s-17.9,40-40,40S216,168.4,216,146.3z M256,213c-22.1,0-40,17.9-40,40 s17.9,40,40,40s40-17.9,40-40S278.1,213,256,213z M256,319.7c-22.1,0-40,17.9-40,40c0,22.1,17.9,40,40,40s40-17.9,40-40 C296,337.6,278.1,319.7,256,319.7z" /> </g> </g> </svg>'
                }
                position="left"
                color={colors.tumbleweed}
                onPress={() => {
                  this.setState({bubbleVisible: true});
                }}
                style={{height: scale(50), width: scale(200), paddingVertical: scale(10), marginTop: 70, marginBottom: 50}}
              />

              <View style={{ width: '100%'}}>
                { /* this is probably better done with a list of some kind */
                  this.state.modules.map(module =>  <SecurityPlanModuleComponent 
                                                      key={module.type}
                                                      editable={this.state.isEditMode}
                                                      onEdit={this.editModule.bind(this)}
                                                      module={module}
                                                    />)
                }
                
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
            </ScrollView>}
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
    paddingVertical: scale(20),
    alignSelf: 'flex-start',
    justifyContent: 'space-between'
  },
  topViewTextTitle: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.normal)
  },
  topViewTextDescr: {
    color: colors.black,
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall)
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

export default connect(mapStateToProps, undefined)(SecurityplanCurrent);
