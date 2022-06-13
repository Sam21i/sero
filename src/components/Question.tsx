import {IQuestion} from '@i4mi/fhir_questionnaire';
import {QuestionnaireItemType} from '@i4mi/fhir_r4';
import {Input, NativeBaseProvider} from 'native-base';
import React, {Component} from 'react';
import {ColorSchemeName, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface PropsType {
  onChangeText: (text: string, question: IQuestion) => void;
  question: IQuestion;
}

interface State {
  expanded: boolean;
}

export default class Question extends Component<PropsType, State> {
  answer: string = '';

  constructor(props: PropsType) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  render() {
    switch (this.props.question.type) {
      case QuestionnaireItemType.GROUP:
        return (
          <View key={this.props.question.id}>
            <TouchableOpacity
              style={{width: 30, height: 30, backgroundColor: 'red'}}
              onPress={() => {
                this.setState({expanded: !this.state.expanded});
              }}></TouchableOpacity>
            <Text>== {this.props.question.label.de} ==</Text>
            {this.props.question.subItems &&
              this.state.expanded &&
              this.props.question.subItems.map((si: IQuestion, i: number) => {
                return (
                  <Question
                    question={si}
                    onChangeText={this.props.onChangeText}
                  />
                );
              })}
          </View>
        );
      case QuestionnaireItemType.TEXT:
        return (
          <NativeBaseProvider key={this.props.question.id}>
            <Text>{this.props.question.label.de}</Text>
            <Input
              value={this.answer}
              keyboardType={'default'}
              placeholder='gib hier deine Antwort ein'
              autoCorrect={true}
              onChangeText={(text) => {
                this.answer = text;
                this.props.onChangeText(text, this.props.question);
              }}
            />
          </NativeBaseProvider>
        );
      case QuestionnaireItemType.DISPLAY:
        return <View></View>;

      default:
        return <Text key={this.props.question.id}>Rendering Question Type {this.props.question.id} not supported</Text>;
    }
  }
}

const styles = StyleSheet.create({});
