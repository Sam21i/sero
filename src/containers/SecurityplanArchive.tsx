import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import SecurityPlanModel from '../model/SecurityPlan';
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
  securityplanHistory: SecurityPlanModel[];
  selectedSecurityplan: SecurityPlanModel;
}

class SecurityplanArchive extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: false,
      securityplanHistory: this.props.userProfile.getSecurityPlanHistory(),
      selectedSecurityplan: undefined
    };
  }

  renderList() {
    return this.state.securityplanHistory.map((item) => {
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({selectedSecurityplan: item});
          }}
          key={item.fhirResource.id}>
          <View style={styles.listItem}>
            <View style={styles.listItemContent}>
              <Text
                numberOfLines={2}
                style={styles.listItemTitleText}>
                {this.props.localesHelper.localeString('securityplan.former')}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.listItemSubtitleText}>
                {moment(item.fhirResource.created).format('dd, Do MMMM YYYY') || ''}
              </Text>
            </View>
            <View style={styles.listItemContentIcon}>
              <SvgCss
                xml={
                  '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 118.67 147.33"><defs><style>.cls-1,.cls-3,.cls-4,.cls-5{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3,.cls-4,.cls-5{stroke:#fff;stroke-width:4px;}.cls-3,.cls-4{stroke-linejoin:round;}.cls-4{stroke-linecap:round;}</style><clipPath id="clip-path" transform="translate(-22.48 -1.72)"><circle class="cls-1" cx="74.65" cy="75.38" r="107.5"/></clipPath></defs><g class="cls-2"><path class="cls-3" d="M135.08,80.18,122.25,69.62a2.94,2.94,0,0,0-4-.21,464.18,464.18,0,0,0-32.89,46.26c-11.7,18.84-9.8,24.15-9.8,24.15-.91,1.8-2.44,5.46-.76,6.82s4.67-1,6.17-2.33c0,0,5.52.57,20.65-16.12A429.77,429.77,0,0,0,136.32,84,3.19,3.19,0,0,0,135.08,80.18Z" transform="translate(-22.48 -1.72)"/><path class="cls-4" d="M110.59,66.39a210.15,210.15,0,0,0-21.2,28.18" transform="translate(-22.48 -1.72)"/><path class="cls-5" d="M134.13,79.46,139,73A2.35,2.35,0,0,0,138,70l-7.31-5.89c-1.06-.86-2.38-1-3-.18L123,70.41m-37.57,45.4,16,12.53" transform="translate(-22.48 -1.72)"/><path class="cls-3" d="M109.53,24.26h6V60.15M65.67,129.34H24.48V24.26h6.14m24,82.22H79.78m-32.89,5.17h-10V101.24h10Zm7.75-30.9h34m-41.77,5h-10V75.4h10Zm7.89-31h47.7M47.11,60H36.91V49.6h10Zm22.8-47.41a4.24,4.24,0,0,0-4.31,4.16v.11a4.21,4.21,0,1,0,8.41.25v0A4.27,4.27,0,0,0,70,12.56Zm32.57,8.51a5.36,5.36,0,0,0-5.26-5.46H83.66a2.32,2.32,0,0,1-2.27-1.83A11.84,11.84,0,0,0,68,3.83l-.31,0a12,12,0,0,0-9.54,9.9,2.31,2.31,0,0,1-2.26,1.83H42.58a5.36,5.36,0,0,0-5.23,5.46V35.82h65.13Z" transform="translate(-22.48 -1.72)"/></g></svg>'
                }
                style={styles.icon}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    });
  }

  renderSecurityplan() {
    return this.state.selectedSecurityplan.getSecurityPlanModules().map((module) => {
      return <Text>{module.description}</Text>;
    });
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
          {this.state.selectedSecurityplan ? (
            <View style={styles.topView}>
              <View style={styles.topTextView}>
                <Text style={styles.topViewTextTitle}>{this.props.localesHelper.localeString('securityplan.former')}</Text>
                <Text style={styles.topViewTextDescr}>{moment(this.state.selectedSecurityplan.fhirResource.created).format('dd, Do MMMM YYYY, h:mm')}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.topView}>
              <View style={styles.topTextView}>
                <Text style={styles.topViewTextTitle}>{this.props.localesHelper.localeString('common.archive')}</Text>
              </View>
            </View>
          )}
          <View style={styles.bottomView}>
            <ScrollView>
              <View style={{height: 70, width: '100%'}}></View>
              {this.state.selectedSecurityplan ? this.renderSecurityplan() : this.renderList()}
              <AppButton
                label={this.props.localesHelper.localeString('common.back')}
                icon={
                  '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
                }
                position="right"
                color={colors.tumbleweed}
                onPress={() => {
                  this.state.selectedSecurityplan ? this.setState({selectedSecurityplan: undefined}) : this.props.navigation.goBack();
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
  },
  listItem: {
    marginVertical: scale(10),
    marginRight: scale(110),
    backgroundColor: colors.grey,
    height: scale(80),
    borderTopRightRadius: scale(80),
    borderBottomRightRadius: scale(80),
    flexDirection: 'row'
  },
  listItemTitleText: {
    marginTop: 0.5 * scale(TextSize.verySmall),
    marginLeft: 2 * scale(TextSize.verySmall),
    fontFamily: AppFonts.medium,
    fontSize: scale(TextSize.small),
    color: colors.white,
    maxWidth: scale(150)
  },
  listItemSubtitleText: {
    marginTop: 0.2 * scale(TextSize.verySmall),
    marginLeft: 2 * scale(TextSize.verySmall),
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall),
    color: colors.black,
    maxWidth: scale(150)
  },
  icon: {
    flex: 1,
    height: '100%'
  },
  listItemContent: {
    flex: 3
  },
  listItemContentIcon: {
    flex: 1,
    margin: 10
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
