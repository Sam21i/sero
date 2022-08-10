import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component, Fragment} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {v4 as uuidv4} from 'uuid';

import {LANGUAGES} from '../../i18n';
import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import InformationItem, {Iitem} from '../components/InformationItem';
import images from '../resources/images/images';
import {AppFonts, colors, scale, TextSize, verticalScale, windowWidth} from '../styles/App.style';

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;
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

  renderFooterLogos() {
    return (
      <Fragment>
        <View style={styles.footerLogos}>
          {Object.values(images.imagesSVG.logo).map((logo) => {
            return (
              <SvgCss
                xml={logo}
                width={windowWidth / 3}
                height={verticalScale(60)}
                key={uuidv4()}
              />
            );
          })}
        </View>
        <View style={{height: scale(25)}}></View>
      </Fragment>
    );
  }

  renderSpace(space: number) {
    return <View style={{height: scale(space)}}></View>;
  }

  renderMenu() {
    return (
      <View>
        {this.renderSpace(55)}
        {[
          {
            label: 'information.about.title',
            onPress: () => {
              this.setState({mode: INFORMATION_MODE.about});
            }
          },
          {
            label: 'information.legal.title',
            onPress: () => {
              this.setState({mode: INFORMATION_MODE.legal});
            }
          },
          {
            label: 'information.imprint.title',
            onPress: () => {
              this.setState({mode: INFORMATION_MODE.imprint});
            }
          }
        ].map((button, index) => (
          <AppButton
            key={'appButton_' + index}
            label={this.props.t(button.label)}
            position='left'
            icon={images.imagesSVG.common.start}
            color={colors.primary}
            style={styles.button}
            onPress={button.onPress}
            isLargeButton
          />
        ))}
      </View>
    );
  }

  renderContentList() {
    return (
      <View>
        <FlatList
          overScrollMode='always'
          style={{height: '100%'}}
          removeClippedSubviews={false}
          data={LANGUAGES[this.props.i18n.language].information[this.state.mode.toLowerCase()].content as Iitem[]}
          renderItem={(listElement) => (
            <View
              style={{paddingLeft: scale(40), paddingRight: scale(20)}}
              key={uuidv4()}>
              <InformationItem
                key={uuidv4()}
                item={listElement.item}
                isExpanded={this.state.mode === INFORMATION_MODE.imprint ? true : false}
              />
            </View>
          )}
          ListHeaderComponent={this.renderSpace(55)}
          ListFooterComponent={
            this.state.mode === INFORMATION_MODE.imprint ? this.renderFooterLogos : this.renderSpace(25)
          }
        />
      </View>
    );
  }

  renderContent() {
    switch (this.state.mode) {
      case INFORMATION_MODE.about:
      case INFORMATION_MODE.legal:
      case INFORMATION_MODE.imprint:
        return this.renderContentList();
      default:
        return this.renderMenu();
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    this.props.navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
    });
  }

  render() {
    let pageTitle = '';
    if (this.state.mode === INFORMATION_MODE.about) {
      pageTitle = this.props.t('information.about.title');
    } else if (this.state.mode === INFORMATION_MODE.legal) {
      pageTitle = this.props.t('information.legal.title');
    } else if (this.state.mode === INFORMATION_MODE.imprint) {
      pageTitle = this.props.t('information.imprint.title');
    } else {
      pageTitle = this.props.t('information.title');
    }
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
              <Text style={styles.topViewText}>{pageTitle}</Text>
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
  },
  footerLogos: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginLeft: scale(40),
    marginRight: scale(20)
  }
});

export default withTranslation()(Info);
