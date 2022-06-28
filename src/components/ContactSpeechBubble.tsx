import {Formik} from 'formik';
import {FormControl, Input, NativeBaseProvider,VStack} from 'native-base';
import React, {Component} from 'react';
import {Image, Platform,StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';
import * as yup from 'yup';

import LocalesHelper from '../locales';
import EmergencyContact from '../model/EmergencyContact';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {activeOpacity, AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import SpeechBubble from './SpeechBubble';

export enum CONTACT_SPEECH_BUBBLE_MODE {
  import = 'IMPORT',
  add = 'ADD',
  delete = 'DELETE',
  edit = 'EDIT',
  menu = 'MENU'
}

const MAX_IMAGE_SIZE = 500;

const REGEX = {
  given:
    /^[^ ][a-zA-ZàáâäãåąæāčćęèéêëėīįìíîïlłńōoòóôöõøùúûūüųūÿýżźñçčśšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
  phone:
    /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b|\b(143|144|117|118|1414|145|112)\b/, // temporarily added 143|144|117|118|1414|145|112 emergency numbers to phone regex
  family:
    /^[^ ][a-zA-ZàáâäãåąæāčćęèéêëėīįìíîïlłńōoòóôöõøùúûūüųūÿýżźñçčśšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
};

const MENU_ACTIONS = [
  {name: 'importContact', mode: CONTACT_SPEECH_BUBBLE_MODE.import},
  {name: 'addContact', mode: CONTACT_SPEECH_BUBBLE_MODE.add},
  {name: 'editContact', mode: CONTACT_SPEECH_BUBBLE_MODE.edit},
  {name: 'deleteContact', mode: CONTACT_SPEECH_BUBBLE_MODE.delete}
];

const FORM_FIELDS = ['given', 'family', 'phone'];

interface ContactSpeechBubbleProps {
  mode: CONTACT_SPEECH_BUBBLE_MODE;
  onClose: (arg: {mode: CONTACT_SPEECH_BUBBLE_MODE; data?: EmergencyContact}) => void;
  localesHelper: LocalesHelper;
  onModeSelect?: (mode: CONTACT_SPEECH_BUBBLE_MODE) => void;
  showImport?: boolean;
  contact?: EmergencyContact;
}

interface ContactSpeechBubbleState {
  mode: CONTACT_SPEECH_BUBBLE_MODE;
  new_given: string;
  new_family: string;
  new_phone: string;
  new_image?: {
    contentType: string;
    data: string;
  };
}

class ContactSpeechBubble extends Component<ContactSpeechBubbleProps, ContactSpeechBubbleState> {
  constructor(props: ContactSpeechBubbleProps) {
    super(props);
    this.state = {
      new_given: props.contact ? props.contact.getGivenNameString() : '',
      new_family: props.contact ? props.contact.family : '',
      new_phone: props.contact ? props.contact.phone : '',
      new_image: props.contact ? props.contact.image : undefined,
      mode: this.props.mode
    };
  }

  selectMode(_mode: CONTACT_SPEECH_BUBBLE_MODE): void {
    this.props.onModeSelect && this.props.onModeSelect(_mode);
    if (
      (_mode === CONTACT_SPEECH_BUBBLE_MODE.import ||
        _mode === CONTACT_SPEECH_BUBBLE_MODE.edit ||
        _mode === CONTACT_SPEECH_BUBBLE_MODE.delete) &&
      this.props.contact === undefined
    ) {
      this.props.onClose({
        mode: _mode,
        data: undefined
      });
    }
    if (_mode === CONTACT_SPEECH_BUBBLE_MODE.add && this.props.contact === undefined) {
      this.setState({mode: _mode});
    }
  }

  pickImage() {
    launchImageLibrary({
      mediaType: 'photo',
      maxWidth: MAX_IMAGE_SIZE,
      maxHeight: MAX_IMAGE_SIZE,
      includeBase64: true
    })
      .then((image) => {
        if (!image.didCancel && image.assets && image.assets.length > 0) {
          const type = image.assets[0].type?.replace('jpg', 'jpeg');
          this.setState({
            new_image: {
              contentType: type || '',
              data: type + ';base64,' + image.assets[0].base64 || ''
            }
          });
        }
      })
      .catch((e) => {
        console.log('Error picking image', e);
      });
  }

  onSubmit(values: any): void {
    if (this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.add) {
      this.props.onClose({
        mode: this.state.mode,
        data: new EmergencyContact({
          given: [values.given],
          family: values.family,
          phone: values.phone,
          image: this.state.new_image
        })
      });
    } else if (this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.edit) {
      const contact = this.props.contact;
      if (contact) {
        contact.setGivenName(values.given);
        contact.setFamilyName(values.family);
        contact.setPhone(values.phone);
        if (this.state.new_image) contact.setImage(this.state.new_image);
        this.props.onClose({mode: this.state.mode, data: contact});
      }
    } else if (this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete) {
      this.props.onClose({mode: this.state.mode, data: this.props.contact});
    } else if (this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.import) {
      this.props.onClose({
        mode: this.state.mode,
        data: new EmergencyContact({
          given: [values.given],
          family: values.family,
          phone: values.phone,
          image: this.state.new_image
        })
      });
    }
  }

  renderBubbleTitle(_translateString: string) {
    return (
      <View style={styles.titleBar}>
        <Text style={styles.titlebarText}>{this.props.localesHelper.localeString(_translateString)}</Text>
        <SvgCss
          xml={images.imagesSVG.common.cancelGrey}
          width={scale(35)}
          height={scale(35)}
          onPress={() => this.props.onClose({mode: this.state.mode})}
        />
      </View>
    );
  }

  renderMenu() {
    return (
      <>
        {this.renderBubbleTitle('contacts.bubbleTitle')}
        <View style={styles.actionList}>
          {MENU_ACTIONS.map((action, index) => {
            if (!(!this.props.showImport && action.name === 'importContact')) {
              return (
                <TouchableWithoutFeedback
                  onPress={() => this.selectMode(action.mode)}
                  key={'menu_' + index}>
                  <View
                    style={styles.actionMenuPoint}
                    key={'action_' + index}>
                    <View style={styles.actionBubble}></View>
                    <View style={styles.actionTextWrapper}>
                      <Text style={styles.actionText}>
                        {this.props.localesHelper.localeString('contacts.' + action.name)}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              );
            }
          })}
        </View>
      </>
    );
  }

  renderForm() {
    return (
      <>
        {this.renderBubbleTitle('contacts.' + this.state.mode.toLowerCase() + 'Contact')}
        <Formik
          initialValues={{
            given: this.state.new_given,
            family: this.state.new_family,
            phone: this.state.new_phone
          }}
          onSubmit={this.onSubmit.bind(this)}
          validationSchema={yup.object().shape(
            {
              given: yup.string().when('family', {
                is: (family) => !family || family.length === 0,
                then: yup
                  .string()
                  .matches(REGEX.given, this.props.localesHelper.localeString('contacts.err.given.invalid'))
                  .required(this.props.localesHelper.localeString('contacts.err.given.required')),
                otherwise: yup
                  .string()
                  .matches(REGEX.given, this.props.localesHelper.localeString('contacts.err.given.invalid'))
              }),
              family: yup.string().when('given', {
                is: (given) => !given || given.length === 0,
                then: yup
                  .string()
                  .matches(REGEX.given, this.props.localesHelper.localeString('contacts.err.family.invalid'))
                  .required(this.props.localesHelper.localeString('contacts.err.family.required')),
                otherwise: yup
                  .string()
                  .matches(REGEX.given, this.props.localesHelper.localeString('contacts.err.family.invalid'))
              }),
              phone: yup
                .string()
                .matches(REGEX.phone, this.props.localesHelper.localeString('contacts.err.phone.invalid'))
                .required(this.props.localesHelper.localeString('contacts.err.phone.required'))
            },
            ['family', 'given']
          )}>
          {({values, handleChange, handleBlur, errors, touched, handleSubmit}) => (
            <NativeBaseProvider>
              <View style={styles.formWrapper}>
                <TouchableOpacity
                  activeOpacity={activeOpacity}
                  disabled={this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete}
                  onPress={this.pickImage.bind(this)}>
                  {this.renderProfilePictureButton()}
                </TouchableOpacity>
                <VStack width={'70%'}>
                  <View style={styles.formInputs}>
                    {FORM_FIELDS.map((field) => {
                      return (
                        <FormControl
                          isInvalid={field in errors}
                          key={'input-' + field}>
                          <Input
                            isReadOnly={this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete}
                            key={'input.' + field}
                            borderColor={colors.veryLightGrey}
                            _focus={errors[field] ? {borderColor: colors.warning} : {borderColor: colors.primary}}
                            variant='underlined'
                            size='xl'
                            onBlur={handleBlur(field)}
                            placeholder={this.props.localesHelper.localeString('common.' + field)}
                            onChangeText={handleChange(field)}
                            value={values[field]}
                            keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                            autoCorrect={false}
                            _invalid={
                              errors[field] && touched[field]
                                ? {borderColor: colors.warning}
                                : {borderColor: colors.veryLightGrey}
                            }
                          />
                          {errors[field] && touched[field] && (
                            <FormControl.ErrorMessage
                              fontFamily={AppFonts.bold}
                              fontSize={TextSize.verySmall}>
                              {errors[field]}
                            </FormControl.ErrorMessage>
                          )}
                        </FormControl>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    activeOpacity={activeOpacity}
                    onPress={handleSubmit}>
                    <View style={styles.formButton}>
                      <Text style={styles.formButtonText}>
                        {this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.import ||
                        this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.add ||
                        this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.edit
                          ? this.props.localesHelper.localeString('common.save')
                          : this.props.localesHelper.localeString('common.delete')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </VStack>
              </View>
            </NativeBaseProvider>
          )}
        </Formik>
      </>
    );
  }

  renderProfilePictureButton() {
    switch (this.state.mode) {
      case CONTACT_SPEECH_BUBBLE_MODE.import: {
        return this.state.new_image ? (
          <View style={{alignItems: 'center'}}>
            <Image
              style={styles.cameraButton}
              source={{uri: 'data:' + this.state.new_image?.data}}
            />
            <SvgCss
              xml={images.imagesSVG.common.camera}
              width={scale(20)}
              height={scale(20)}
              style={{position: 'absolute', bottom: 0, right: scale(-2)}}
            />
          </View>
        ) : (
          <View style={[styles.listItemInitials, {backgroundColor: this.props.contact?.getUniqueColor()}]}>
            <SvgCss
              xml={images.imagesSVG.common.camera}
              width={scale(20)}
              height={scale(20)}
              style={{position: 'absolute', bottom: 0, right: scale(-2)}}
            />
            <Text style={styles.listItemInitialsText}>{this.props.contact?.getInitials() || ''}</Text>
          </View>
        );
      }
      case CONTACT_SPEECH_BUBBLE_MODE.add: {
        return this.state.new_image ? (
          <Image
            style={styles.cameraButton}
            source={{uri: 'data:' + this.state.new_image.data}}
          />
        ) : (
          <View style={styles.cameraButton}>
            <SvgCss
              xml={images.imagesSVG.common.camera}
              width='100%'
              height='100%'
              style={{alignSelf: 'center'}}
            />
          </View>
        );
      }
      case CONTACT_SPEECH_BUBBLE_MODE.edit: {
        return this.state.new_image?.data ? (
          <View style={{alignItems: 'center'}}>
            <Image
              style={styles.cameraButton}
              source={{uri: 'data:' + this.state.new_image?.data}}
            />
            <SvgCss
              xml={images.imagesSVG.common.camera}
              width={scale(20)}
              height={scale(20)}
              style={{position: 'absolute', bottom: 0, right: scale(-2)}}
            />
          </View>
        ) : (
          <View style={styles.cameraButton}>
            <SvgCss
              xml={images.imagesSVG.common.camera}
              width='100%'
              height='100%'
              style={{alignSelf: 'center'}}
            />
          </View>
        );
      }
      case CONTACT_SPEECH_BUBBLE_MODE.delete: {
        return this.state.new_image ? (
          <Image
            style={styles.cameraButton}
            source={{uri: 'data:' + this.state.new_image.data}}
          />
        ) : (
          <View style={[styles.listItemInitials, {backgroundColor: this.props.contact?.getUniqueColor()}]}>
            <Text style={styles.listItemInitialsText}>{this.props.contact?.getInitials() || ''}</Text>
          </View>
        );
      }
    }
  }

  renderBubbleContent() {
    return this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.menu ? this.renderMenu() : this.renderForm();
  }

  renderIcon() {
    return (
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignContent: 'center',
          width: '100%',
          marginLeft: scale(57.5)
        }}>
        <SvgCss
          xml={images.imagesSVG.common.person}
          width={80}
          height={80}
          style={{position: 'absolute', top: 315, alignSelf: 'center'}}
        />
      </View>
    );
  }

  render() {
    return (
      <SpeechBubble
        bubbleContent={this.renderBubbleContent()}
        stylingOptions={{
          general: {
            position: {
              top: -25,
              left: -25
            },
            width: scale(337.5)
          },
          arrow: {
            position: {
              left: verticalScale(140),
              bottom: 0
            },
            size: 30
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  titleBar: {
    paddingVertical: scale(10),
    paddingLeft: scale(40),
    paddingRight: scale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titlebarText: {
    color: colors.primary,
    fontSize: scale(TextSize.normal),
    fontFamily: AppFonts.bold
  },
  actionList: {
    marginBottom: scale(30)
  },
  actionMenuPoint: {
    marginLeft: scale(45),
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionBubble: {
    backgroundColor: colors.white,
    borderWidth: 2,
    marginRight: scale(TextSize.normal),
    borderColor: colors.primary,
    borderRadius: scale(TextSize.big) / 2,
    height: scale(TextSize.big),
    width: scale(TextSize.big)
  },
  actionText: {
    fontSize: scale(TextSize.small),
    fontFamily: AppFonts.regular
  },
  actionTextWrapper: {
    borderBottomWidth: 2,
    marginTop: scale(TextSize.normal) / 1,
    borderBottomColor: colors.veryLightGrey,
    borderBottomStyle: 'solid',
    marginRight: Platform.OS === 'ios' ? scale(-10) : scale(-8.5),
    flex: 1
  },
  formWrapper: {
    marginTop: scale(10),
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  formButton: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    height: 2 * scale(TextSize.verySmall),
    borderTopLeftRadius: scale(TextSize.verySmall),
    borderBottomLeftRadius: scale(TextSize.verySmall),
    marginRight: scale(-10),
    marginTop: scale(TextSize.verySmall),
    marginBottom: scale(TextSize.verySmall),
    justifyContent: 'center',
    alignItems: 'center'
  },
  formButtonText: {
    paddingHorizontal: scale(TextSize.verySmall),
    fontSize: scale(TextSize.verySmall),
    fontFamily: AppFonts.regular,
    color: colors.white
  },
  formInputs: {
    marginLeft: scale(20),
    marginRight: scale(-10)
  },
  cameraButton: {
    height: scale(66),
    width: scale(66),
    marginLeft: scale(20),
    borderRadius: scale(33),
    backgroundColor: colors.veryLightGrey,
    justifyContent: 'center',
    padding: scale(12.5)
  },
  listItemInitials: {
    borderRadius: 2 * scale(TextSize.small),
    height: 4 * scale(TextSize.small),
    width: 4 * scale(TextSize.small)
  },
  listItemInitialsText: {
    fontFamily: AppFonts.regular,
    fontSize: 1.8 * scale(TextSize.small),
    alignSelf: 'center',
    marginTop: 0.9 * scale(TextSize.small),
    color: colors.white
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore
  };
}

export default connect(mapStateToProps, undefined)(ContactSpeechBubble);
