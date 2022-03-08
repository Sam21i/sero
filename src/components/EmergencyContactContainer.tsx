import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {scale, TextSize, colors, AppFonts} from '../styles/App.style';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import PlusButton from '../resources/images/btn_plus.svg';
import EmergencyContact from '../model/EmergencyContact';
import EmergencyContactTile from './EmergencyContactTile';

interface EmergencyContactContainerProps {
  localesHelper: LocalesHelper;
  onPressPlusButton?: () => void;
  emergencyContacts: EmergencyContact[];
}

class EmergencyContactContainer extends Component<EmergencyContactContainerProps> {
  flatListRef: any;
  avatarSize: number = scale(75);

  constructor(props: EmergencyContactContainerProps) {
      super(props);
  }

  _renderEmergencyContacts({item}) {
    return (
      <EmergencyContactTile contact={item}
                            size={this.avatarSize}>
      </EmergencyContactTile>
    );
  };

  _renderItemSeparator() {
    return <View style={styles.itemSeparator}></View>;
  };

  _renderListFooterComponent() {
    return (
      <View
        style={[
          styles.listFooterComponent,
          {width: this.avatarSize, height: this.avatarSize},
        ]}>
        <TouchableWithoutFeedback onPress={this.props.onPressPlusButton}>
          <PlusButton width={scale(30)} height={scale(30)} />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>
            {this.props.localesHelper.localeString('main.myEnvironmentTitle')}
          </Text>
        </View>
        <View style={styles.emergencyContactsView}>
          <FlatList
            ref={ref => {
              this.flatListRef = ref;
            }}
            showsVerticalScrollIndicator={false}
            horizontal
            data={this.props.emergencyContacts}
            renderItem={this._renderEmergencyContacts.bind(this)}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={this._renderItemSeparator.bind(this)}
            ListFooterComponent={this._renderListFooterComponent.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 2.71,
    flexDirection: 'column',
    backgroundColor: '#rgba(203, 95, 11, 0.25)',
  },
  titleView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  emergencyContactsView: {
    flex: 2.5,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white,
  },
  itemSeparator: {
    width: scale(10),
  },
  listFooterComponent: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

// Link store data to component:
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
  };
}

export default connect(mapStateToProps, undefined)(EmergencyContactContainer);
