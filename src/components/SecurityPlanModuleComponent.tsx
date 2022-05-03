import React, {Component} from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import CopingIcon from '../resources/images/icons/securityplan/copingStrategies.svg';
import DistractionIcon from '../resources/images/icons/securityplan/distractionStrategies.svg';
import MotivationIcon from '../resources/images/icons/securityplan/motivation.svg';
import BeliefsIcon from '../resources/images/icons/securityplan/personalBeliefs.svg';
import ContactsIcon from '../resources/images/icons/securityplan/professionalContacts.svg';
import WarningIcon from '../resources/images/icons/securityplan/warningSigns.svg';
import EditPencil from '../resources/images/icons/securityplan/pencil.svg';
import { SecurityPlanModule, SECURITY_PLAN_MODULE_TYPE } from '../model/SecurityPlan';
import {
  AppFonts,
  colors,
  scale,
  windowWidth,
} from '../styles/App.style';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

interface SecurityPlanModuleComponentProps {
  module: SecurityPlanModule,
  editable: boolean,
  onEdit?: (m: SecurityPlanModule) => void
}

interface SecurityPlanModuleState {
 
}

export default class SecurityPlanModuleComponent extends Component<SecurityPlanModuleComponentProps, SecurityPlanModuleState> {
  constructor(props: SecurityPlanModuleComponentProps) {
    super(props);
    this.state = {
    }
  }

  callNumber(_number: string): void {
    const phone = 'tel:' + _number.replace(/\s/g, '');
    Linking.openURL(phone);
  }

  renderNormalModuleContent() {
    return (
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{ this.props.module.title }</Text>
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
        <Text style={styles.title}>{ this.props.module.title }</Text>
        <View>
          { this.props.module.entries.map((entry, index) => {
            const label = entry.split('(')[0];
            const phone = entry.split('(')[1].split(')')[0];
            return  <TouchableWithoutFeedback 
                      onPress={() => this.callNumber(phone)}
                      key={entry.substring(0,10) + index}>
                      <View style={styles.contactEntry} >
                        <Text style={styles.phoneLabel}>{label}</Text>
                        <Text style={styles.phoneNumber}>{phone}</Text>
                      </View>
                    </TouchableWithoutFeedback>
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
          {
            this.props.editable && this.props.module.type !== SECURITY_PLAN_MODULE_TYPE.PROFESSIONAL_CONTACTS &&
            <TouchableOpacity 
              onPress={() => this.props.onEdit ? this.props.onEdit(this.props.module) : {}}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10 }}>
              <EditPencil style={styles.editIcon} width={scale(40)} height={scale(20)} />
            </TouchableOpacity>
            
          }
            
          
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
    marginTop: scale(3)
  },
  entry: {
    flexDirection: 'row'
  },
  bullet: {
    fontFamily: AppFonts.regular
  },
  title: {
    color: colors.tumbleweed,
    fontFamily: AppFonts.bold,
    marginBottom: scale(2),
    width: windowWidth - scale(110)
  },
  content: {
    marginLeft: scale(5),
    marginRight: scale(15),
    fontFamily: AppFonts.regular,
    flexWrap: 'wrap',
    width: windowWidth - scale(110)
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
    width: scale(80),
    borderBottomRightRadius: scale(30),
    borderTopRightRadius: scale(30)
  },
  icon: {
    alignSelf: 'flex-end',
    marginTop: scale(10),
    marginRight: scale(10)
  },
  editIcon: {
    alignSelf: 'flex-end',
    marginTop: scale(-10),
    marginRight: scale(-8)
  }
});
