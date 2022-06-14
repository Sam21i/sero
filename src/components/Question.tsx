import {IQuestion} from '@i4mi/fhir_questionnaire';
import {QuestionnaireItemType} from '@i4mi/fhir_r4';
import {NativeBaseProvider, TextArea} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import IconClosed from '../resources/images/icons/icon_toggle_closed';
import IconOpened from '../resources/images/icons/icon_toggle_opened';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';

interface PropsType {
  onChangeText: (text: string, question: IQuestion) => void;
  question: IQuestion;
}

interface State {
  expanded: boolean;
}

export default class Question extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      expanded: false
    };

    console.log(this.props.question.selectedAnswers[0] ? this.props.question.selectedAnswers[0].valueString || '' : '');
  }

  answer: string = this.props.question.selectedAnswers[0]
    ? this.props.question.selectedAnswers[0].valueString || ''
    : '';

  render() {
    switch (this.props.question.type) {
      case QuestionnaireItemType.GROUP:
        return (
          <View key={this.props.question.id}>
            <View
              style={[
                this.state.expanded
                  ? styles.viewGroup
                  : [styles.viewGroup, {borderBottomColor: colors.grey, borderBottomWidth: scale(1)}]
              ]}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{paddingRight: scale(10)}}
                onPress={() => {
                  this.setState({expanded: !this.state.expanded});
                }}>
                <View style={{width: scale(TextSize.veryBig), height: scale(TextSize.veryBig)}}>
                  {this.state.expanded ? <IconOpened></IconOpened> : <IconClosed></IconClosed>}
                </View>
              </TouchableOpacity>

              <Text
                style={{
                  fontFamily: AppFonts.bold,
                  fontSize: TextSize.small
                }}>
                {this.props.question.label.de}
              </Text>
            </View>

            {this.props.question.subItems &&
              this.state.expanded &&
              this.props.question.subItems.map((si: IQuestion, i: number) => {
                return (
                  <Question
                    key={i}
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
            <View style={{paddingVertical: scale(5)}}>
              <Text style={{fontFamily: AppFonts.regular, fontSize: TextSize.small, paddingBottom: scale(5)}}>
                {this.props.question.label.de}
              </Text>
              <TextArea
                borderWidth='0'
                borderBottomWidth='1'
                borderBottomColor={colors.grey}
                h={'auto'}
                placeholder={'...'}
                size={'lg'}
                _focus={{borderColor: colors.gold, backgroundColor: colors.white}}
                defaultValue={this.answer}
                keyboardType={'default'}
                autoCorrect={true}
                onChangeText={(text: string) => {
                  this.props.onChangeText(text, this.props.question);
                }}></TextArea>
            </View>
          </NativeBaseProvider>
        );
      case QuestionnaireItemType.DISPLAY:
        return (
          <View>
            <Text>DISPLAY</Text>
          </View>
        );

      default:
        return <Text key={this.props.question.id}>Rendering Question Type {this.props.question.id} not supported</Text>;
    }
  }
}

const styles = StyleSheet.create({
  viewGroup: {
    paddingTop: scale(20),
    paddingBottom: scale(5),
    flexDirection: 'row',
    alignItems: 'center'
  }
});
