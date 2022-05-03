import React, {Component} from 'react';
import {Text, StyleSheet, ImageBackground, View, FlatList, TouchableWithoutFeedback, Image, ListRenderItemInfo, Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import * as midataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import { AppFonts, colors, scale, TextSize } from '../styles/App.style';
import ContactSpeechBubble, { CONTACT_SPEECH_BUBBLE_MODE } from '../components/ContactSpeechBubble';
import EmergencyContact from '../model/EmergencyContact';
import UserProfile from '../model/UserProfile';
import { Resource } from '@i4mi/fhir_r4';
import RNContacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import {STORAGE} from './App';
import { Input, NativeBaseProvider } from 'native-base';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  userProfile: UserProfile;
  addResource: (r: Resource) => void;
  synchronizeResource: (r: Resource) => void;
  removeContact: (c: EmergencyContact) => void;
}

interface State {
  bubbleVisible: boolean;
  listVisible: boolean;
  mode: CONTACT_SPEECH_BUBBLE_MODE;
  selectedContact?: EmergencyContact;
  addressBookContacts: any[];
  query: string;
  showImportButton: boolean;
}

class Contacts extends Component<PropsType, State> {
  slider: any;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      bubbleVisible: true,
      listVisible: false,
      mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
      query: '',
      addressBookContacts: [],
      showImportButton: true
    }

    AsyncStorage.getItem(STORAGE.ASKED_FOR_CONTACT_PERMISSION)
    .then((asked) => {
      if (asked === 'true') {
        if (Platform.OS === 'ios') {
          RNContacts.checkPermission()
          .then((permission) => {
            this.setState({
              showImportButton: permission === 'authorized'
            });
          });
        }
        if (Platform.OS === 'android') {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
          .then((permission) => {
            this.setState({
              showImportButton: permission
            });
          });
        }

      }
    });
  }

  getAllAddressBookContacts(): void {
    this.setState({
      showImportButton: true
    });
    RNContacts.getAll().then(result => {
      let abContacts = new Array<EmergencyContact>();
      result.forEach(contact => {
        if(contact.hasThumbnail){
          RNFS.readFile(contact.thumbnailPath, 'base64').then(result => {
            abContacts.push(new EmergencyContact({
              given: new Array(contact.givenName),
              family: contact.familyName,
              phone: contact.phoneNumbers[0].number,
              image: {
                contentType: 'image/png',
                data: 'image/png;base64,' + result
              }
            }))
          })
        } else {
          abContacts.push(new EmergencyContact({
            given: new Array(contact.givenName),
            family: contact.familyName,
            phone: contact.phoneNumbers[0].number,
          }))
        }
      })
      this.setState({
        addressBookContacts: abContacts
      })
    })
  }
  
  onBubbleClose(_arg: {mode: CONTACT_SPEECH_BUBBLE_MODE, data?: EmergencyContact}): void {
    if (_arg.data === undefined) {
      this.setState({
        bubbleVisible: false,
        listVisible: (_arg.mode === CONTACT_SPEECH_BUBBLE_MODE.import || _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.delete || _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.edit),
        mode: _arg.mode
      });
      if (_arg.mode === CONTACT_SPEECH_BUBBLE_MODE.add || _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.menu){
        this.props.navigation.pop();
        }
    } else {
      this.setState({
        bubbleVisible: false,
        mode: CONTACT_SPEECH_BUBBLE_MODE.menu
      });
      const patientReference = this.props.userProfile.getFhirReference();
      if (patientReference) {
        const relatedPersonResource = _arg.data.createFhirResource(patientReference);
        switch (_arg.mode) {
          case CONTACT_SPEECH_BUBBLE_MODE.import:
            this.props.addResource(relatedPersonResource);
            break;
          case CONTACT_SPEECH_BUBBLE_MODE.add:
            this.props.addResource(relatedPersonResource);
            break;
          case CONTACT_SPEECH_BUBBLE_MODE.delete:
            relatedPersonResource.active = false;
            // no break, because we also have to synchronize the resource
          case CONTACT_SPEECH_BUBBLE_MODE.edit:
            this.props.synchronizeResource(relatedPersonResource);
            break;
        }
      }
      this.props.navigation.pop();
    }
  }

  onListItemPress(_contact: EmergencyContact) {
    this.setState({
      listVisible: false,
      bubbleVisible: true,
      selectedContact: _contact
    })
  }

  onSpeechBubbleModeChange(_mode: CONTACT_SPEECH_BUBBLE_MODE): void {
    if (_mode === CONTACT_SPEECH_BUBBLE_MODE.import) {
      if (Platform.OS === 'ios'){
        RNContacts.checkPermission()
        .then((permission) => {
          if (permission === 'authorized') {
            this.getAllAddressBookContacts();
          } else if (permission === 'denied') {
            this.setState({
              mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
              showImportButton: false
            });
          } else {
            RNContacts.requestPermission()
            .then((newPermission) => {
              AsyncStorage.setItem(STORAGE.ASKED_FOR_CONTACT_PERMISSION, 'true');
              if (newPermission === 'authorized') {
                this.getAllAddressBookContacts();
              } else {
                this.setState({
                  mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
                  showImportButton: false,
                  bubbleVisible: true
                });
              }
            });
          }
        })
        .catch((e)=> {
          console.log('Error with permission', e);
        });
      } else if(Platform.OS === 'android') {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then((permission) => {
          if (permission){
            this.getAllAddressBookContacts();
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
            .then((asked) => {
              AsyncStorage.setItem(STORAGE.ASKED_FOR_CONTACT_PERMISSION, 'true');
              if (asked === 'granted') { // is 'granted' or 'denied'
                this.getAllAddressBookContacts();
              } else {
                this.setState({
                  mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
                  showImportButton: false,
                  bubbleVisible: true
                });
              }
            })
            .catch((e)=> {
              console.log(e)
            });
          }
        })
        .catch((e)=> {
          console.log(e);
        });
      }
    }
  }

  renderContactListItem(_item: ListRenderItemInfo<EmergencyContact>) {
    const contact: EmergencyContact = _item.item;
    return (
      <TouchableWithoutFeedback onPress={() => this.onListItemPress(contact)}>
        <View style={styles.listItem}>
          <Text numberOfLines={1} style={styles.listItemText}>
            { contact.getNameString() }
          </Text>
          { contact.image
            ? <Image style={styles.listItemImage} source={{uri: 'data:' + contact.image.data}} />
            : <View style={[styles.listItemInitials, {backgroundColor: contact.getUniqueColor()}]}>
                <Text style={styles.listItemInitialsText}>{contact.getInitials()}</Text>
              </View>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderHeader(){
    return(
      <NativeBaseProvider>
              <View
      style={{
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Input
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={this.handleSearch}
        placeholder={this.props.localesHelper.localeString('common.search') + '...'}
        style={{
          borderColor: colors.grey,
          backgroundColor: colors.white,
        }}
        textStyle={{ color: colors.black }}
        _focus={{borderColor: colors.primary}}
        clearButtonMode='always'
        isFullWidth={true}
        size="xl"
        placeholderTextColor={colors.black}
        backgroundColor={colors.white}
      />
    </View>
      </NativeBaseProvider>
    )
  }

  handleSearch = (text: string) => {
    this.setState(
      { query: text }
    );
  }

  contains = (contact: { given: string, family: string, phone: string }, query: string) => {
    const fullName = contact.given[0] + ' ' + contact.family;
    return fullName.toLowerCase().includes(query) || 
      contact.phone.includes(query) || 
      contact.phone.includes(query) || 
      contact.phone.replace(/[^a-zA-Z0-9]/g,'').includes(query);
  }

  render() {
    const contacts = (this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.edit || this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete) 
      ? this.props.userProfile.getEmergencyContacts() 
      : this.state.addressBookContacts.filter(
        (contact: { given: string, family: string, phone: string }) => this.contains(contact, this.state.query.toLowerCase())
      );
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>
                {
                  (this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.edit || this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete)
                    ? this.props.localesHelper.localeString('contacts.selectContact')
                    : this.props.localesHelper.localeString('contacts.title')
                }
              </Text>
            </View>
            <View style={styles.emergencyButton}>
              <EmergencyNumberButton/>
            </View>
          </View>
          <View style={styles.bottomView}>
            { this.state.bubbleVisible &&
            <View>
              <ContactSpeechBubble
                mode={this.state.mode}
                localesHelper={this.props.localesHelper}
                contact={this.state.selectedContact}
                onClose={this.onBubbleClose.bind(this)}
                showImport={this.state.showImportButton}
                onModeSelect={this.onSpeechBubbleModeChange.bind(this)}
              />
            </View>
            }
            { this.state.listVisible &&
            <View>
              <FlatList
                ListHeaderComponent={this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.import ? this.renderHeader() : <></>}
                data={contacts.sort((a, b) => a.given[0].localeCompare(b.given[0]))}
                alwaysBounceVertical={false}
                renderItem={this.renderContactListItem.bind(this)}
                showsHorizontalScrollIndicator={false}
              />
              </View>
            }
          </View>
        </ImageBackground>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(50),
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big),
  },
  emergencyButton: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  topView: {
    backgroundColor: 'rgba(203, 95, 11, 0.5)',
    flex: 0.4,
    flexDirection: 'row',
  },
  bottomView: {
    flex: 1,
    backgroundColor: colors.linen,
  },
  listItem: {
    marginVertical: scale(10),
    flexDirection: 'row',
    justifyContent:'space-between',
    marginRight: scale(60),
    backgroundColor: colors.grey,
    height: 4 * scale(TextSize.small),
    borderTopRightRadius: 2 * scale(TextSize.small),
    borderBottomRightRadius: 2 * scale(TextSize.small)
  },
  listItemText: {
    marginTop: 1.4 * scale(TextSize.small),
    marginLeft: 2 * scale(TextSize.small),
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.small),
    color: colors.white,
    maxWidth: scale(200),
  },
  listItemImage: {
    borderRadius: 2 * scale(TextSize.small),
    height: 4 * scale(TextSize.small),
    width: 4 * scale(TextSize.small)
  },
  listItemInitials: {
    borderRadius: 2 * scale(TextSize.small),
    height: 4 * scale(TextSize.small),
    width: 4 * scale(TextSize.small),
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemInitialsText: {
    fontFamily: AppFonts.regular,
    fontSize: 1.8 * scale(TextSize.small),
    color: colors.white,
  }
});

// Link store data to component:
function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    addResource: (r: Resource) => midataServiceActions.addResource(dispatch, r),
    synchronizeResource: (r: Resource) => midataServiceActions.synchronizeResource(dispatch, r),
    removeContact: (c: EmergencyContact) => userProfileActions.removeEmergencyContact(dispatch, c)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
