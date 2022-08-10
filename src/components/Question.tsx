import {IQuestion} from '@i4mi/fhir_questionnaire';
import {QuestionnaireItemType} from '@i4mi/fhir_r4';
import {NativeBaseProvider, TextArea} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {AppFonts, colors, scale, TextSize} from '../styles/App.style';

interface PropsType {
  onChangeText?: (text: string, question: IQuestion) => void;
  question: IQuestion;
  isArchiveMode?: boolean;
}

export default class Question extends Component<PropsType, State> {
  answer: string = this.props.question.selectedAnswers[0]
    ? this.props.question.selectedAnswers[0].valueString || ''
    : '';

  constructor(props: PropsType) {
    super(props);
  }

  hasAnswer(item: IQuestion) {
    return item.selectedAnswers.length > 0;
  }

  hasChildrenWithContent(item: IQuestion) {
    let count = 0;
    item.subItems?.forEach((item) => {
      if (this.hasAnswer(item)) {
        count++;
      }
    });
    return count > 0;
  }

  renderQuestionGroup() {
    return (
      <View key={this.props.question.id}>
        <View style={styles.viewGroup}>
          <Text style={styles.questionGroupText}>{this.props.question.label.de}</Text>
        </View>
        {this.props.question.subItems &&
          this.props.question.subItems.map((si: IQuestion, i: number) => (
            <Question
              key={i}
              question={si}
              onChangeText={this.props.onChangeText}
              isArchiveMode={this.props.isArchiveMode}
            />
          ))}
      </View>
    );
  }

  render() {
    switch (this.props.question.type) {
      case QuestionnaireItemType.GROUP:
        if (
          (this.props.isArchiveMode && this.hasChildrenWithContent(this.props.question)) ||
          !this.props.isArchiveMode
        ) {
          return this.renderQuestionGroup();
        } else {
          return <></>;
        }

      case QuestionnaireItemType.TEXT: {
        if (this.props.isArchiveMode && this.props.question.selectedAnswers.length === 0) {
          return <></>;
        } else {
          return (
            <NativeBaseProvider key={this.props.question.id}>
              <View style={{paddingVertical: scale(5)}}>
                <Text style={styles.questionText}>{this.props.question.label.de}</Text>
                <TextArea
                  marginTop={1}
                  isReadOnly={this.props.isArchiveMode}
                  borderWidth='0'
                  backgroundColor={colors.white}
                  h='auto'
                  size='lg'
                  _focus={{borderBottomWidth: scale(1), borderBottomColor: colors.gold, backgroundColor: colors.white}}
                  defaultValue={this.answer}
                  keyboardType='default'
                  autoCorrect={true}
                  onChangeText={(text: string) => {
                    this.props.onChangeText(text, this.props.question);
                  }}
                />
              </View>
            </NativeBaseProvider>
          );
        }
      }
      default:
        console.log(
          this.props.question.id + ' Rendering of question type ' + this.props.question.type + ' not supported.)'
        );
    }
  }
}

const styles = StyleSheet.create({
  viewGroup: {
    paddingTop: scale(20),
    paddingBottom: scale(5),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.grey,
    borderBottomWidth: scale(1)
  },
  questionGroupText: {
    fontFamily: AppFonts.bold,
    fontSize: TextSize.small
  },
  questionText: {
    fontFamily: AppFonts.regular,
    fontSize: TextSize.small,
    paddingBottom: scale(5)
  }
});
