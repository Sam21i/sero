import React, {Component} from 'react';
import {StyleSheet, Modal, Text} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import LocalesHelper from '../locales';
import {SecurityPlanModule} from '../model/SecurityPlan';
import {colors, scale} from '../styles/App.style';
import AppButton from './AppButton';

interface SecurityPlanEditModalProps {
  localesHelper: LocalesHelper;
  onClose: (arg: {module?: SecurityPlanModule}) => void;
  module: SecurityPlanModule;
}

interface SecurityPlanEditModalState {}

export default class SecurityPlanEditModal extends Component<SecurityPlanEditModalProps, SecurityPlanEditModalState> {
  constructor(props: SecurityPlanEditModalProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Modal
        animationType="none"
        presentationStyle="fullScreen">
        <Text>data</Text>
        <AppButton
          label={this.props.localesHelper.localeString('common.back')}
          icon={
            '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
          }
          position="right"
          color={colors.tumbleweed}
          onPress={() => {
            this.props.onClose({});
          }}
          style={styles.backButton}></AppButton>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    alignItems: 'center'
  },
  backButton: {
    height: scale(50),
    width: scale(200),
    paddingVertical: scale(10),
    marginVertical: 0,
    marginBottom: 20
  }
});
