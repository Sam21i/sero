import {IQuestion} from '@i4mi/fhir_questionnaire';
import {QuestionnaireItemType} from '@i4mi/fhir_r4';
import {NativeBaseProvider, TextArea} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {SvgCss} from 'react-native-svg';

import images from '../resources/images/images';
import {activeOpacity, AppFonts, colors, scale, TextSize} from '../styles/App.style';

interface PropsType {
  onChangeText: (text: string, question: IQuestion) => void;
  question: IQuestion;
  isArchiveMode?: boolean;
}

interface State {
  expanded: boolean;
}

export default class Question extends Component<PropsType, State> {
  answer: string = this.props.question.selectedAnswers[0]
    ? this.props.question.selectedAnswers[0].valueString || ''
    : '';

  constructor(props: PropsType) {
    super(props);

    this.state = {
      expanded: this.props.isArchiveMode ? true : false
    };
  }

  hasAnswer(item: IQuestion) {
    return item.selectedAnswers.length > 0;
  }

  hasChildrenWithContent(item: IQuestion) {
    console.log(item.id);
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
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({expanded: !this.state.expanded});
          }}>
          <View
            style={[
              this.state.expanded
                ? styles.viewGroup
                : [styles.viewGroup, {borderBottomColor: colors.grey, borderBottomWidth: scale(1)}]
            ]}>
            <TouchableOpacity
              activeOpacity={activeOpacity}
              style={{paddingRight: scale(10)}}
              onPress={() => {
                this.setState({expanded: !this.state.expanded});
              }}>
              <View style={styles.toggleIcon}>
                {this.state.expanded ? (
                  <SvgCss xml={images.imagesSVG.common.toggleOpened} />
                ) : (
                  <SvgCss xml={images.imagesSVG.common.toggleClosed} />
                )}
              </View>
            </TouchableOpacity>

            <Text style={styles.questionGroupText}>{this.props.question.label.de}</Text>
          </View>
        </TouchableWithoutFeedback>

        {this.props.question.subItems &&
          this.state.expanded &&
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
                  isReadOnly={this.props.isArchiveMode}
                  borderWidth='0'
                  borderBottomWidth={scale(1)}
                  borderBottomColor={colors.grey}
                  h='auto'
                  placeholder='...'
                  size='lg'
                  _focus={{borderBottomWidth: scale(1), borderBottomColor: colors.gold, backgroundColor: colors.white}}
                  defaultValue={this.answer}
                  keyboardType='default'
                  autoCorrect={true}
                  onChangeText={(text: string) => {
                    this.props.onChangeText(text, this.props.question);
                  }}
                />
                <Text>{this.props.question.label.id}</Text>
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
    alignItems: 'center'
  },
  toggleIcon: {
    width: scale(TextSize.veryBig),
    height: scale(TextSize.veryBig)
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
