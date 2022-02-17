import React, {Component} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  Pressable,
  Button,
  View,
  Touchable,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {windowHeight, windowWidth} from '../styles/App.style';
import Svg, {Path, SvgCss} from 'react-native-svg';
import {getItem} from 'react-native-sensitive-info';

interface PropsType {
  navigation: StackNavigationProp<any>;
}

interface State {}

const content = {
  key: 1,
  title: 'Willkommen in der SERO-App',
  image: require('../resources/images/icons/onBoarding/undraw.png'),
  logo: require('../resources/images/seroLogo.png'),
};

function WavyHeader({
  customStyles,
  customHeight,
  customTop,
  customBgColor,
  customWavePattern,
}) {
  return (
    <View style={customStyles}>
      <View style={{backgroundColor: customBgColor, height: customHeight}}>
        <Svg
          height="60%"
          width="100%"
          viewBox="0 0 1440 320"
          style={{position: 'absolute', top: customTop}}>
          <Path fill={customBgColor} d={customWavePattern} />
        </Svg>
      </View>
    </View>
  );
}

export default class Welcome extends Component<PropsType, State> {
  onPress = () => {
    this.props.navigation.navigate('mainOnBoarding');
  };

  render() {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/background.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topPart}>
            <WavyHeader
              customStyles={styles.svgCurve}
              customHeight={windowHeight * 0.7}
              customTop={windowHeight * 0.51}
              customBgColor="#fff"
              customWavePattern="M0,256L120,250.7C240,245,480,235,720,213.3C960,192,1200,160,1320,144L1440,128L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
            />
            <Text style={styles.title}>{content.title}</Text>
            <Image source={content.image} style={styles.image} />
            <TouchableWithoutFeedback onPress={this.onPress}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Starten</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.bottomPart}>
            <Image source={content.logo} style={styles.logo} />
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
  layerOne: {
    flex: 1,
    alignItems: 'center',
  },
  topPart: {
    flex: 8,
    alignItems: 'center',
    alignContent: 'center',
  },
  bottomPart: {
    flex: 2,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: windowHeight * 0.025,
  },
  svgCurve: {
    position: 'absolute',
    width: windowWidth,
  },
  title: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'normal',
    paddingHorizontal: windowWidth * 0.2,
    marginTop: windowHeight * 0.1,
  },
  image: {
    height: windowHeight * 0.3,
    width: windowWidth * 0.8,
    resizeMode: 'contain',
    marginBottom: windowHeight * 0.05,
    marginTop: windowHeight * 0.05,
  },
  logo: {
    width: windowWidth * 0.7,
    resizeMode: 'contain',
    marginBottom: windowHeight * 0.05,
    marginTop: windowHeight * 0.05,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: '#005561',
    width: windowWidth * 0.5,
    marginHorizontal: windowWidth * 0.2,
    marginTop: windowHeight * 0.025,
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
