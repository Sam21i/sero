import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  scale,
  windowWidth,
  TextSize,
} from '../styles/App.style';
import EmergencyContactTile from './EmergencyContactTile';
import PlusButton from './PlusButton';
import EmergencyContact from '../model/EmergencyContact';

interface EmergencyContactContainerProps {
    emergencyContacts: EmergencyContact[];
}

export default class EmergencyContactContainer extends Component<EmergencyContactContainerProps> {
  flatListRef: any;

  constructor(props: EmergencyContactContainerProps) {
      super(props);
      console.log('contact container constructor', this.props.emergencyContacts)
  }

  _renderEmergencyContacts({item}) {
      console.log('render item', item)
    return (
      <EmergencyContactTile
        contact={item}
        size={scale(windowWidth * 0.2)}></EmergencyContactTile>
    );
  };

  _renderItemSeparator() {
    return <View style={{width: scale(10)}}></View>;
  };

  _renderListFooterComponent() {
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
            data={this.props.emergencyContacts}
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
