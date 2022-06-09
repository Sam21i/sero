import {Formik} from 'formik';
import {Input, NativeBaseProvider} from 'native-base';
import React, {Component} from 'react';
import {StyleSheet, Modal, Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import LocalesHelper from '../locales';
import {SecurityPlanModule, SECURITY_PLAN_MODULE_TYPE} from '../model/SecurityPlan';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';
import AppButton from './AppButton';
import TrashIcon from '../resources/images/icons/icon_trash.svg';
import AddIcon from '../resources/images/icons/securityplan/icon_add.svg';

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
            source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
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
                        <AppButton
                          icon='<?xml version="1.0" encoding="iso-8859-1"?> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <g> <path fill="#fff" d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341 c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659S472.341,136.705,472.341,256S375.295,472.341,256,472.341z " /> </g> </g> <g> <g> <path fill="#fff" d="M355.148,234.386H275.83v-79.318c0-10.946-8.864-19.83-19.83-19.83s-19.83,8.884-19.83,19.83v79.318h-79.318 c-10.966,0-19.83,8.884-19.83,19.83s8.864,19.83,19.83,19.83h79.318v79.318c0,10.946,8.864,19.83,19.83,19.83 s19.83-8.884,19.83-19.83v-79.318h79.318c10.966,0,19.83-8.884,19.83-19.83S366.114,234.386,355.148,234.386z" /> </g> </g> </svg>'
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
                        icon={
                          '<?xml version="1.0" encoding="iso-8859-1"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 305.002 305.002" style="enable-background:new 0 0 305.002 305.002;" xml:space="preserve"> <g> <g> <path fill="#FFFFFF" d="M152.502,0.001C68.412,0.001,0,68.412,0,152.501s68.412,152.5,152.502,152.5c84.089,0,152.5-68.411,152.5-152.5 S236.591,0.001,152.502,0.001z M152.502,280.001C82.197,280.001,25,222.806,25,152.501c0-70.304,57.197-127.5,127.502-127.5 c70.304,0,127.5,57.196,127.5,127.5C280.002,222.806,222.806,280.001,152.502,280.001z"/> <path fill="#FFFFFF" d="M218.473,93.97l-90.546,90.547l-41.398-41.398c-4.882-4.881-12.796-4.881-17.678,0c-4.881,4.882-4.881,12.796,0,17.678 l50.237,50.237c2.441,2.44,5.64,3.661,8.839,3.661c3.199,0,6.398-1.221,8.839-3.661l99.385-99.385 c4.881-4.882,4.881-12.796,0-17.678C231.269,89.089,223.354,89.089,218.473,93.97z"/> </g> </g></svg>'
                        }
                        position='right'
                        color={colors.tumbleweed}
                        onPress={handleSubmit}
                        style={styles.backButton}
                      />
                      <AppButton
                        label={this.props.localesHelper.localeString('common.cancel')}
                        icon={
                          '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 37.5 37.5"><defs><style>.cls-1,.cls-3{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{stroke:#fff;stroke-width:2.5px;}.cls-4{clip-path:url(#clip-path-2);}</style><clipPath id="clip-path" transform="translate(0 0)"><path class="cls-1" d="M1.25,18.75a17.5,17.5,0,1,0,17.5-17.5,17.51,17.51,0,0,0-17.5,17.5"/></clipPath><clipPath id="clip-path-2" transform="translate(0 0)"><rect class="cls-1" width="37.5" height="37.5"/></clipPath></defs><g class="cls-2"><line class="cls-3" x1="11.25" y1="11.25" x2="26.25" y2="26.25"/><line class="cls-3" x1="26.25" y1="11.25" x2="11.25" y2="26.25"/></g><g class="cls-4"><circle class="cls-3" cx="18.75" cy="18.75" r="17.5"/></g></svg>'
                        }
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
