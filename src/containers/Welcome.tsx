import React, {Component} from 'react';
import {Text, Image, StyleSheet, View, ImageBackground} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AppFonts,
  TextSize,
  scale,
  verticalScale,
  windowHeight,
} from '../styles/App.style';
import SpeechBubble from '../resources/images/common/speechBubble.svg';
import Person from '../resources/images/common/person.svg';
import LogoFull from '../resources/images/common/logo_full.svg';
import AppButton from '../components/AppButton';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
}

interface State {}

class Welcome extends Component<PropsType, State> {
  onPress = () => {
    this.props.navigation.navigate('mainOnBoarding');
  };

  render() {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_orange.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <LogoFull width={scale(300)} height={'100%'}></LogoFull>
          </View>
          <View style={styles.bottomView}>
            <Image
              source={require('../resources/images/backgrounds/mood_bg_grey.png')}
              style={styles.grey}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                top: verticalScale(50),
                alignSelf: 'center',
              }}>
              <SpeechBubble
                width={scale(277.5)}
                height={verticalScale(147.5)}></SpeechBubble>
            </View>
            <View
              style={{
                position: 'absolute',
                top: verticalScale(90),
                alignSelf: 'center',
              }}>
              <Text style={styles.text}>
                {this.props.localesHelper.localeString(
                  'welcomePage.welcomeMessage',
                )}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                top: verticalScale(220),
                alignSelf: 'center',
                paddingLeft: scale(90),
              }}>
              <Person width={scale(80)} height={verticalScale(80)} />
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: windowHeight * 0.075,
              }}>
              <AppButton
                label={'Starten'}
                icon={
                  '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.cls-1,.cls-3,.cls-4{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3,.cls-4{stroke:#fff;stroke-width:2.5px;}.cls-3{stroke-linecap:round;stroke-linejoin:round;}</style><clipPath id="clip-path" transform="translate(-11.25 -11.25)"><circle class="cls-1" cx="37.5" cy="37.5" r="37.5"/></clipPath></defs><g class="cls-2"><polygon class="cls-3" points="21.25 11.75 21.25 40.03 40.39 25.89 21.25 11.75"/><circle class="cls-4" cx="26.25" cy="26.25" r="25"/></g></svg>'
                }
                position={'left'}
                style={{
                  backgroundColor: 'grey',
                  width: scale(275),
                  paddingVertical: verticalScale(10),
                }}
                onPress={() =>
                  this.props.navigation.navigate('mainOnBoarding')
                }></AppButton>
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  topView: {
    flex: 0.26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomView: {
    flex: 0.74,
    backgroundColor: 'white',
    alignContent: 'center',
  },
  grey: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  logo: {
    width: scale(290),
    height: '100%',
  },
  text: {
    fontFamily: AppFonts.medium,
    fontSize: scale(TextSize.veryBig),
    color: 'rgb(203, 95, 22)',
  },
});

// Link store data to component
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
  };
}

export default connect(mapStateToProps, undefined)(Welcome);
