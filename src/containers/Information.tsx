import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import InformationItem from '../components/InformationItem';
import LocalesHelper from '../locales';
import images from '../resources/images/images';
import {ABOUT, IMPRINT, LEGAL} from '../resources/static/informations';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
}

enum itemType {
  GROUP = 'group',
  SUB_GROUP = 'subgroup',
  QUESTION = 'question',
  QUESTION_TEXT = 'questiontext',
  LIST_ITEM = 'listitem',
  TEXT = 'text',
  HYPER = 'hypertext'
}

interface Iitem {
  id: string;
  type: itemType;
  label: {
    [language: string]: string;
  };
  prefix?: string;
  required?: boolean;
  item?: Iitem[];
  relatedResourceId?: string;
  isInvalid?: boolean;
}

interface State {
  mode: INFORMATION_MODE;
}

export enum INFORMATION_MODE {
  about = 'ABOUT',
  legal = 'LEGAL',
  imprint = 'IMPRINT',
  menu = 'MENU'
}

class Info extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      mode: INFORMATION_MODE.menu
    };
  }

  renderHeader() {
    return <View style={{height: verticalScale(55)}} />;
  }

  renderAbout() {
    return (
      <FlatList
        removeClippedSubviews={false}
        data={ABOUT as Iitem[]}
        ListHeaderComponent={this.renderHeader.bind(this)}
        renderItem={(listElement) => (
          <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
            <InformationItem
              localesHelper={this.props.localesHelper}
              item={listElement.item}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  renderMenu() {
    return (
      <View style={{paddingTop: scale(55)}}>
        {[
          {
            label: 'information.about',
            onPress: () => {
              this.setState({mode: INFORMATION_MODE.about});
            }
          },
          {
            label: 'information.legal',
            onPress: () => {
              this.setState({mode: INFORMATION_MODE.legal});
            }
          },
          {
            label: 'information.imprint',
            onPress: () => {
              this.setState({mode: INFORMATION_MODE.imprint});
            }
          }
        ].map((button, index) => (
          <AppButton
            key={'appButton_' + index}
            label={this.props.localesHelper.localeString(button.label)}
            position='left'
            icon={images.imagesSVG.common.archive}
            color={colors.primary}
            style={styles.button}
            onPress={button.onPress}
            isLargeButton
          />
        ))}
      </View>
    );
  }

  renderLegal() {
    return (
      <FlatList
        removeClippedSubviews={false}
        data={LEGAL as Iitem[]}
        ListHeaderComponent={this.renderHeader.bind(this)}
        renderItem={(listElement) => (
          <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
            <InformationItem
              localesHelper={this.props.localesHelper}
              item={listElement.item}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  }

  renderImprint() {
    return <Text>tbd</Text>;
  }

  renderContent() {
    switch (this.state.mode) {
      case INFORMATION_MODE.about:
        return this.renderAbout();
      case INFORMATION_MODE.legal:
        return this.renderLegal();
      case INFORMATION_MODE.imprint:
        return this.renderImprint();
      default:
        return this.renderMenu();
    }
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodGrey}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <BackButton
              color={this.state.mode !== INFORMATION_MODE.menu ? colors.primary : undefined}
              onPress={() => {
                this.state.mode !== INFORMATION_MODE.menu ? this.setState({mode: INFORMATION_MODE.menu}) : undefined;
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('information.title')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>{this.renderContent()}</View>
          <View style={styles.emergencyButton}>
            <EmergencyNumberButton />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topViewText: {
    color: colors.primary,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  button: {
    marginVertical: scale(10)
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  emergencyButton: {
    position: 'absolute',
    right: -0.2,
    top: verticalScale(45)
  },
  topView: {
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: 'row'
  },
  bottomView: {
    flex: 7,
    backgroundColor: colors.white65opac
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps, undefined)(Info);
