import React, {Component} from 'react';
import {Text, StyleSheet, ImageBackground, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import EmergencyContactIcon from '../resources/images/icons/icon_emergencyContact.svg';
import { AppFonts, colors, scale, TextSize, verticalScale } from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
}

interface State {

}

class Contacts extends Component<PropsType, State> {
  slider: any;

  constructor(props: PropsType) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topView}>

              <View style={styles.topTextView}>
                <Text>{ this.props.localesHelper.localeString('contacts.title') }</Text>
              </View>
              <View style={[styles.iconView, styles.button]}>
                  <EmergencyContactIcon width='100%' height='100%'/>
              </View>

          </View>
          <View style={styles.bottomView}>
            <Text> bla </Text>
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
  topTextView: {
    flex: 1,
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',
  },
  topText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white,
  },
  iconView: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'flex-end',
    width: scale(90),
    height: verticalScale(75),
    paddingVertical: verticalScale(15),
    paddingLeft: scale(10),
    paddingRight: scale(20),
    backgroundColor: colors.petrol,
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 100,
  },
  bottomTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white,
  },
  topView: {
    backgroundColor: 'rgba(203, 95, 11, 0.5)',
    flex: 1,
    flexDirection: 'row',
  },
  bottomView: {
    flex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
});

// Link store data to component :
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
