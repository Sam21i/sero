import {background} from 'native-base/lib/typescript/theme/styled-system';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {FlatList, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {unstable_enableLogBox} from 'react-native-windows';

import EmergencyContact from '../model/EmergencyContact';
import images from '../resources/images/images';
import {activeOpacity, AppFonts, colors, paddings, scale, TextSize} from '../styles/App.style';
import EmergencyContactTile from './EmergencyContactTile';

interface EmergencyContactContainerProps extends WithTranslation {
  onPressOptionsButton?: () => void;
  emergencyContacts: EmergencyContact[];
}

class EmergencyContactContainer extends Component<EmergencyContactContainerProps> {
  flatListRef: any;
  avatarSize: number = scale(75);

  constructor(props: EmergencyContactContainerProps) {
    super(props);
  }

  callNumber(_number: string): void {
    Linking.openURL('tel:' + _number.replace(/\s/g, ''));
  }

  renderEmergencyContacts({item}): JSX.Element {
    return (
      <EmergencyContactTile
        contact={item}
        onPress={() => this.callNumber(item.phone)}
        size={this.avatarSize}></EmergencyContactTile>
    );
  }

  renderItemSeparator() {
    return <View style={styles.itemSeparator}></View>;
  }

  render() {
    return (
      <View style={[styles.container]}>
        <View style={styles.titleView}>
          <Text style={styles.title}>{this.props.t('main.titleContacts')}</Text>
          <View style={[styles.optionsButton]}>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={this.props.onPressOptionsButton}>
              {this.props.emergencyContacts.length > 0 && (
                <SvgCss
                  xml={images.imagesSVG.common.options}
                  width={scale(27.5)}
                  height={scale(27.5)}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emergencyContactsView}>
          <FlatList
            style={{height: '100%'}}
            ref={(ref) => {
              this.flatListRef = ref;
            }}
            showsVerticalScrollIndicator={false}
            horizontal
            data={this.props.emergencyContacts}
            renderItem={this.renderEmergencyContacts.bind(this)}
            ItemSeparatorComponent={this.renderItemSeparator.bind(this)}
            onContentSizeChange={() => {
              this.flatListRef.scrollToEnd();
              this.flatListRef.flashScrollIndicators();
            }}
            inverted
            scrollEnabled={this.props.emergencyContacts.length > 2}
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
    backgroundColor: colors.primary25opac,
    paddingHorizontal: scale(16),
    paddingVertical: scale(16)
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  emergencyContactsView: {
    flex: 2.5
  },
  title: {
    flex: 1,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white
  },
  optionsButton: {
    flex: 0
  }
});

export default withTranslation()(EmergencyContactContainer);
