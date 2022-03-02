import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {windowHeight, windowWidth} from '../styles/App.style';
import AppButton from './AppButton';

interface ButtonContainerProps {
  navigation: StackNavigationProp<any>;
}

export default class ButtonContainer extends Component<ButtonContainerProps> {
  constructor(props: ButtonContainerProps) {
    super(props);
  }
  render() {
    return (
      <View style={styles.view}>
        <View style={styles.innerView}>
          <AppButton
            label={'Mein \nSicherheitsplan'}
            icon={
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2,.cls-3,.cls-4{fill:none;stroke:#fff;stroke-width:1.8px;}.cls-2,.cls-3{stroke-linejoin:round;}.cls-3{stroke-linecap:round;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M47.07,33.84,43.56,30.9a.79.79,0,0,0-1.08-.06,129.41,129.41,0,0,0-9,12.89c-3.2,5.25-2.68,6.73-2.68,6.73-.25.5-.67,1.52-.21,1.9s1.28-.28,1.69-.65c0,0,1.51.16,5.65-4.49a119.78,119.78,0,0,0,9.48-12.31A.9.9,0,0,0,47.07,33.84Z"/><path class="cls-3" d="M40.37,30a58.28,58.28,0,0,0-5.8,7.85"/><path class="cls-4" d="M33.49,43.77l4.39,3.49m8.93-13.62,1.32-1.81a.66.66,0,0,0-.25-.82l-2-1.64c-.29-.24-.65-.27-.81-.05l-1.3,1.8"/><path class="cls-2" d="M38.15,17.37a1.48,1.48,0,0,0-1.44-1.52H33a.64.64,0,0,1-.62-.51,3.25,3.25,0,0,0-3.75-2.76,3.32,3.32,0,0,0-2.61,2.76.64.64,0,0,1-.62.51H21.76a1.48,1.48,0,0,0-1.43,1.52v4.11H38.15ZM29.24,15a1.17,1.17,0,0,0-1.18,1.19,1.19,1.19,0,0,0,1.12,1.25,1.18,1.18,0,0,0,1.18-1.19v0A1.18,1.18,0,0,0,29.24,15ZM23,28.21H20.21V25.32h2.73Zm2.1-1.45H38.15M22.94,35.4H20.21V32.51h2.73ZM25.06,34h9.31M22.94,42.61H20.21v-2.9h2.73Zm2.12-1.44h6.88m-3.86,6.37H16.81V18.26h1.68m21.59,0h1.65v10"/></g></g></svg>'
            }
            position="right"
            onPress={() =>
              this.props.navigation.navigate('Securityplan')
            }></AppButton>
          <AppButton
            style={{backgroundColor: '#CDB141'}}
            label={'Meine \nEinschätzungen'}
            icon={
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 65 65"><defs><style>.cls-1{fill:none;}.cls-2,.cls-3,.cls-4{fill:none;stroke:#fff;stroke-width:1.8px;}.cls-2,.cls-3{stroke-linejoin:round;}.cls-3{stroke-linecap:round;}</style></defs><g id="Ebene_2" data-name="Ebene 2"><g id="Ebene_1-2" data-name="Ebene 1"><path class="cls-1" d="M32.5,65A32.5,32.5,0,1,0,0,32.5,32.5,32.5,0,0,0,32.5,65"/><path class="cls-2" d="M47.07,33.84,43.56,30.9a.79.79,0,0,0-1.08-.06,129.41,129.41,0,0,0-9,12.89c-3.2,5.25-2.68,6.73-2.68,6.73-.25.5-.67,1.52-.21,1.9s1.28-.28,1.69-.65c0,0,1.51.16,5.65-4.49a119.78,119.78,0,0,0,9.48-12.31A.9.9,0,0,0,47.07,33.84Z"/><path class="cls-3" d="M40.37,30a58.28,58.28,0,0,0-5.8,7.85"/><path class="cls-4" d="M33.49,43.77l4.39,3.49m8.93-13.62,1.32-1.81a.66.66,0,0,0-.25-.82l-2-1.64c-.29-.24-.65-.27-.81-.05l-1.3,1.8"/><path class="cls-2" d="M38.15,17.37a1.48,1.48,0,0,0-1.44-1.52H33a.64.64,0,0,1-.62-.51,3.25,3.25,0,0,0-3.75-2.76,3.32,3.32,0,0,0-2.61,2.76.64.64,0,0,1-.62.51H21.76a1.48,1.48,0,0,0-1.43,1.52v4.11H38.15ZM29.24,15a1.17,1.17,0,0,0-1.18,1.19,1.19,1.19,0,0,0,1.12,1.25,1.18,1.18,0,0,0,1.18-1.19v0A1.18,1.18,0,0,0,29.24,15ZM23,28.21H20.21V25.32h2.73Zm2.1-1.45H38.15M22.94,35.4H20.21V32.51h2.73ZM25.06,34h9.31M22.94,42.61H20.21v-2.9h2.73Zm2.12-1.44h6.88m-3.86,6.37H16.81V18.26h1.68m21.59,0h1.65v10"/></g></g></svg>'
            }
            position="right"
            onPress={() =>
              this.props.navigation.navigate('Securityplan')
            }></AppButton>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1.58,
  },
  innerView: {
    flex: 1,
    marginBottom: windowHeight * 0.125,
    justifyContent: 'space-evenly',
  },
});
