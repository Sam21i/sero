import React, {Component} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';

import LocalesHelper from '../locales';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {activeOpacity, AppFonts, colors, scale, TextSize} from '../styles/App.style';

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

interface PropsType {
  localesHelper: LocalesHelper;
  item: Iitem;
}

interface State {
  expanded: boolean;
}

class InformationItem extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  renderTypeGroup() {
    return (
      <View
        key={this.props.item.id}
        style={this.state.expanded ? {paddingBottom: scale(30)} : {}}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({expanded: !this.state.expanded});
          }}>
          <View style={styles.groupView}>
            <Text style={styles.groupText}>{this.props.item.label[this.props.localesHelper.getCurrentLanguage()]}</Text>

            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => {
                this.setState({expanded: !this.state.expanded});
              }}>
              <View style={styles.toggleIcon}>
                {this.state.expanded ? (
                  <SvgCss xml={images.imagesSVG.common.toggleOpened} />
                ) : (
                  <SvgCss xml={images.imagesSVG.common.toggleClosedPrimary} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        {this.props.item.item &&
          this.state.expanded &&
          this.props.item.item.map((si: Iitem, i: number) => (
            <InformationItem
              localesHelper={this.props.localesHelper}
              key={i}
              item={si}
            />
          ))}
      </View>
    );
  }

  renderTypeSubGroup() {
    return (
      <View key={this.props.item.id}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({expanded: !this.state.expanded});
          }}>
          <View
            style={[
              this.state.expanded
                ? styles.subgroupView
                : [styles.subgroupView, {borderBottomColor: colors.grey, borderBottomWidth: scale(1)}]
            ]}>
            <Text style={styles.subgroupText}>
              {this.props.item.label[this.props.localesHelper.getCurrentLanguage()]}
            </Text>

            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => {
                this.setState({expanded: !this.state.expanded});
              }}>
              <View style={styles.toggleIcon}>
                {this.state.expanded ? (
                  <SvgCss xml={images.imagesSVG.common.toggleOpened} />
                ) : (
                  <SvgCss xml={images.imagesSVG.common.toggleClosedPrimary} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        {this.props.item.item &&
          this.state.expanded &&
          this.props.item.item.map((si: Iitem, i: number) => (
            <InformationItem
              localesHelper={this.props.localesHelper}
              key={i}
              item={si}
            />
          ))}
      </View>
    );
  }

  renderTypeText() {
    return (
      <View style={styles.textText}>
        <Text>{this.props.item.label[this.props.localesHelper.getCurrentLanguage()]}</Text>
        {this.props.item.item &&
          this.props.item.item.map((si: Iitem, i: number) => (
            <InformationItem
              localesHelper={this.props.localesHelper}
              key={i}
              item={si}
            />
          ))}
      </View>
    );
  }

  renderTypeQuestion() {
    return (
      <View style={styles.questionQuestionText}>
        <Text style={{color: colors.primary, fontFamily: AppFonts.medium, paddingVertical: scale(5)}}>
          {this.props.item.label[this.props.localesHelper.getCurrentLanguage()]}
        </Text>
        {this.props.item.item &&
          this.props.item.item.map((si: Iitem, i: number) => (
            <InformationItem
              localesHelper={this.props.localesHelper}
              key={i}
              item={si}
            />
          ))}
      </View>
    );
  }

  renderTypeQuestionText() {
    return (
      <View style={styles.questionText}>
        <Text>{this.props.item.label[this.props.localesHelper.getCurrentLanguage()]}</Text>
        {this.props.item.item &&
          this.props.item.item.map((si: Iitem, i: number) => (
            <InformationItem
              localesHelper={this.props.localesHelper}
              key={i}
              item={si}
            />
          ))}
      </View>
    );
  }

  renderTypeHyperLink() {
    return (
      <View style={styles.hyperlinkText}>
        <Text
          onPress={() => Linking.openURL(this.props.item.label[this.props.localesHelper.getCurrentLanguage()])}
          style={{color: colors.link}}>
          {this.props.item.label[this.props.localesHelper.getCurrentLanguage()]}
        </Text>
        {this.props.item.item &&
          this.props.item.item.map((si: Iitem, i: number) => (
            <InformationItem
              localesHelper={this.props.localesHelper}
              key={i}
              item={si}
            />
          ))}
      </View>
    );
  }
  renderTypeListItem() {
    return (
      <View style={styles.row}>
        <View style={styles.bulletView}>
          <Text style={styles.bulletPoint}>{'\u2022' + ' '}</Text>
        </View>
        <View style={styles.bulletTextView}>
          <Text style={styles.bulletText}>{this.props.item.label[this.props.localesHelper.getCurrentLanguage()]}</Text>
        </View>
      </View>
    );
  }

  render() {
    switch (this.props.item.type) {
      case itemType.GROUP:
        return this.renderTypeGroup();
      case itemType.SUB_GROUP:
        return this.renderTypeSubGroup();
      case itemType.QUESTION:
        return this.renderTypeQuestion();
      case itemType.QUESTION_TEXT:
        return this.renderTypeQuestionText();
      case itemType.LIST_ITEM:
        return this.renderTypeListItem();
      case itemType.TEXT:
        return this.renderTypeText();
      case itemType.HYPER:
        return this.renderTypeHyperLink();
      default:
        console.log(this.props.item.id + ' Rendering of question type ' + this.props.item.type + ' not supported.)');
    }
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: scale(5)
  },
  bulletView: {
    width: scale(10)
  },
  bulletPoint: {
    color: colors.gold,
    fontSize: scale(TextSize.verySmall)
  },
  bulletTextView: {
    flex: 1
  },
  bulletText: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall)
  },
  groupView: {
    paddingTop: scale(10),
    paddingBottom: scale(5),
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.grey,
    borderBottomWidth: scale(1)
  },
  subgroupView: {
    paddingTop: scale(10),
    paddingBottom: scale(5),
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  toggleIcon: {
    width: scale(TextSize.veryBig),
    height: scale(TextSize.veryBig),
    flex: 1
  },
  groupText: {
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    flex: 1,
    flexShrink: 1
  },
  subgroupText: {
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall),
    flex: 1,
    flexShrink: 1
  },
  textText: {
    paddingVertical: scale(5),
    fontSize: scale(TextSize.verySmall)
  },
  questionText: {
    paddingVertical: scale(5),
    fontSize: scale(TextSize.small)
  },
  hyperlinkText: {
    paddingVertical: scale(10),
    fontSize: scale(TextSize.small)
  },
  questionQuestionText: {
    paddingTop: scale(5),
    paddingBottom: scale(5),
    fontSize: scale(TextSize.verySmall)
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps, undefined)(InformationItem);
