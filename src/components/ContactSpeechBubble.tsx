import React, {Component} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, } from '../styles/App.style';
import CancelButton from '../resources/images/common/cancel.svg';
import CameraButton from '../resources/images/common/camera.svg';
import EmergencyContact from '../model/EmergencyContact';
import { launchImageLibrary} from 'react-native-image-picker'

export enum CONTACT_SPEECH_BUBBLE_MODE {
  add = 'ADD',
  delete = 'DELETE',
  edit = 'EDIT',
  menu = "MENU"
};

const MAX_IMAGE_SIZE: 600;

const MENU_ACTIONS = [
  { name: 'addContact' , mode: CONTACT_SPEECH_BUBBLE_MODE.add },
  { name: 'editContact' , mode: CONTACT_SPEECH_BUBBLE_MODE.edit },
  { name: 'deleteContact' , mode: CONTACT_SPEECH_BUBBLE_MODE.delete }
];

const FORM_FIELDS = ['given', 'family', 'phone'];

interface ContactSpeechBubbleProps {
  mode: CONTACT_SPEECH_BUBBLE_MODE;
  onClose: (arg: {mode: CONTACT_SPEECH_BUBBLE_MODE, data?: EmergencyContact}) => void;
  localesHelper: LocalesHelper;
  contact?: EmergencyContact;
};

interface ContactSpeechBubbleState {
  mode: CONTACT_SPEECH_BUBBLE_MODE,
  new_given: string,
  new_family: string,
  new_phone: string,
  new_image?: {
    contentType: string;
    data: string;
  }
};

class ContactSpeechBubble extends Component<ContactSpeechBubbleProps, ContactSpeechBubbleState> {
  constructor(props: ContactSpeechBubbleProps) {
    super(props);
    this.state = {
      new_given: '',
      new_family: '',
      new_phone: '',
      mode:  this.props.mode
    };
  }

  selectMode(_mode: CONTACT_SPEECH_BUBBLE_MODE): void {
    if ((_mode === CONTACT_SPEECH_BUBBLE_MODE.edit || _mode === CONTACT_SPEECH_BUBBLE_MODE.delete) && this.props.contact === undefined) {
      this.props.onClose({
        mode: _mode,
        data: undefined
      });
    }

    this.setState({mode: _mode});
  }

  pickImage() {
    launchImageLibrary({
      mediaType: 'photo',
      maxWidth: MAX_IMAGE_SIZE,
      maxHeight: MAX_IMAGE_SIZE,
      includeBase64: true
    })
    .then(image => {
      if (!image.didCancel && image.assets && image.assets.length > 0) {
        this.setState({
          new_image: {
            contentType: image.assets[0].type || '',
            data: image.assets[0].base64 || ''
          }
        });
        console.log(this.state)
      }
    })
    .catch(e => {
      console.log('Error picking image', e);
    });
  }

  renderBubbleTitle(_translateString: string) {
    return (
      <View style={styles.titleBar}>
        <Text style={styles.titlebarText}>
          { this.props.localesHelper.localeString(_translateString) }
        </Text>
        <CancelButton width={scale(30)} height={scale(30)} onPress={() => this.props.onClose({mode: this.state.mode})}/>
      </View>
    );
  }

  renderMenu() {
    return (
      <>
        { this.renderBubbleTitle('contacts.bubbleTitle') }
        <View style={styles.actionList}>
          {
            MENU_ACTIONS.map(action => {
              return (
                <TouchableWithoutFeedback onPress={() => this.selectMode(action.mode)} key={'menu.' + action.name}>
                  <View style={styles.actionMenuPoint} key={'action_' + action.name}>
                    <View style={styles.actionBubble}></View>
                    <View style={styles.actionTextWrapper}>
                      <Text style={styles.actionText}>
                        { this.props.localesHelper.localeString('contacts.' + action.name) }
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              )
            })
          }
        </View>
      </>
    );
  }

