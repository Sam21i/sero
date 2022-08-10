import {Formik} from 'formik';
import {Input, NativeBaseProvider} from 'native-base';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';

import {SECURITY_PLAN_MODULE_TYPE, SecurityPlanModule} from '../model/SecurityPlan';
import images from '../resources/images/images';
import {activeOpacity, AppFonts, colors, scale, TextSize} from '../styles/App.style';
import AppButton from './AppButton';

interface SecurityPlanEditModalProps extends WithTranslation {
  onSave: (module?: SecurityPlanModule) => void;
  module: SecurityPlanModule;
}

interface SecurityPlanEditModalState {
  entries: Array<string>;
}

class SecurityPlanEditModal extends Component<SecurityPlanEditModalProps, SecurityPlanEditModalState> {
  flatListRef: any;
  formikRef: React.RefObject<unknown>;

  constructor(props: SecurityPlanEditModalProps) {
    super(props);
    this.formikRef = React.createRef();

    const entries = this.props.module.entries.slice();
    entries.push('');

    this.state = {
      entries: entries
    };
  }

  handleSubmit(values: Array<string>) {
    this.props.module.entries = values;
    this.props.onSave(this.props.module);
  }

  triggerFormSubmit = () => {
    if (this.formikRef.current) this.formikRef.current.handleSubmit();
  };

  render() {
    return (
      <Modal
        animationType='slide'
        presentationStyle='pageSheet'>
        <SafeAreaView
          style={styles.container}
          edges={['top']}>
          <ImageBackground
            source={images.imagesPNG.backgrounds.moodLightOrange}
            resizeMode='cover'
            style={styles.backgroundImage}>
            <View style={styles.topView}>
              <Text
                style={{
                  fontFamily: AppFonts.regular,
                  fontSize: scale(TextSize.verySmall),
                  color: colors.white
                }}
                onPress={() => {
                  this.props.onSave(this.props.module);
                }}>
                Abbrechen
              </Text>
              <Text
                style={{
                  fontFamily: AppFonts.medium,
                  fontSize: scale(TextSize.verySmall),
                  color: colors.white
                }}
                onPress={() => {
                  this.triggerFormSubmit();
                }}>
                Fertig
              </Text>
            </View>
            <View style={styles.bottomView}>
              <Formik
                innerRef={this.formikRef}
                initialValues={{entries: this.state.entries}}
                onSubmit={(values) => this.handleSubmit(values.entries.filter((v) => v !== ''))}>
                {({handleChange, handleBlur, handleSubmit, values, setFieldValue}) => (
                  <NativeBaseProvider>
                    <View style={{flex: 7}}>
                      <ScrollView
                        ref={(ref) => {
                          this.flatListRef = ref;
                        }}
                        onContentSizeChange={() => {
                          this.flatListRef.scrollToEnd();
                        }}>
                        <View style={styles.descriptionView}>
                          <Text style={styles.descriptionViewTitleText}>{this.props.module.title}</Text>

                          <Text style={styles.descriptionViewDescr}>{this.props.module.description}</Text>
                        </View>
                        {this.props.module.type === SECURITY_PLAN_MODULE_TYPE.COPING_STRATEGIES && (
                          <View style={styles.exampleView}>
                            <Text style={styles.exampleViewText}>
                              {this.props.t('securityplan.examples.copingStrategies')}
                            </Text>
                          </View>
                        )}
                        {this.props.module.type === SECURITY_PLAN_MODULE_TYPE.DISTRACTION_STRATIES && (
                          <View style={styles.exampleView}>
                            <Text style={styles.exampleViewText}>
                              {this.props.t('securityplan.examples.distractionStrategies')}
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
                              _focus={{
                                borderColor: colors.primary,
                                backgroundColor: colors.white
                              }}
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
                        <View>
                          <View
                            style={{
                              flexDirection: 'row',
                              padding: 10,
                              justifyContent: 'flex-end',
                              alignItems: 'flex-end'
                            }}>
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
                              onPress={() => setFieldValue('entries', [...values.entries, ''])}>
                              <SvgCss
                                xml={images.imagesSVG.securityplan.add}
                                style={styles.icon}
                                width={scale(20)}
                                height={scale(20)}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </ScrollView>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: scale(10)
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small)
  },
  descriptionView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(20)
  },
  descriptionViewTitleText: {
    color: colors.black,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big),
    paddingVertical: scale(20)
  },
  descriptionViewDescr: {
    color: colors.black,
    fontFamily: AppFonts.medium,
    fontSize: scale(TextSize.small),
    paddingBottom: scale(20)
  },
  exampleView: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: scale(20),
    paddingBottom: scale(20)
  },
  exampleViewText: {
    color: colors.black,
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall)
  },

  bottomView: {
    flex: 12,
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

export default withTranslation()(SecurityPlanEditModal);
