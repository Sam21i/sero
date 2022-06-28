import React, {Component} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View, Platform} from 'react-native';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import SpeechBubble from './SpeechBubble';

export enum ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE {
  yes = 'YES',
  no = 'NO',
  menu = 'MENU'
}

const MENU_ACTIONS = [
  {name: 'yes', mode: ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE.yes},
  {name: 'no', mode: ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE.no}
];

interface Props {
  localesHelper: LocalesHelper;
  onClose: (mode?: ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE) => void;
}

interface State {
  mode: ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE;
}

class AssessmentQuitSpeechBubble extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: ASSESSMENT_QUIT_SPEECH_BUBBLE_MODE.menu
    };
  }

  renderBubbleTitle(translateString: string) {
    return (
      <View style={styles.titleBar}>
        <Text
          numberOfLines={2}
          style={styles.titlebarText}>
          {this.props.localesHelper.localeString(translateString)}
        </Text>
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
        {this.renderBubbleTitle('assessment.cancelQuestion')}
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
                    <Text style={styles.actionText}>
                      {this.props.localesHelper.localeString('common.' + action.name)}
                    </Text>
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
          bubble: {
            padding: 20
          },
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

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps, undefined)(AssessmentQuitSpeechBubble);
