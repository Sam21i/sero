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

export const scale = size => (windowWidth / guidelineBaseWidth) * size;
export const verticalScale = size =>
  (windowHeight / guidelineBaseHeight) * size;
export const moderateScale = (size, factor = 0.5) =>
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
  big: 24,
  veryBig: 30,
};

// Colors
export const colors = {
  black: '#1a1917',
  white: '#FFFFFF',
  lightGray: '#d6d6d6',
  mediumGray: '#888888',
  darkGray: '#666666',
  separatorGray: 'rgb(200,200,200)',
  onBoardingText: 'rgb(73,73,73)',

  pageBackground: '#FFFFFF',
  primaryNormal: '#96c3dc',
  primaryLight: '#dfedf7',
  secondaryNormal: 'rgb(50,150,190)',
  primaryActive: '#ffaa00',
  fourthNormal: '#3c5a96',
  onBoardingBackground: 'rgba(150, 195, 220, 0.2)',
  onBoardingInputBackground: '#daeaf3',
  homeButtonColor: 'rgb(60,90,150)',
  supportButton: 'rgb(185,50,100)',

  success: '#00aae6',
  warning: '#785a96',
  alert: '#b93264',
};

// Layout
export const appLayout = {
  categoryButtonHeight: scale(40),
  categoryIconSize: scale(50),
  containerMargin: scale(50),
  containerSlimMargin: scale(20),
  detailsArrowIconSize: scale(25),
  listShift: scale(10),
  listSpacing: scale(5),
};

// Styles
export const appStyles = StyleSheet.create({
  homeContainer: {
    height: '100%',
    backgroundColor: colors.pageBackground,
    paddingTop: scale(20),
    paddingBottom: scale(20),
    paddingHorizontal: scale(50),
  },
  centeredContainer: {
    height: '100%',
    backgroundColor: colors.pageBackground,
    paddingTop: scale(50),
    paddingBottom: scale(20),
    paddingHorizontal: scale(50),
  },
  asymetricContainer: {
    height: '100%',
    backgroundColor: colors.pageBackground,
    paddingTop: scale(50),
    paddingBottom: scale(20),
    paddingLeft: scale(50),
    paddingRight: 0,
  },
  categoryIconBackground: {
    width: appLayout.categoryIconSize,
    height: appLayout.categoryIconSize,
    justifyContent: 'center',
    // backgroundColor and borderRadius are necessary for the rendering of the information
    // or servica category in a colored circle
    backgroundColor: colors.secondaryNormal,
    borderRadius: appLayout.categoryIconSize / 2,
  },
  textQuestion: {
    fontFamily: AppFonts.light,
    fontSize: TextSize.verySmall,
  },
});
