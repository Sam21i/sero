import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {Platform, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SvgCss} from 'react-native-svg';

import images from '../resources/images/images';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import SpeechBubble from './SpeechBubble';

export enum SECURITYPLAN_SPEECH_BUBBLE_MODE {
  edit = 'EDIT',
  new = 'NEW',
  menu = 'MENU'
}

const MENU_ACTIONS = [
  {name: 'editSecurityplan', mode: SECURITYPLAN_SPEECH_BUBBLE_MODE.edit},
  {name: 'newSecurityplan', mode: SECURITYPLAN_SPEECH_BUBBLE_MODE.new}
];

interface SecurityplanBubbleProps extends WithTranslation {
  navigation: StackNavigationProp<any>;
  onClose: (mode: SECURITYPLAN_SPEECH_BUBBLE_MODE) => void;
}

interface SecurityplanSpeechBubbleState {
  mode: SECURITYPLAN_SPEECH_BUBBLE_MODE;
}

class SecurityplanSpeechBubble extends Component<SecurityplanBubbleProps, SecurityplanSpeechBubbleState> {
  constructor(props: SecurityplanBubbleProps) {
    super(props);
    this.state = {
      mode: SECURITYPLAN_SPEECH_BUBBLE_MODE.menu
    };
  }

  renderBubbleTitle(_translateString: string) {
    return (
      <View style={styles.titleBar}>
        <Text style={styles.titlebarText}>{this.props.t(_translateString)}</Text>
        <SvgCss
          xml={images.imagesSVG.common.cancelGrey}
          width={scale(35)}
          height={scale(35)}
          onPress={() => this.props.onClose(this.state.mode)}
        />
      </View>
    );
  }

  renderMenu() {
    return (
      <>
        {this.renderBubbleTitle('securityplan.bubbleTitle')}
        <View style={styles.actionList}>
          {MENU_ACTIONS.map((action, index) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => this.props.onClose(action.mode)}
                key={'menu_' + index}>
                <View
                  style={styles.actionMenuPoint}
                  key={'action_' + index}>
                  <View style={styles.actionBubble}></View>
                  <View style={styles.actionTextWrapper}>
                    <Text style={styles.actionText}>{this.props.t('securityplan.' + action.name)}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </>
    );
  }

  renderIcon() {
    return (
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignContent: 'center',
          width: '100%',
          marginLeft: scale(57.5)
        }}>
        <SvgCss
          xml={images.imagesSVG.common.person}
          width={80}
          height={80}
          style={{position: 'absolute', top: 315, alignSelf: 'center'}}
        />
      </View>
    );
  }

  render() {
    return (
      <SpeechBubble
        bubbleContent={this.renderMenu()}
        stylingOptions={{
          general: {
            position: {
              top: 100,
              left: -25
            },
            width: scale(337.5)
          },
          arrow: {
            position: {
              left: verticalScale(140),
              bottom: 0
            },
            size: 30
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  titleBar: {
    paddingVertical: scale(10),
    paddingLeft: scale(40),
    paddingRight: scale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titlebarText: {
    color: colors.primary,
    fontSize: scale(TextSize.normal),
    fontFamily: AppFonts.bold
  },
  actionList: {
    marginBottom: scale(30)
  },
  actionMenuPoint: {
    marginLeft: scale(45),
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionBubble: {
    backgroundColor: colors.white,
    borderWidth: 2,
    marginRight: scale(TextSize.normal),
    borderColor: colors.primary,
    borderRadius: scale(TextSize.big) / 2,
    height: scale(TextSize.big),
    width: scale(TextSize.big)
  },
  actionText: {
    fontSize: scale(TextSize.small),
    fontFamily: AppFonts.regular
  },
  actionTextWrapper: {
    borderBottomWidth: 2,
    marginTop: scale(TextSize.normal) / 1,
    borderBottomColor: colors.veryLightGrey,
    borderBottomStyle: 'solid',
    marginRight: Platform.OS === 'ios' ? scale(-10) : scale(-8.5),
    flex: 1
  }
});

export default withTranslation()(SecurityplanSpeechBubble);
