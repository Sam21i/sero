import {Formik} from 'formik';
import {Input, NativeBaseProvider} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Modal, Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import LocalesHelper from '../locales';
import {SecurityPlanModule, SECURITY_PLAN_MODULE_TYPE} from '../model/SecurityPlan';
import {activeOpacity, AppFonts, colors, scale, TextSize} from '../styles/App.style';
import AppButton from './AppButton';
import {SvgCss} from 'react-native-svg';
import images from '../resources/images/images';

interface SecurityPlanEditModalProps {
  localesHelper: LocalesHelper;
  onSave: (module?: SecurityPlanModule) => void;
  module: SecurityPlanModule;
}

interface SecurityPlanEditModalState {
  entries: Array<string>;
}

export default class SecurityPlanEditModal extends Component<SecurityPlanEditModalProps, SecurityPlanEditModalState> {
  constructor(props: SecurityPlanEditModalProps) {
    super(props);

    this.state = {
      entries: this.props.module.entries.slice()
    };
  }

  handleSubmit(values: Array<string>) {
    this.props.module.entries = values;
    this.props.onSave(this.props.module);
  }

  render() {
    return (
      <Modal
        animationType='slide'
        presentationStyle='fullScreen'>
        <SafeAreaView
          style={styles.container}
          edges={['top']}>
          <ImageBackground
            source={images.imagesPNG.backgrounds.moodLightOrange}
            resizeMode='cover'
            style={styles.backgroundImage}>
            <View style={styles.topView}>
              <Text style={styles.topViewText}>{this.props.module.title}</Text>
            </View>
            <View style={styles.bottomView}>
              <Formik
                initialValues={{entries: this.state.entries}}
                onSubmit={(values) => this.handleSubmit(values.entries.filter((v) => v !== ''))}>
                {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
                  <NativeBaseProvider>
                    <View style={{flex: 7}}>
                      <ScrollView>
                        <View style={styles.descriptionView}>
                          <Text style={styles.descriptionViewText}>{this.props.module.description}</Text>
                        </View>
                        {this.props.module.type === SECURITY_PLAN_MODULE_TYPE.COPING_STRATEGIES && (
                          <View style={styles.exampleView}>
                            <Text style={styles.exampleViewText}>
                              {this.props.localesHelper.localeString('securityplan.examples.copingStrategies')}
                            </Text>
                          </View>
                        )}
                        {this.props.module.type === SECURITY_PLAN_MODULE_TYPE.DISTRACTION_STRATIES && (
                          <View style={styles.exampleView}>
                            <Text style={styles.exampleViewText}>
                              {this.props.localesHelper.localeString('securityplan.examples.distractionStrategies')}
                            </Text>
                          </View>
                        )}
                        {values.entries.map((entry, index) => (
                          <View
                            key={'input.' + index}
                            style={{
                              flexDirection: 'row',
                              paddingVertical: 5,
                              justifyContent: 'space-around',
                              alignItems: 'center'
                            }}>
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
                              activeOpacity={activeOpacity}
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
                              <SvgCss
                                xml={images.imagesSVG.common.trash}
                                style={styles.icon}
                                width={scale(20)}
                                height={scale(20)}
                              />
                            </TouchableOpacity>
                          </View>
                        ))}
                        <AppButton
                          icon={images.imagesSVG.common.plus}
                          onPress={() => setFieldValue('entries', [...values.entries, ''])}
                          label={this.props.localesHelper.localeString('securityplan.addEntry')}
                          position='left'
                          color={colors.grey}
                          style={styles.addButton}
                        />
                      </ScrollView>
                    </View>
                    <View style={{flex: 3, borderTopColor: colors.linen, borderTopWidth: 10}}>
                      <AppButton
                        label={this.props.localesHelper.localeString('common.ok')}
                        icon={images.imagesSVG.common.ok}
                        position='right'
                        color={colors.tumbleweed}
                        onPress={handleSubmit}
                        style={styles.backButton}
                      />
                      <AppButton
                        label={this.props.localesHelper.localeString('common.cancel')}
                        icon={images.imagesSVG.common.cancel}
                        position='right'
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
    backgroundColor: colors.primary50opac,
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(20),
    paddingVertical: scale(10)
  },
  exampleView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(20),
    paddingVertical: scale(10)
  },
  descriptionViewText: {
    color: colors.black,
    fontFamily: AppFonts.medium,
    fontSize: scale(TextSize.small)
  },
  exampleViewText: {
    color: colors.black,
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall)
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
    width: scale(225),
    marginVertical: scale(10)
  },
  addButton: {
    width: scale(250),
    marginVertical: scale(10)
  },
  icon: {
    padding: 10
  }
});
