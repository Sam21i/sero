import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {colors, verticalScale} from '../styles/App.style';
import AppButton from './AppButton';

interface ButtonContainerProps {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
}

class ButtonContainer extends Component<ButtonContainerProps> {
  constructor(props: ButtonContainerProps) {
    super(props);
  }
  render() {
    return (
      <View style={styles.view}>
        <View style={styles.innerView}>
          <AppButton
            label={this.props.localesHelper.localeString('securityplan.title')}
            icon={
              '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 118.67 147.33"><defs><style>.cls-1,.cls-3,.cls-4,.cls-5{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3,.cls-4,.cls-5{stroke:#fff;stroke-width:4px;}.cls-3,.cls-4{stroke-linejoin:round;}.cls-4{stroke-linecap:round;}</style><clipPath id="clip-path" transform="translate(-22.48 -1.72)"><circle class="cls-1" cx="74.65" cy="75.38" r="107.5"/></clipPath></defs><g class="cls-2"><path class="cls-3" d="M135.08,80.18,122.25,69.62a2.94,2.94,0,0,0-4-.21,464.18,464.18,0,0,0-32.89,46.26c-11.7,18.84-9.8,24.15-9.8,24.15-.91,1.8-2.44,5.46-.76,6.82s4.67-1,6.17-2.33c0,0,5.52.57,20.65-16.12A429.77,429.77,0,0,0,136.32,84,3.19,3.19,0,0,0,135.08,80.18Z" transform="translate(-22.48 -1.72)"/><path class="cls-4" d="M110.59,66.39a210.15,210.15,0,0,0-21.2,28.18" transform="translate(-22.48 -1.72)"/><path class="cls-5" d="M134.13,79.46,139,73A2.35,2.35,0,0,0,138,70l-7.31-5.89c-1.06-.86-2.38-1-3-.18L123,70.41m-37.57,45.4,16,12.53" transform="translate(-22.48 -1.72)"/><path class="cls-3" d="M109.53,24.26h6V60.15M65.67,129.34H24.48V24.26h6.14m24,82.22H79.78m-32.89,5.17h-10V101.24h10Zm7.75-30.9h34m-41.77,5h-10V75.4h10Zm7.89-31h47.7M47.11,60H36.91V49.6h10Zm22.8-47.41a4.24,4.24,0,0,0-4.31,4.16v.11a4.21,4.21,0,1,0,8.41.25v0A4.27,4.27,0,0,0,70,12.56Zm32.57,8.51a5.36,5.36,0,0,0-5.26-5.46H83.66a2.32,2.32,0,0,1-2.27-1.83A11.84,11.84,0,0,0,68,3.83l-.31,0a12,12,0,0,0-9.54,9.9,2.31,2.31,0,0,1-2.26,1.83H42.58a5.36,5.36,0,0,0-5.23,5.46V35.82h65.13Z" transform="translate(-22.48 -1.72)"/></g></svg>'
            }
            position="right"
            color={colors.primary}
            onPress={() => this.props.navigation.navigate('Securityplan')}
          />
          <AppButton
            style={{backgroundColor: colors.gold}}
            label={this.props.localesHelper.localeString('prismS.title')}
            icon={
              '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 146.7 146.7"><defs><style>.cls-1,.cls-6,.cls-7{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{clip-path:url(#clip-path-2);}.cls-4{opacity:1;}.cls-5{clip-path:url(#clip-path-3);}.cls-6,.cls-7{stroke:#fff;stroke-linejoin:round;}.cls-6{stroke-width:3.5px;}.cls-7{stroke-width:4px;}</style><clipPath id="clip-path" transform="translate(-1.65 -1.65)"><rect class="cls-1" x="-32.02" y="-32.02" width="214.05" height="214.05"/></clipPath><clipPath id="clip-path-2" transform="translate(-1.65 -1.65)"><circle class="cls-1" cx="75" cy="75" r="107.02"/></clipPath><clipPath id="clip-path-3" transform="translate(-1.65 -1.65)"><rect class="cls-1" x="-23.46" y="-17.75" width="196.92" height="168.38"/></clipPath></defs><g class="cls-2"><g class="cls-3"><g class="cls-4"><g class="cls-5"><path class="cls-6" d="M112,113.83V99.18c0-14.11-10.59-22.07-24.53-24.9L75,85.68,62.54,74.31C48.6,77.19,38,85.16,38,99.18v14.65M75,24.74a20.57,20.57,0,1,0,20.54,20.6v0A20.57,20.57,0,0,0,75,24.74ZM56.25,113.83V102.67m37.07,11.16V102.67" transform="translate(-1.65 -1.65)"/><path class="cls-7" d="M112,113.83V99.18c0-14.11-10.59-22.07-24.53-24.9L75,85.68,62.54,74.31C48.6,77.19,38,85.16,38,99.18v14.65M75,24.74a20.57,20.57,0,1,0,20.54,20.6v0A20.57,20.57,0,0,0,75,24.74ZM56.25,113.83V102.67m37.07,11.16V102.67" transform="translate(-1.65 -1.65)"/><circle class="cls-7" cx="73.35" cy="73.35" r="71.35"/></g></g></g></g></svg>'
            }
            position="right"
            color={colors.gold}
            onPress={() => this.props.navigation.navigate('Securityplan')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1.58,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  innerView: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginBottom: verticalScale(60),
  },
});

// Link store data to component:
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
  };
}

export default connect(mapStateToProps, undefined)(ButtonContainer);
