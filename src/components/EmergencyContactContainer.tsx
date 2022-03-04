import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {
  appStyles,
  scale,
  windowHeight,
  windowWidth,
  AppFonts,
  TextSize,
} from '../styles/App.style';
import AppButton from './AppButton';
import {EMERGENCY_CONTACTS} from '../resources/static/emergencyContacts';
import EmergencyContact from '././EmergencyContact';
import PlusButton from './PlusButton';

interface EmergencyContactContainerProps {}

export default class EmergencyContactContainer extends Component<EmergencyContactContainerProps> {
  flatListRef: any;

  _renderEmergencyContacts = ({item}) => {
    return (
      <EmergencyContact
        imageSource={item.image}
        text={item.text}
        size={scale(windowWidth * 0.2)}></EmergencyContact>
    );
  };

  _renderItemSeparator = () => {
    return <View style={{width: scale(10)}}></View>;
  };

  _renderListFooterComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          width: scale(windowWidth * 0.2),
          alignContent: 'center',
          alignItems: 'center',
          paddingTop: scale(10),
        }}>
        <PlusButton />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <View style={styles.top}>
          <Text style={styles.title}>Meine Angehörigen anrufen</Text>
        </View>
        <View style={styles.bottom}>
          <View style={{marginHorizontal: scale(windowWidth * 0.015)}}></View>
          <FlatList
            ref={ref => {
              this.flatListRef = ref;
            }}
            showsVerticalScrollIndicator={false}
            horizontal
            data={EMERGENCY_CONTACTS}
            renderItem={this._renderEmergencyContacts}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this._renderItemSeparator}
            ListFooterComponent={this._renderListFooterComponent}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 2.71,
    flexDirection: 'column',
    backgroundColor: '#rgba(255, 0, 0, 0.2)',
  },
  top: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  bottom: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: scale(TextSize.small),
    color: 'white',
  },
});
