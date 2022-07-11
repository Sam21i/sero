import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SvgCss} from 'react-native-svg';
import {v4 as uuidv4} from 'uuid';

import images from '../resources/images/images';
import {activeOpacity, AppFonts, colors, scale, TextSize} from '../styles/App.style';
import Translate from './Translate';

export enum ITEM_TYPE {
  GROUP = 'group',
  SUB_GROUP = 'subgroup',
  TITLE = 'title',
  LIST_ITEM = 'listitem',
  TEXT = 'text'
}

export interface Iitem {
  type: ITEM_TYPE;
  label: string;
  links?: string[];
  linkNames?: string[];
  item?: Iitem[];
}

interface PropsType extends WithTranslation {
  item: Iitem;
  isExpanded?: boolean;
}

interface State {
  expanded: boolean;
}

class InformationItem extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      expanded: this.props.isExpanded || false
    };
  }

  returnLinks(links): string[] {
    const newLinks: string[] = [];
    links.forEach((link: {address: string}) => {
      newLinks.push(link.address);
    });
    return newLinks;
  }

  returnLinkNames(links): string[] {
    const newLinkNames: string[] = [];
    links.forEach((link: {name: string}) => {
      newLinkNames.push(link.name);
    });
    return newLinkNames;
  }

  renderTypeGroup() {
    return (
      <View
        key={uuidv4()}
        style={[
          this.props.item.type === ITEM_TYPE.GROUP && this.state.expanded ? {paddingBottom: scale(25)} : {},
          this.props.item.type === ITEM_TYPE.SUB_GROUP && this.state.expanded ? {paddingBottom: scale(10)} : {},
          {paddingTop: scale(2.5)}
        ]}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({expanded: !this.state.expanded});
          }}>
          <View style={styles.groupView}>
            <Text
              style={
                this.props.item.type === ITEM_TYPE.SUB_GROUP
                  ? [styles.groupText, {fontFamily: AppFonts.condensedRegular, fontSize: TextSize.small}]
                  : styles.groupText
              }>
              {this.props.item.label}
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
        <View
          style={[this.props.item.type === ITEM_TYPE.SUB_GROUP && this.state.expanded ? {paddingTop: scale(10)} : {}]}>
          {this.props.item.item &&
            this.state.expanded &&
            this.props.item.item.map((item: Iitem) => (
              <InformationItem
                t={this.props.t}
                i18n={this.props.i18n}
                tReady={this.props.tReady}
                key={uuidv4()}
                item={item}
              />
            ))}
        </View>
      </View>
    );
  }

  renderTypeTitle() {
    return (
      <View
        style={{paddingTop: scale(10)}}
        key={uuidv4()}>
        <Text style={styles.title}>{this.props.item.label}</Text>
        {this.props.item.item &&
          this.props.item.item.map((item: Iitem) => (
            <InformationItem
              t={this.props.t}
              i18n={this.props.i18n}
              tReady={this.props.tReady}
              key={uuidv4()}
              item={item}
            />
          ))}
      </View>
    );
  }

  renderTypeText() {
    return (
      <View
        style={{paddingTop: scale(5)}}
        key={uuidv4()}>
        <Translate
          stringToTranslate={this.props.item.label}
          links={this.returnLinks(this.props.item.links || [])}
          linkNames={this.returnLinkNames(this.props.item.links || [])}
          textOptions={styles.text}
        />
        {this.props.item.item &&
          this.props.item.item.map((item: Iitem) => (
            <InformationItem
              t={this.props.t}
              i18n={this.props.i18n}
              tReady={this.props.tReady}
              key={uuidv4()}
              item={item}
            />
          ))}
      </View>
    );
  }

  renderTypeListItem() {
    return (
      <Text
        key={uuidv4()}
        style={styles.text}>
        {'\u2022' + ' ' + this.props.item.label}
      </Text>
    );
  }

  render() {
    switch (this.props.item.type) {
      case ITEM_TYPE.GROUP:
      case ITEM_TYPE.SUB_GROUP:
        return this.renderTypeGroup();
      case ITEM_TYPE.TITLE:
        return this.renderTypeTitle();
      case ITEM_TYPE.TEXT:
        return this.renderTypeText();
      case ITEM_TYPE.LIST_ITEM:
        return this.renderTypeListItem();
      default: {
        console.log('Rendering of question type ' + this.props.item.type + ' not supported.)');
        return <></>;
      }
    }
  }
}

const styles = StyleSheet.create({
  groupView: {
    paddingVertical: scale(5),
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: colors.grey,
    borderBottomWidth: scale(1)
  },
  toggleIcon: {
    width: scale(TextSize.veryBig),
    height: scale(TextSize.veryBig),
    flex: 1
  },
  groupText: {
    fontFamily: AppFonts.condensedBold,
    fontSize: scale(TextSize.normal),
    flex: 1
  },
  title: {
    fontFamily: AppFonts.condensedBold,
    paddingVertical: scale(2.5),
    fontSize: scale(TextSize.small),
    color: colors.primary
  },
  text: {
    fontFamily: AppFonts.condensedRegular,
    paddingVertical: scale(2.5),
    fontSize: scale(TextSize.small - 1)
  }
});

export default withTranslation()(InformationItem);
