import {Formik} from 'formik';
import {Input, NativeBaseProvider} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Modal, Text, View, Button, TextInput, ImageBackground} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import LocalesHelper from '../locales';
import {SecurityPlanModule} from '../model/SecurityPlan';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';
import AppButton from './AppButton';
import TrashIcon from '../resources/images/icons/icon_trash.svg';

interface SecurityPlanEditModalProps {
  localesHelper: LocalesHelper;
  onSave: (module?: SecurityPlanModule) => void;
  module: SecurityPlanModule;
}

interface SecurityPlanEditModalState {
  editedModule: SecurityPlanModule;
  entries: Array<string>;
}

export default class SecurityPlanEditModal extends Component<SecurityPlanEditModalProps, SecurityPlanEditModalState> {
  constructor(props: SecurityPlanEditModalProps) {
    super(props);

    this.state = {
      entries: this.props.module.entries.slice(),
      editedModule: Object.assign({}, {...this.props.module})
    };
  }

  handleSubmit(values: Array<string>) {
    this.setState(
      {
        editedModule: {
          ...this.state.editedModule,
          entries: values.entries.filter((entry: string) => {
            return entry != '';
          })
        }
      },
      () => {
        this.props.onSave(this.state.editedModule);
      }
    );
  }

  render() {
    return (
      <Modal
        animationType="slide"
        presentationStyle="fullScreen">
        <SafeAreaView
          style={styles.container}
          edges={['top']}>
          <ImageBackground
            source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
            resizeMode="cover"
            style={styles.backgroundImage}>
            <View style={styles.topView}>
              <Text style={styles.topViewText}>{this.props.module.title}</Text>
            </View>
            <View style={styles.bottomView}>
              <Formik
                initialValues={{entries: this.state.entries}}
                onSubmit={(values) => this.handleSubmit(values)}>
                {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
                  <NativeBaseProvider>
                    <View style={{flex: 7}}>
                      <ScrollView>
                        <View style={styles.descriptionView}>
                          <Text style={styles.descriptionViewText}>{this.props.module.description}</Text>
                        </View>
                        {values.entries.map((entry, index) => (
                          <View
                            key={'input.' + index}
                            style={{flexDirection: 'row', paddingVertical: 5, justifyContent: 'space-around', alignItems: 'center'}}>
                            <Input
                              onChangeText={handleChange(`entries[${index}]`)}
                              value={values.entries[index]}
                              size={'lg'}
                              width={'80%'}
                              onBlur={handleBlur(`entries[${index}]`)}
                              _focus={{borderColor: colors.primary, backgroundColor: colors.white}}
                              style={{backgroundColor: colors.white}}
                            />
                            <TouchableOpacity
                              style={{
                                borderWidth: 1,
                                borderColor: colors.veryLightGrey,
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: scale(40),
                                height: scale(40),
                                backgroundColor: colors.white,
                                borderRadius: scale(5)
                              }}
                              onPress={() => {
                                values.entries.splice(index, 1);
                                setFieldValue('entries', values.entries);
                              }}>
                              <TrashIcon
                                style={styles.icon}
                                width={scale(20)}
                                height={scale(20)}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                        <Button
                          onPress={() => setFieldValue('entries', [...values.entries, ''])}
                          title={'+ ' + 'Eintrag hinzufügen'}
                        />
                      </ScrollView>
                    </View>
                    <View style={{flex: 3, borderTopColor: colors.linen, borderTopWidth: 10}}>
                      <AppButton
                        label={this.props.localesHelper.localeString('common.back')}
                        icon={
                          '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
                        }
                        position="right"
                        color={colors.tumbleweed}
                        onPress={handleSubmit}
                        style={styles.backButton}
                      />
                      <AppButton
                        label={this.props.localesHelper.localeString('common.cancel')}
                        icon={
                          '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 37.5 37.5"><defs><style>.cls-1,.cls-3{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{stroke:#fff;stroke-width:2.5px;}.cls-4{clip-path:url(#clip-path-2);}</style><clipPath id="clip-path" transform="translate(0 0)"><path class="cls-1" d="M1.25,18.75a17.5,17.5,0,1,0,17.5-17.5,17.51,17.51,0,0,0-17.5,17.5"/></clipPath><clipPath id="clip-path-2" transform="translate(0 0)"><rect class="cls-1" width="37.5" height="37.5"/></clipPath></defs><g class="cls-2"><line class="cls-3" x1="11.25" y1="11.25" x2="26.25" y2="26.25"/><line class="cls-3" x1="26.25" y1="11.25" x2="11.25" y2="26.25"/></g><g class="cls-4"><circle class="cls-3" cx="18.75" cy="18.75" r="17.5"/></g></svg>'
                        }
                        position="right"
                        color={colors.tumbleweed}
                        onPress={() => {
                          this.props.onSave(this.props.module);
                        }}
                        style={styles.backButton}
                      />
                    </View>
                  </NativeBaseProvider>
                )}
              </Formik>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  topView: {
    backgroundColor: 'rgba(203, 95, 11, 0.5)',
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  descriptionView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  descriptionViewText: {
    color: colors.black,
    fontFamily: AppFonts.medium,
    fontSize: scale(TextSize.small)
  },
  bottomView: {
    flex: 10,
    backgroundColor: colors.linen
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  backButton: {
    height: scale(50),
    width: scale(200),
    paddingVertical: scale(10),
    marginVertical: scale(10)
  },
  icon: {
    padding: 10
  }
});