  renderAddForm() {
    return (
      <>
      { this.renderBubbleTitle('contacts.addContact') }
      <View style={styles.formWrapper}>
        <TouchableOpacity onPress={this.pickImage.bind(this)}>
          { this.state.new_image
            ? <Image style={styles.cameraButton} source={{uri: 'data:' + this.state.new_image.contentType + ';base64,'+ this.state.new_image.data}} />
            : <View style={styles.cameraButton} >
              </View>
          }

        </TouchableOpacity>
        <View style={styles.formInputs}>
        {
          FORM_FIELDS.map(field => {
            return <TextInput key={'input.' + field}
                              style={styles.input}
                              autoCorrect={false}
                              onChangeText={(t) => this.setState({['new_' + field]: t})}
                              value={this.state['new_' + field]}
                              placeholder={this.props.localesHelper.localeString('common.' +field)}
                              keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
            />
          })
        }
        </View>
      </View>
      <TouchableOpacity onPress={() => this.props.onClose({
          mode: this.props.mode,
          data: new EmergencyContact({
            given: [this.state.new_given],
            family: this.state.new_family,
            phone: this.state.new_phone,
            image: this.state.new_image
          })
        })}>
        <View style={styles.formButton}>
          <Text style={styles.formButtonText}> { this.props.localesHelper.localeString('common.save') } </Text>
        </View>
      </TouchableOpacity>
      </>
    );
  }

  renderEditForm() {
    return (
      <>
      { this.renderBubbleTitle('contacts.editContact') }
      <Text>TODO: Edit Form ({ this.props.contact?.getNameString() })</Text>
      </>
    );
  }

  renderDeleteForm() {
    return (
      <>
      { this.renderBubbleTitle('contacts.deleteContact') }
      <Text>TODO: Delete Form ({ this.props.contact?.getNameString() })</Text>
      </>
    );
  }

  renderBubbleContent() {
    switch (this.state.mode) {
      case CONTACT_SPEECH_BUBBLE_MODE.menu:
        return this.renderMenu();
      case CONTACT_SPEECH_BUBBLE_MODE.add:
        return this.renderAddForm();
      case CONTACT_SPEECH_BUBBLE_MODE.edit:
        return this.renderEditForm();
      case CONTACT_SPEECH_BUBBLE_MODE.delete:
        return this.renderDeleteForm();
    }
  }

  render() {
    return (
      <View style={styles.bubbleView}>
        { this.renderBubbleContent() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bubbleView: {
    backgroundColor: colors.lightGrey,
    borderColor: colors.primary,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 15,
    width: '90%',
    marginLeft: -15,
    marginTop: -10,
    padding: 20
  },
  titleBar: {
    marginLeft: scale(10),
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  titlebarText: {
    color: colors.primary,
    fontSize: TextSize.normalPlus,
    fontFamily: AppFonts.bold
  },
  actionList: {
    flexDirection: 'column',
    marginVertical: scale(10)
  },
  actionMenuPoint: {
    marginLeft: scale(30),
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionBubble: {
    backgroundColor: colors.white,
    borderWidth: 2,
    marginRight: TextSize.normal,
    borderColor: colors.primary,
    borderRadius: TextSize.normalPlus / 2,
    height: TextSize.normalPlus,
    width: TextSize.normalPlus
  },
  actionText: {
    fontSize: TextSize.normal,
    fontFamily: AppFonts.regular
  },
  actionTextWrapper: {
    borderBottomWidth: 1,
    marginTop: TextSize.normal / 2,
    borderBottomColor: colors.grey,
    borderBottomStyle: 'solid',
    marginRight: -20,
    flex: 1
  },
  formWrapper: {
    flexDirection: 'row',
    marginVertical: scale(20)
  },
  formButton: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    height: 2 * TextSize.verySmall,
    borderTopLeftRadius: TextSize.verySmall,
    borderBottomLeftRadius: TextSize.verySmall,
    marginTop: scale(20),
    marginRight: -20,
  },
  formButtonText: {
    marginHorizontal: 2 * TextSize.verySmall,
    marginTop: 0.4 * TextSize.verySmall,
    fontSize: TextSize.verySmall,
    fontFamily: AppFonts.regular,
    color: colors.white
  },
  formInputs: {
    marginLeft: scale(20)

  },
  input: {

    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    marginBottom: 2,
    fontSize: TextSize.small,
    fontFamily: AppFonts.regular
  },
  cameraButton: {
    height: scale(50),
    width: scale(50),
    marginLeft: scale(20),
    borderRadius: scale(25),
    backgroundColor: colors.grey,
  }
});

// Link store data to component:
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
  };
}

export default connect(mapStateToProps, undefined)(ContactSpeechBubble);
