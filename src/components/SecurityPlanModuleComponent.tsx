import React, {Component} from 'react';
import {Alert, Linking, LogBox, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SvgCss} from 'react-native-svg';

import LocalesHelper from '../locales';
import {SECURITY_PLAN_MODULE_TYPE, SecurityPlanModule} from '../model/SecurityPlan';
import images from '../resources/images/images';
import {activeOpacity, AppFonts, colors, scale, windowWidth} from '../styles/App.style';

LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);

interface SecurityPlanModuleComponentProps {
  localesHelper: LocalesHelper;
  module: SecurityPlanModule;
  editable: boolean;
  isBeingDragged: boolean;
  onEdit?: (m: SecurityPlanModule) => void;
}

export default class SecurityPlanModuleComponent extends Component<SecurityPlanModuleComponentProps> {
  constructor(props: SecurityPlanModuleComponentProps) {
    super(props);
    this.state = {};
  }

  callNumber(_number: string): void {
    if (!this.props.isBeingDragged) {
      const phone = 'tel:' + _number.replace(/\s/g, '');
      if (phone === 'tel:0900856565') {
        Alert.alert(
          this.props.localesHelper.localeString('securityplan.alertLups.title'),
          this.props.localesHelper.localeString('securityplan.alertLups.description'),
          [
            {
              text: this.props.localesHelper.localeString('common.cancel'),
              onPress: () => {},
              style: 'cancel'
            },
            {text: this.props.localesHelper.localeString('common.ok'), onPress: () => Linking.openURL(phone)}
          ]
        );
      } else {
        Linking.openURL(phone);
      }
    }
  }

  renderNormalModuleContent() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{this.props.module.title}</Text>
        <View>
          {this.props.module?.entries.map((entry, index) => {
            return (
              <View
                style={styles.entry}
                key={entry.substring(0, 10) + index}>
                <Text style={styles.bullet}>–</Text>
                <Text style={styles.content}>{entry}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  renderContactModuleContent() {
    return (
      <View style={[styles.contentContainer, {width: windowWidth - scale(95)}]}>
        <Text style={styles.title}>{this.props.module.title}</Text>
        <View>
          {this.props.module.entries.map((entry, index) => {
            const label = entry.split('(')[0];
            const phone = entry.split('(')[1].split(')')[0];
            return (
              <TouchableWithoutFeedback
                onPress={() => this.callNumber(phone)}
                key={entry.substring(0, 10) + index}>
                <View style={styles.contactEntry}>
                  <Text style={styles.phoneLabel}>{label}</Text>
                  <Text style={styles.phoneNumber}>{phone}</Text>
                </View>
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    );
  }

  renderIcon(type: SECURITY_PLAN_MODULE_TYPE) {
    switch (type) {
      case SECURITY_PLAN_MODULE_TYPE.COPING_STRATEGIES:
        return (
          <SvgCss
            xml={images.imagesSVG.securityplan.copingStrategies}
            style={styles.icon}
            width={scale(40)}
            height={scale(40)}
          />
        );
      case SECURITY_PLAN_MODULE_TYPE.DISTRACTION_STRATIES:
        return (
          <SvgCss
            xml={images.imagesSVG.securityplan.distractionStrategies}
            style={styles.icon}
            width={scale(40)}
            height={scale(40)}
          />
        );
      case SECURITY_PLAN_MODULE_TYPE.MOTIVATION:
        return (
          <SvgCss
            xml={images.imagesSVG.securityplan.mymotivation}
            style={styles.icon}
            width={scale(40)}
            height={scale(40)}
          />
        );
      case SECURITY_PLAN_MODULE_TYPE.PERSONAL_BELIEFS:
        return (
          <SvgCss
            xml={images.imagesSVG.securityplan.personalBeliefs}
            style={styles.icon}
            width={scale(40)}
            height={scale(40)}
          />
        );
      case SECURITY_PLAN_MODULE_TYPE.PROFESSIONAL_CONTACTS:
        return (
          <SvgCss
            xml={images.imagesSVG.securityplan.professionalContacts}
            style={styles.icon}
            width={scale(40)}
            height={scale(40)}
          />
        );
      case SECURITY_PLAN_MODULE_TYPE.WARNING_SIGNS:
        return (
          <SvgCss
            xml={images.imagesSVG.securityplan.warningSigns}
            style={styles.icon}
            width={scale(40)}
            height={scale(40)}
          />
        );
    }
  }

  render() {
    return (
      <View style={[styles.componentWrapper, this.props.isBeingDragged ? styles.dragged : {}]}>
        <View style={styles.iconContainer}>
          {this.props.editable && (
            <View style={{flexDirection: 'column', position: 'absolute', paddingTop: 4}}>
              <View style={styles.editingGripPoint} />
              <View style={styles.editingGripPoint} />
              <View style={styles.editingGripPoint} />
            </View>
          )}
          {this.renderIcon(this.props.module.type)}
        </View>
        {this.props.module.type === SECURITY_PLAN_MODULE_TYPE.PROFESSIONAL_CONTACTS
          ? this.renderContactModuleContent()
          : this.renderNormalModuleContent()}

        {this.props.editable && this.props.module.type !== SECURITY_PLAN_MODULE_TYPE.PROFESSIONAL_CONTACTS && (
          <View style={styles.editPencilContainer}>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={() => (this.props.onEdit ? this.props.onEdit(this.props.module) : {})}>
              <SvgCss
                xml={images.imagesSVG.common.pencil}
                style={styles.editIcon}
                width={scale(30)}
                height={scale(50)}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  editPencilContainer: {
    width: 50,
    justifyContent: 'center'
  },
  componentWrapper: {
    flexDirection: 'row',
    marginBottom: scale(20)
  },
  contentContainer: {
    flexDirection: 'column',
    paddingLeft: scale(10),
    paddingTop: scale(0),
    width: windowWidth - scale(130)
  },
  entry: {
    flexDirection: 'row'
  },
  dragged: {
    opacity: 0.75,
    transform: [{scale: 0.95}]
  },
  bullet: {
    fontFamily: AppFonts.regular
  },
  title: {
    color: colors.primary,
    fontFamily: AppFonts.bold,
    paddingBottom: scale(2)
  },
  content: {
    paddingLeft: scale(5),
    paddingRight: scale(15),
    fontFamily: AppFonts.regular,
    flexWrap: 'wrap'
  },
  contactEntry: {
    flexDirection: 'row',
    marginBottom: scale(4),
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.grey
  },
  phoneLabel: {
    alignSelf: 'flex-start'
  },
  phoneNumber: {
    alignSelf: 'flex-end'
  },
  iconContainer: {
    backgroundColor: colors.primary,
    height: scale(60),
    width: scale(75),
    borderBottomRightRadius: scale(30),
    borderTopRightRadius: scale(30)
  },
  icon: {
    alignSelf: 'flex-end',
    marginTop: scale(10),
    marginRight: scale(10)
  },
  editIcon: {
    alignSelf: 'center'
  },
  editingGripPoint: {
    marginTop: scale(10),
    marginLeft: scale(8),
    backgroundColor: colors.black,
    opacity: 0.3,
    height: scale(4),
    width: scale(10),
    borderRadius: scale(2)
  }
});
