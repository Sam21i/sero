import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StackNavigationProp} from '@react-navigation/stack';
import {Resource} from '@i4mi/fhir_r4';
import PrismSession, { Position, PrismInitializer } from '../model/PrismSession';
import UserProfile from '../model/UserProfile';
import {connect} from 'react-redux';
import {AppStore} from '../store/reducers';
import LocalesHelper from '../locales';
import * as midataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import MidataService from '../model/MidataService';
import {activeOpacity, AppFonts, colors, scale, TextSize, windowHeight, windowWidth} from '../styles/App.style';
import {SvgCss} from 'react-native-svg';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface PropsType {
  navigation: StackNavigationProp<any>;
  midataService: MidataService;
  userProfile: UserProfile;
  localesHelper: LocalesHelper;
  addResource: (r: Resource) => void;
  addPrismSession: (s: PrismSession) => void;
}

interface State {}

class AssessmentBoard extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      Orientation.lockToLandscape();
    });
    this.props.navigation.addListener('blur', () => {
      Orientation.lockToPortrait();
    });
  }

  _renderActionButton(item) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={() => {
          this.props.navigation.navigate(item.navigateTo);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white', flexDirection: 'row'}}>
        <View style={{flex: 5, backgroundColor: colors.gold50opac, flexDirection: 'column'}}>
          <View style={{flex: 1}}>
            <View style={{padding: scale(20)}}>
              <SvgCss
                onPress={() => {
                  this.props.navigation.navigate('AssessmentStackScreen', {screen: 'AssessmentMain'});
                }}
                xml={
                  '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 37.5 37.5"> <defs> <style>.cls-1,.cls-3{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{stroke:#888375;stroke-width:2.5px;}.cls-4{clip-path:url(#clip-path-2);}</style> <clipPath id="clip-path" transform="translate(0 0)"> <path class="cls-1" d="M1.25,18.75a17.5,17.5,0,1,0,17.5-17.5,17.51,17.51,0,0,0-17.5,17.5" /> </clipPath> <clipPath id="clip-path-2" transform="translate(0 0)"> <rect class="cls-1" width="37.5" height="37.5" /> </clipPath> </defs> <g class="cls-2"> <line class="cls-3" x1="11.25" y1="11.25" x2="26.25" y2="26.25" /> <line class="cls-3" x1="26.25" y1="11.25" x2="11.25" y2="26.25" /> </g> <g class="cls-4"> <circle class="cls-3" cx="18.75" cy="18.75" r="17.5" /> </g> </svg>'
                }
                width={scale(40)}
                height={scale(40)}
              />
            </View>
          </View>
          <View style={{flex: 1, backgroundColor: colors.gold50opac}}>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => {
                this.props.navigation.navigate('AssessmentImage');
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>{'Foto'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => {
                this.props.navigation.navigate('AssessmentStackScreen', {
                  screen: 'AssessmentIntroStackScreen',
                  params: {screen: 'AssessmentIntroTutorial'}
                });
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>{'Anleitung'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => {
                this.props.navigation.navigate(
                  'AssessmentQuestions',
                  { prismData: {
                      blackDiscPosition: new Position(400,100),
                      canvasWidth: 800,
                      questionnaire: this.props.midataService.getPrismQuestionnaire(),
                    } as PrismInitializer
                  }
                );
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>{'Speichern'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{aspectRatio: Math.sqrt(2) / 1, maxHeight: windowWidth, backgroundColor: 'white'}}></View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 125,
    height: 30,
    backgroundColor: colors.grey,
    borderBottomRightRadius: scale(20),
    borderTopRightRadius: scale(20),
    marginVertical: scale(10),
    paddingVertical: scale(TextSize.verySmall / 2.5)
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'bottom',
    fontSize: TextSize.verySmall,
    fontFamily: AppFonts.medium,
    color: colors.white
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
    addResource: (r: Resource) => midataServiceActions.addResource(dispatch, r),
    addPrismSession: (s: PrismSession) => userProfileActions.addNewPrismSession(dispatch, s)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentBoard);
