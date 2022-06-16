import React, {Component} from 'react';
import {PanResponder, StyleSheet, Text, View, Animated, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import {StackNavigationProp} from '@react-navigation/stack';
import PrismSession, {
  Position,
  PRISM_BLACK,
  PRISM_BLACK_RADIUS_RATIO,
  PRISM_YELLOW,
  PRISM_YELLOW_RADIUS_RATIO,
  PrismInitializer,
  YELLOW_DISC_MARGIN_RATIO
} from '../model/PrismSession';
import {Resource} from '@i4mi/fhir_r4';
import UserProfile from '../model/UserProfile';
import {connect} from 'react-redux';
import {AppStore} from '../store/reducers';
import LocalesHelper from '../locales';
import * as midataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import MidataService from '../model/MidataService';
import {
  activeOpacity,
  AppFonts,
  colors,
  scale,
  TextSize,
  verticalScale
} from '../styles/App.style';
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

interface State {
  isValid: boolean;
  width: number;
  height: number;
}

/**
 * Y Position above which the draggable circle gets put back
 * into the default position, if it's dragged back to the left.
 */
const BUTTON_BOUNCEBACK_Y = scale(150);

/**
 * Initial position for the draggable circle
 */
const INITIAL_X = verticalScale(-70);
const INITIAL_Y = scale(110);

class AssessmentBoard extends Component<PropsType, State> {
  pan = new Animated.ValueXY({x: INITIAL_X, y: INITIAL_Y});
  touchableCircleSize: Animated.Value;
  prismBoard: any;

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      this.pan.setOffset({
        x: this.pan.x._value,
        y: this.pan.y._value
      });
    },
    onPanResponderMove: (evt, gestureState) => {
      let newdx = gestureState.dx,
        newdy = gestureState.dy;
      Animated.event(
        [
          null,
          {
            dx: this.pan.x,
            dy: this.pan.y
          }
        ],
        {useNativeDriver: false}
      )(evt, {dx: newdx, dy: newdy});
    },
    onPanResponderRelease: () => {
      this.pan.flattenOffset();
      let newx = this.pan.x._value;
      let newy = this.pan.y._value;
      if (this.pan.y._value < this.state.width * PRISM_BLACK_RADIUS_RATIO) {
        newy = this.state.width * PRISM_BLACK_RADIUS_RATIO;
      }
      if (this.pan.y._value > this.state.height - this.state.width * PRISM_BLACK_RADIUS_RATIO) {
        newy = this.state.height - this.state.width * PRISM_BLACK_RADIUS_RATIO;
      }
      if (this.pan.x._value < this.state.width * PRISM_BLACK_RADIUS_RATIO) {
        newx = this.state.width * PRISM_BLACK_RADIUS_RATIO;
      }
      if (this.pan.x._value > this.state.width - this.state.width * PRISM_BLACK_RADIUS_RATIO) {
        newx = this.state.width - this.state.width * PRISM_BLACK_RADIUS_RATIO;
      }
      if (this.pan.x._value < -this.state.width * PRISM_BLACK_RADIUS_RATIO && this.pan.y._value < BUTTON_BOUNCEBACK_Y) {
        newx = INITIAL_X;
        newy = INITIAL_Y;
      }
      if (newx < 0) {
        this.setState({isValid: false});
      } else {
        this.setState({isValid: true});
      }
      Animated.spring(
        this.pan, // Auto-multiplexed
        {useNativeDriver: false, toValue: {x: newx, y: newy}, bounciness: 1} // Back to zero
      ).start();
    }
  });

  onLayout(event) {
    const {x, y, height, width} = event.nativeEvent.layout;
    if (this?.state) {
      let newstate = this.state;
      newstate.width = width;
      newstate.height = height;
      this.setState(newstate);
    }
  }

  constructor(props: PropsType) {
    super(props);
    this.touchableCircleSize = new Animated.Value(80);
    this.prismBoard = React.createRef();
    this.state = {isValid: false, width: 500, height: 200};
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      Orientation.lockToLandscape();
    });
    this.props.navigation.addListener('blur', () => {
      Orientation.lockToPortrait();
    });
  }

  render() {
    const draggableCircle = {
      height: this.state.width * PRISM_BLACK_RADIUS_RATIO * 2,
      width: this.state.width * PRISM_BLACK_RADIUS_RATIO * 2,
      backgroundColor: PRISM_BLACK,
      borderRadius: 300,
      position: 'absolute',
      transform: [
        {translateX: -this.state.width * PRISM_BLACK_RADIUS_RATIO},
        {translateY: -this.state.width * PRISM_BLACK_RADIUS_RATIO},
      ]
    };
    const targetCircle = {
      height: this.state.width * PRISM_YELLOW_RADIUS_RATIO * 2,
      width: this.state.width * PRISM_YELLOW_RADIUS_RATIO * 2,
      backgroundColor: PRISM_YELLOW,
      borderRadius: 500,
      position: 'absolute',
      bottom: this.state.width * YELLOW_DISC_MARGIN_RATIO,
      right: this.state.width * YELLOW_DISC_MARGIN_RATIO
    };

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_yellow.png')}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <SafeAreaView
            style={{flex: 1}}
            edges={['top']}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  flex: 2,
                  flexDirection: 'column',
                  alignSelf: 'flex-start'
                }}>
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
                <View style={{flex: 1}}>
                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={() => {
                      this.props.navigation.navigate('AssessmentImage');
                    }}
                    style={styles.button}>
                    <Text style={styles.buttonText}>{this.props.localesHelper.localeString('assessment.image')}</Text>
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
                    <Text style={styles.buttonText}>
                      {this.props.localesHelper.localeString('assessment.tutorial')}
                    </Text>
                  </TouchableOpacity>
                  <View style={[{opacity: this.state.isValid ? 1 : 0.5}]}>
                    <TouchableOpacity
                      onPress={() => {
                        //this.createPrismSession();
                        this.props.navigation.navigate('AssessmentQuestions', {prismData: this.createPrismSession()});
                      }}
                      activeOpacity={0.5}
                      disabled={!this.state.isValid}
                      style={[styles.button]}>
                      <Text style={[styles.buttonText]}>{this.props.localesHelper.localeString('common.save')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={{paddingTop: scale(10), flex: 6, paddingBottom: scale(10)}}>
                <View
                  onLayout={this.onLayout.bind(this)}
                  ref={this.prismBoard}
                  style={{
                    flex: 1,
                    aspectRatio: Math.sqrt(2) / 1,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                  }}>
                  <View style={targetCircle} />
                  <Animated.View
                    style={{
                      transform: [{translateX: this.pan.x}, {translateY: this.pan.y}]
                    }}
                    {...this.panResponder.panHandlers}>
                    <Animated.View style={[draggableCircle]} />
                  </Animated.View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  private createPrismSession(): PrismInitializer {
    return {
      blackDiscPosition: new Position(this.pan.x._value, this.pan.y._value),
      canvasWidth: this.state.width,
      questionnaire: this.props.midataService.getPrismQuestionnaire()
    };
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
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
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
