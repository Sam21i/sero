import React, {Component} from 'react';
import {Text, Image, StyleSheet, View, ImageBackground} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  AppFonts,
  TextSize,
  scale,
  verticalScale,
  colors,
} from '../styles/App.style';
import AppButton from '../components/AppButton';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import LogoFull from '../resources/images/common/logo_full.svg';
import SpeechBubble from '../components/SpeechBubble';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
}

class Welcome extends Component<PropsType> {
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
                bottom: verticalScale(50),
              }}>
              <AppButton
                label={this.props.localesHelper.localeString('welcome.start')}
                icon={
                  '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.cls-1,.cls-3,.cls-4{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3,.cls-4{stroke:#fff;stroke-width:2.5px;}.cls-3{stroke-linecap:round;stroke-linejoin:round;}</style><clipPath id="clip-path" transform="translate(-11.25 -11.25)"><circle class="cls-1" cx="37.5" cy="37.5" r="37.5"/></clipPath></defs><g class="cls-2"><polygon class="cls-3" points="21.25 11.75 21.25 40.03 40.39 25.89 21.25 11.75"/><circle class="cls-4" cx="26.25" cy="26.25" r="25"/></g></svg>'
                }
                position={'left'}
                color={colors.grey}
                style={{
                  width: scale(300),
                  paddingVertical: 10,
                  height: 70,
                }}
                onPress={() =>
                  this.props.navigation.navigate('mainOnBoarding')
                }></AppButton>
            </View>

          <SpeechBubble
            bubbleContent={
              <View style={styles.content}>
                <Text style={styles.title}>{this.props.localesHelper.localeString('welcome.title')}</Text>
                <Text style={styles.text}>{this.props.localesHelper.localeString('welcome.greetingText')}</Text>
              </View>
            }
            stylingOptions={{
              general: {
                position:{
                  top: verticalScale(50),
                },
                width: scale(337.5),
              },
              arrow:{
                position: {
                  left: scale(150),
                  bottom: 0
                },
                size: scale(30)
              },
              icon:{
                position:{
                  left: scale(200)
                }
              }

            }}
            localesHelper={this.props.localesHelper}
            ></SpeechBubble>
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
  content: {
    padding: scale(20),
  },
  title: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.big),
    color: colors.primary,
  },
  text: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.big),
    color: colors.primary,
  },
});

// Link store data to component
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
  };
}

export default connect(mapStateToProps, undefined)(Welcome);

