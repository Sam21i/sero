import React, {Component} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SvgCss} from 'react-native-svg';
import CopingIcon from '../resources/images/icons/securityplan/copingStrategies.svg';
import DistractionIcon from '../resources/images/icons/securityplan/distractionStrategies.svg';
import MotivationIcon from '../resources/images/icons/securityplan/motivation.svg';
import BeliefsIcon from '../resources/images/icons/securityplan/personalBeliefs.svg';
import ContactsIcon from '../resources/images/icons/securityplan/professionalContacts.svg';
import WarningIcon from '../resources/images/icons/securityplan/warningSigns.svg';
import { SecurityPlanModule, SECURITY_PLAN_MODULE_TYPE } from '../model/SecurityPlan';
import {
  AppFonts,
  colors,
  scale,
  TextSize,
  verticalScale,
  windowHeight,
  windowWidth,
} from '../styles/App.style';

interface SecurityPlanModuleComponentProps {
  module: SecurityPlanModule,
  editable: boolean
}

interface SecurityPlanModuleState {
 
}

export default class SecurityPlanModuleComponent extends Component<SecurityPlanModuleComponentProps, SecurityPlanModuleState> {
  constructor(props: SecurityPlanModuleComponentProps) {
    super(props);
    this.state = {
  
    }
  }

  renderNormalModuleContent() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}> { this.props.module.title } </Text>
        <View>
          { this.props.module.entries.map((entry, index) => {
            return  <View style={styles.entry} key={entry.substring(0,10) + index}>
                      <Text style={styles.bullet}>–</Text>
                      <Text style={styles.content}>{entry}</Text>
                    </View> 
          })}
        </View>
      </View>
    );
  }

  renderContactModuleContent() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}> { this.props.module.title } </Text>
        <View>
          { this.props.module.entries.map((entry, index) => {
            return  <View style={styles.entry} key={entry.substring(0,10) + index}>
                      <Text style={styles.bullet}>–</Text>
                      <Text style={styles.content}>{entry}</Text>
                    </View> 
          })}
        </View>
      </View>
    );

  }

  renderIcon(type: SECURITY_PLAN_MODULE_TYPE) {
    switch(type) {
      case SECURITY_PLAN_MODULE_TYPE.COPING_STRATEGIES:
        return <CopingIcon style={styles.icon} width={scale(40)} height={scale(40)} />
      case SECURITY_PLAN_MODULE_TYPE.DISTRACTION_STRATIES:
        return <DistractionIcon style={styles.icon} width={scale(40)} height={scale(40)} />
      case SECURITY_PLAN_MODULE_TYPE.MOTIVATION:
        return <MotivationIcon style={styles.icon} width={scale(40)} height={scale(40)} />
      case SECURITY_PLAN_MODULE_TYPE.PERSONAL_BELIEFS:
        return <BeliefsIcon style={styles.icon} width={scale(40)} height={scale(40)} />
      case SECURITY_PLAN_MODULE_TYPE.PROFESSIONAL_CONTACTS:
        return <ContactsIcon Icon style={styles.icon} width={scale(40)} height={scale(40)} />
      case SECURITY_PLAN_MODULE_TYPE.WARNING_SIGNS:
        return <WarningIcon Icon style={styles.icon} width={scale(40)} height={scale(40)} />
    }
  }

  render() {
    return (
      <View style={styles.componentWrapper}>
        <View style={styles.iconContainer}>
           { this.renderIcon(this.props.module.type) }
        </View>
        { this.props.module.type === SECURITY_PLAN_MODULE_TYPE.PROFESSIONAL_CONTACTS
          ? this.renderContactModuleContent()
          : this.renderNormalModuleContent()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  componentWrapper: {
    flexDirection: 'row',
    marginBottom: scale(20)
  },
  contentContainer: {
    flexDirection: 'column',
    marginLeft: scale(10),
    marginTop: scale(5)
  },
  entry: {
    flexDirection: 'row'
  },
  bullet: {
    fontFamily: AppFonts.regular
  },
  title: {
    color: colors.tumbleweed,
    fontFamily: AppFonts.bold
  },
  content: {
    marginLeft: scale(5),
    marginRight: scale(15),
    fontFamily: AppFonts.regular,
    flexWrap: 'wrap',
    width: windowWidth - scale(110)
  },
  iconContainer: {
    backgroundColor: colors.primary,
    height: scale(60),
    width: scale(80),
    borderBottomRightRadius: scale(30),
    borderTopRightRadius: scale(30)
  },
  icon: {
    alignSelf: 'flex-end',
    marginTop: scale(10),
    marginRight: scale(10)
  }
});
