import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ASSESSMENT_RESOURCES} from '../resources/static/assessmentIntroResources';

interface AssessmentDescriptionProps {}

export default class AssessmentDescription extends Component<AssessmentDescriptionProps> {
  render() {
    return (
      <View>
        <Text>Test</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {}
});
