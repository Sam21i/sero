import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import SpeechBubble from '../components/SpeechBubble';
import LocalesHelper from '../locales';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
}

class Welcome extends Component<PropsType> {
  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodOrange}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <SvgCss
              xml={images.imagesSVG.common.logoLups}
              width={scale(300)}
              height={'100%'}
            />
          </View>
          <View style={styles.bottomView}>
            <Image
              source={images.imagesPNG.backgrounds.moodGrey}
              style={styles.grey}
              resizeMode='cover'
            />
            <View
              style={{
                position: 'absolute',
                bottom: verticalScale(50)
              }}>
              <AppButton
                label={this.props.localesHelper.localeString('common.start')}
                icon={images.imagesSVG.common.start}
                position={'left'}
                color={colors.grey}
                onPress={() => this.props.navigation.navigate('Onboarding')}
                isLargeButton
              />
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
                  position: {
                    top: verticalScale(50),
                    left: scale(0)
                  },
                  width: scale(337.5)
                },
                arrow: {
                  position: {
                    left: scale(150),
                    bottom: verticalScale(0)
                  },
                  size: scale(30)
                },
                icon: {
                  position: {
                    top: verticalScale(0),
                    left: scale(200)
                  }
                }
              }}></SpeechBubble>
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
    flex: 0.26,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomView: {
    flex: 0.74,
    backgroundColor: 'white',
    alignContent: 'center'
  },
  grey: {
    width: '100%',
    height: '100%',
    opacity: 0.5
  },
  logo: {
    width: scale(290),
    height: '100%'
  },
  content: {
    padding: scale(20)
  },
  title: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.big),
    color: colors.primary
  },
  text: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.big),
    color: colors.primary
  }
});

// Link store data to component
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps, undefined)(Welcome);
