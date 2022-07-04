import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AssessmentEndOptionsSpeechBubble, {
  ASSESSMENT_END_SPEECH_BUBBLE_MODE
} from '../components/AssessmentEndOptionsSpeechBubble';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
}

interface State {
  bubbleVisible: boolean;
  mode: ASSESSMENT_END_SPEECH_BUBBLE_MODE;
}

class AssessmentEndOptions extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: true,
      mode: ASSESSMENT_END_SPEECH_BUBBLE_MODE.menu
    };
  }

  async onBubbleClose(mode: ASSESSMENT_END_SPEECH_BUBBLE_MODE): Promise<void> {
    switch (mode) {
      case ASSESSMENT_END_SPEECH_BUBBLE_MODE.securityplan:
        this.props.navigation.navigate('SecurityplanStackScreen', {screen: 'SecurityplanCurrent'});
        break;
      case ASSESSMENT_END_SPEECH_BUBBLE_MODE.mainPage:
        this.props.navigation.navigate('MainStackScreen');
        break;
      case ASSESSMENT_END_SPEECH_BUBBLE_MODE.emergencyContact:
        this.props.navigation.navigate('AssessmentContacts');
        break;
      default:
        this.setState({
          bubbleVisible: false
        });
    }
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodYellow}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('assessment.addEntry')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            {this.state.bubbleVisible && (
              <AssessmentEndOptionsSpeechBubble
                localesHelper={this.props.localesHelper}
                navigation={this.props.navigation}
                onClose={this.onBubbleClose.bind(this)}
              />
            )}
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
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(40)
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.normal)
  },
  emergencyButton: {
    position: 'absolute',
    right: -0.2,
    top: verticalScale(45)
  },
  topView: {
    backgroundColor: colors.gold50opac,
    flex: 1,
    flexDirection: 'row'
  },
  bottomView: {
    flex: 7,
    backgroundColor: colors.white65opac
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps, undefined)(AssessmentEndOptions);
