import React, {Component} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {connect} from 'react-redux';
import LocalesHelper from '../locales';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale, windowWidth, } from '../styles/App.style';
import CancelButton from '../resources/images/common/cancel.svg';
import CameraButton from '../resources/images/common/camera.svg';
import EmergencyContact from '../model/EmergencyContact';
import { launchImageLibrary} from 'react-native-image-picker'
import DialogPerson from '../resources/images/common/person.svg';

export enum CONTACT_SPEECH_BUBBLE_MODE {
  add = 'ADD',
  delete = 'DELETE',
  edit = 'EDIT',
  menu = "MENU"
};

const MAX_IMAGE_SIZE = 500;

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
      new_given: props.contact ? props.contact.getGivenNameString() : '',
      new_family: props.contact ? props.contact.family : '',
      new_phone: props.contact ? props.contact.phone : '',
      new_image: props.contact ? props.contact.image : undefined,
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
        const type = image.assets[0].type?.replace('jpg', 'jpeg');
        this.setState({
          new_image: {
            contentType: type || '',
            data: type + ';base64,'+ image.assets[0].base64 || ''
          }
        });
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
        <CancelButton width={scale(35)} height={scale(35)} onPress={() => this.props.onClose({mode: this.state.mode})}/>
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
            ? <Image style={styles.cameraButton} source={{uri: 'data:' + this.state.new_image.data}} />
            : <View style={styles.cameraButton}>
              <CameraButton width='100%' height='100%' style={{alignSelf:'center'}}/>
              </View>
          }

        </TouchableOpacity>
        <View style={styles.formInputs}>
        {
          FORM_FIELDS.map(field => {
            return <TextInput key={'input.' + field}
                              style={[styles.input]}
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
          mode: this.state.mode,
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
    const newContact = this.props.contact || new EmergencyContact({});
    newContact.family = newContact?.family + '2';
    return (
      <>
      { this.renderBubbleTitle('contacts.editContact') }
      <View style={styles.formWrapper}>
        <TouchableOpacity onPress={this.pickImage.bind(this)}>
          { this.state.new_image?.data
            ? <Image style={styles.cameraButton} source={{uri: 'data:' + this.state.new_image?.data}} />
            : <View style={styles.cameraButton}>
                <CameraButton width='100%' height='100%' style={{alignSelf:'center'}}/>
              </View>
          }
        </TouchableOpacity>
        <View style={styles.formInputs}>
        {
          FORM_FIELDS.map(field => {
            if(field === 'given'){
              return <TextInput key={'input.' + field}
              style={[styles.input]}
              autoCorrect={false}
              onChangeText={(t) => this.setState({['new_' + field]: t})}
              value={this.state['new_' + field]}
              placeholder={this.state.new_given}
              keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
              />
            } else {
              return <TextInput key={'input.' + field}
              style={[styles.input]}
              autoCorrect={false}
              onChangeText={(t) => this.setState({['new_' + field]: t})}
              value={this.state['new_' + field]}
              placeholder={this.props.contact?.[field]}
              keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
              />
            }
          })
        }
        </View>
      </View>
      <TouchableOpacity onPress={() => this.props.onClose({
          mode: this.state.mode,
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

  renderDeleteForm() {
    return (
      <>
      { this.renderBubbleTitle('contacts.deleteContact') }
            <View style={styles.formWrapper}>
        <TouchableOpacity onPress={this.pickImage.bind(this)}>
          { this.state.new_image
            ? <Image style={styles.cameraButton} source={{uri: 'data:' + this.state.new_image.data}} />
            : <View style={styles.cameraButton}>
              <CameraButton width='100%' height='100%' style={{alignSelf:'center'}}/>
              </View>
          }

        </TouchableOpacity>
        <View style={styles.formInputs}>
        {
          FORM_FIELDS.map(field => {
            if(field === 'given'){
              return <TextInput key={'input.' + field}
              style={[styles.input]}
              autoCorrect={false}
              onChangeText={(t) => this.setState({['new_' + field]: t})}
              value={this.state['new_' + field]}
              placeholder={this.props.contact?.getGivenNameString()}
              keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
              />
            } else {
              return <TextInput key={'input.' + field}
              style={[styles.input]}
              autoCorrect={false}
              onChangeText={(t) => this.setState({['new_' + field]: t})}
              value={this.state['new_' + field]}
              placeholder={this.props.contact?.[field]}
              keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
              />
            }
          })
        }
        </View>
      </View>
      <TouchableOpacity onPress={() => this.props.onClose({
          mode: this.state.mode,
          data: this.props.contact
        })}>
        <View style={styles.formButton}>
          <Text style={styles.formButtonText}> { this.props.localesHelper.localeString('common.save') } </Text>
        </View>
      </TouchableOpacity>
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

  renderArrowRight() {
    return (
      <View style={{position: "absolute", left:scale(125), bottom:0}}>
        <View style={[styles.rightArrow, {
          position:'absolute',
          left: scale(-3),
          borderRightWidth: scale(45),
          borderRightColor: colors.primary,
          borderBottomWidth: scale(50),
          borderBottomColor: 'transparent',
        }]}></View>
        <View style={styles.rightArrow}></View>
      </View>
    )
  }

  renderDialogPerson() {
    return(
      <View style={{position:'absolute', justifyContent:'center', alignContent:'center', width:'100%', marginLeft:scale(57.5)}}>
      <DialogPerson width={80} height={80} style={{position:'absolute', top: 315, alignSelf:'center'}}/>
      </View>
      )
  }

  render() {
    return (
      <View style={styles.bubbleView}>
        { this.renderBubbleContent() }
        { this.renderArrowRight() }
        { this.renderDialogPerson() }
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
    borderRadius: 25,
    width: scale(340),
    height: 248,
    marginLeft: scale(-20),
    marginTop: verticalScale(-25),
    padding: 20,
  },
  rightArrow: {
    position: "absolute",
    borderRightWidth: scale(40),
    borderRightColor: colors.lightGrey,
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',

    borderTopWidth: 0,
    borderTopColor: 'transparent',

    borderBottomWidth: scale(45),
    borderBottomColor: 'transparent',
  },
  titleBar: {
    marginLeft: scale(20),
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  titlebarText: {
    color: colors.primary,
    fontSize: TextSize.normal,
    fontFamily: AppFonts.bold
  },
  actionList: {
    marginVertical: scale(10)
  },
  actionMenuPoint: {
    marginLeft: scale(45),
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionBubble: {
    backgroundColor: colors.white,
    borderWidth: 2,
    marginRight: TextSize.normal,
    borderColor: colors.primary,
    borderRadius: TextSize.big / 2,
    height: TextSize.big,
    width: TextSize.big
  },
  actionText: {
    fontSize: TextSize.small,
    fontFamily: AppFonts.regular
  },
  actionTextWrapper: {
    borderBottomWidth: 2,
    marginTop: TextSize.normal / 1,
    borderBottomColor: colors.veryLightGrey,
    borderBottomStyle: 'solid',
    marginRight: scale(-20),
    flex: 1
  },
  formWrapper: {
    flexDirection: 'row',
    marginTop: scale(10),
    justifyContent:'flex-end',
  },
  formButton: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    height: 2 * TextSize.verySmall,
    borderTopLeftRadius: TextSize.verySmall,
    borderBottomLeftRadius: TextSize.verySmall,
    marginRight: -20,
    marginTop: 5,
  },
  formButtonText: {
    marginHorizontal: 2 * TextSize.verySmall,
    marginTop: 0.4 * TextSize.verySmall,
    fontSize: TextSize.verySmall,
    fontFamily: AppFonts.regular,
    color: colors.white
  },
  formInputs: {
    marginLeft: scale(20),

  },
  input: {
    marginBottom: TextSize.small ,
    fontSize: TextSize.small,
    fontFamily: AppFonts.regular,
    borderBottomColor: colors.veryLightGrey,
    borderBottomWidth: 2,
    borderColor: colors.veryLightGrey,
    marginRight: scale(-20),
    width: scale(220),

    },

  cameraButton: {
    height: scale(66),
    width: scale(66),
    marginLeft: scale(20),
    borderRadius: scale(33),
    backgroundColor: colors.veryLightGrey,
    justifyContent:'center',
    padding:scale(12.5)
  }
});

// Link store data to component:
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
  };
}

export default connect(mapStateToProps, undefined)(ContactSpeechBubble);
