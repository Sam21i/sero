import React, {Component} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {SvgCss} from 'react-native-svg';
import Icon from '../resources/images/common/camera.svg';
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

  }

  renderContactModuleContent() {

  }

  renderIcon(type: SECURITY_PLAN_MODULE_TYPE) {
    return <Icon style={styles.icon} width={scale(50)} height={scale(50)}></Icon>
  }

  render() {
    return (
      <View style={styles.componentWrapper}>
        <View style={styles.iconContainer}>
           { this.renderIcon(this.props.module.type) }
        </View>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  componentWrapper: {
    flexDirection: 'row',
    marginBottom: scale(10)
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
    width: windowWidth - scale(120)
  },
  iconContainer: {
    backgroundColor: colors.petrol,
    height: scale(80),
    width: scale(90),
    borderBottomRightRadius: scale(40),
    borderTopRightRadius: scale(40)
  },
  icon: {
    alignSelf: 'flex-end',
    marginTop: scale(15),
    marginRight: scale(15)
  }
});
