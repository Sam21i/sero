import {StyleSheet, Dimensions} from 'react-native';

// Screen size
//   iPhone 5: w320/h568/r1.78
//   iPhone 6-7-8: w375/h667/r1.78
//   iPhone 11: w414/h896/r2.16 incl. safe area, w414/h844/r2.04 excl. safe area
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

// Scaling method used by Soluto Engineering (see method 3)
//   https://medium.com/soluto-engineering/size-matters-5aeeb462900a
//   https://stackoverflow.com/questions/33628677/react-native-responsive-font-size
//
// approches guideline sizes are based on iPhone 6, 7, 8 screen size (375 x 667 points, 750 x 1334 pixels)
//   https://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

export const scale = (size: number) => (windowWidth / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (windowHeight / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;
export const isSmallScreen = () => Dimensions.get('window').height < 570;

// Fonts
export const AppFonts = {
  bold: 'Roboto-Bold',
  medium: 'Roboto-Medium',
  regular: 'Roboto-Regular',
  condensedBold: 'RobotoCondensed-Bold',
  condensedRegular: 'RobotoCondensed-Regular',
};

// Text sizes
export const TextSize = {
  verySmall: 15,
  small: 18,
  normal: 20,
  normalPlus: 22,
  big: 24,
  veryBig: 30,
};

// Colors
export const colors = {
  black: 'rgb(26, 25, 23)',
  white: 'rgb(255, 255, 255)',
  lightGrey: 'rgb(235,235,235)',
  veryLightGrey: 'rgb(200,200,200)',
  grey: 'rgb(128,128,128)',

  success: 'rgb(0, 170, 230)',
  warning: 'rgb(120, 90, 150)',
  alert: 'rgb(185, 50, 100)',

  primary: 'rgb(201, 95, 30)',
  petrol: 'rgb(10, 95, 108)',
  gold: 'rgb(205, 177, 65)',
  linen: 'rgb(250, 239, 231)'
};

// Layout
export const appLayout = {};

// Styles
export const appStyles = StyleSheet.create({});
