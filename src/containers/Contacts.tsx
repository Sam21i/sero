import {Resource} from '@i4mi/fhir_r4';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {Input, NativeBaseProvider} from 'native-base';
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  ListRenderItemInfo,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import RNContacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import BackButton from '../components/BackButton';
import ContactSpeechBubble, {CONTACT_SPEECH_BUBBLE_MODE} from '../components/ContactSpeechBubble';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import EmergencyContact from '../model/EmergencyContact';
import MidataService from '../model/MidataService';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import * as midataServiceActions from '../store/midataService/actions';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import {STORAGE} from './App';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  userProfile: UserProfile;
  addResource: (r: Resource) => void;
  synchronizeResource: (r: Resource) => void;
}

interface State {
  bubbleVisible: boolean;
  listVisible: boolean;
  mode: CONTACT_SPEECH_BUBBLE_MODE;
  selectedContact?: EmergencyContact;
  addressBookContacts: [];
  query: string;
  showImportButton: boolean;
  loadingContacts: boolean;
}

class Contacts extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      bubbleVisible: true,
      listVisible: false,
      mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
      query: '',
      addressBookContacts: [],
      showImportButton: true,
      loadingContacts: false
    };

    AsyncStorage.getItem(STORAGE.ASKED_FOR_CONTACT_PERMISSION).then((asked) => {
      if (asked === 'true') {
        if (Platform.OS === 'ios') {
          RNContacts.checkPermission().then((permission) => {
            this.setState({
              showImportButton: permission === 'authorized'
            });
          });
        }
        if (Platform.OS === 'android') {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then((permission) => {
            if (permission) {
              this.setState({
                showImportButton: true
              });
            } else {
              AsyncStorage.getItem(STORAGE.CONTACT_PERMISSION_STATUS_ANDROID).then((permission) => {
                if (permission === 'denied') {
                  this.setState({
                    showImportButton: true
                  });
                } else if (permission === 'never_ask_again') {
                  this.setState({
                    showImportButton: false
                  });
                }
              });
            }
          });
        }
      }
    });
  }

  getAllAddressBookContacts(): void {
    this.setState({
      showImportButton: true,
      loadingContacts: true
    });
    RNContacts.getAll().then((result) => {
      const abContacts = new Array<EmergencyContact>();
      const waitForContactsWithImages = new Array<Promise<any>>();
      result.forEach((contact) => {
        let given = contact.givenName || '';
        let family = contact.familyName || '';
        const phone =
          contact.phoneNumbers && contact.phoneNumbers[0] && contact.phoneNumbers[0].number
            ? contact.phoneNumbers[0].number
            : '';
        if (contact.company) {
          if (given === '') {
            given = contact.company;
          } else if (family === '' && given !== contact.company) {
            family = contact.company;
          }
        }
        // no need for importing empty contacts
        if (given.length > 0 || family.length > 0) {
          if (contact.hasThumbnail) {
            waitForContactsWithImages.push(
              RNFS.readFile(contact.thumbnailPath, 'base64')
                .then((result) => {
                  const emergencyContact = new EmergencyContact({
                    given: [given],
                    family: family,
                    phone: phone,
                    image: {
                      contentType: 'image/png',
                      data: 'image/png;base64,' + result
                    }
                  });
                  abContacts.push(emergencyContact);
                  return;
                })
                .catch((e) => {
                  console.log('error reading contact', e, contact);
                })
            );
          } else {
            abContacts.push(
              new EmergencyContact({
                given: [given],
                family: family,
                phone: phone
              })
            );
          }
        } else {
          console.log('Emitted contact because it has no useful info', contact);
        }
      });
      Promise.all(waitForContactsWithImages).finally(() => {
        this.setState({
          addressBookContacts: abContacts,
          loadingContacts: false
        });
      });
    });
  }

  onBubbleClose(_arg: {mode: CONTACT_SPEECH_BUBBLE_MODE; data?: EmergencyContact}): void {
    if (_arg.data === undefined) {
      this.setState({
        bubbleVisible: false,
        listVisible:
          _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.import ||
          _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.delete ||
          _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.edit,
        mode: _arg.mode
      });
      if (_arg.mode === CONTACT_SPEECH_BUBBLE_MODE.add || _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.menu) {
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
          // eslint-disable-next-line no-fallthrough
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
    });
  }

  onSpeechBubbleModeChange(_mode: CONTACT_SPEECH_BUBBLE_MODE): void {
    if (_mode === CONTACT_SPEECH_BUBBLE_MODE.import) {
      if (Platform.OS === 'ios') {
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
              RNContacts.requestPermission().then((newPermission) => {
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
          .catch((e) => {
            console.log('Error with permission', e);
          });
      } else if (Platform.OS === 'android') {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
          .then((permission) => {
            if (permission) {
              this.getAllAddressBookContacts();
            } else {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: this.props.localesHelper.localeString('contacts.permissionAndroid.title'),
                message: this.props.localesHelper.localeString('contacts.permissionAndroid.message'),
                buttonPositive: this.props.localesHelper.localeString('common.ok')
              })
                .then((permission) => {
                  AsyncStorage.setItem(STORAGE.ASKED_FOR_CONTACT_PERMISSION, 'true');
                  if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                    // is 'granted' or 'denied'
                    this.getAllAddressBookContacts();
                  } else if (permission === PermissionsAndroid.RESULTS.DENIED) {
                    AsyncStorage.setItem(STORAGE.CONTACT_PERMISSION_STATUS_ANDROID, 'denied');
                    this.setState({
                      mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
                      showImportButton: true,
                      bubbleVisible: true
                    });
                  } else if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    AsyncStorage.setItem(STORAGE.CONTACT_PERMISSION_STATUS_ANDROID, 'never_ask_again');
                    this.setState({
                      mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
                      showImportButton: false,
                      bubbleVisible: true
                    });
                  }
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          })
          .catch((e) => {
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
          <Text
            numberOfLines={1}
            style={styles.listItemText}>
            {contact.getNameString()}
          </Text>
          {contact.image ? (
            <Image
              style={styles.listItemImage}
              source={{uri: 'data:' + contact.image.data}}
            />
          ) : (
            <View style={[styles.listItemInitials, {backgroundColor: contact.getUniqueColor()}]}>
              <Text style={styles.listItemInitialsText}>{contact.getInitials()}</Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderHeader() {
    return (
      <NativeBaseProvider>
        <View
          style={{
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <View style={{paddingTop: verticalScale(50)}}></View>
          <Input
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleSearch}
            placeholder={this.props.localesHelper.localeString('common.search') + '...'}
            style={{
              borderColor: colors.grey,
              backgroundColor: colors.white
            }}
            textStyle={{color: colors.black}}
            _focus={{borderColor: colors.primary}}
            clearButtonMode='always'
            isFullWidth={true}
            size='xl'
            placeholderTextColor={colors.black}
            backgroundColor={colors.white}
          />
        </View>
      </NativeBaseProvider>
    );
  }

  handleSearch = (text: string) => {
    this.setState({query: text});
  };

  contains = (contact: EmergencyContact, query: string) => {
    const fullName = contact.given[0] + ' ' + contact.family;
    return (
      fullName.toLowerCase().includes(query) ||
      contact.phone.includes(query) ||
      contact.phone.includes(query) ||
      contact.phone.replace(/[^a-zA-Z0-9]/g, '').includes(query)
    );
  };

  render() {
    const contacts =
      this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.edit || this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete
        ? this.props.userProfile
            .getEmergencyContacts()
            .filter((contact: EmergencyContact) => this.contains(contact, this.state.query.toLowerCase()))
        : this.state.addressBookContacts.filter((contact: EmergencyContact) =>
            this.contains(contact, this.state.query.toLowerCase())
          );
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodLightOrange}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <BackButton
              onPress={() => {
                if (this.state.bubbleVisible) {
                  this.props.navigation.navigate('MainStackScreen', {screen: 'Main'});
                } else {
                  this.setState({bubbleVisible: true, listVisible: false, mode: CONTACT_SPEECH_BUBBLE_MODE.menu});
                }
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>
                {this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.edit ||
                this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete
                  ? this.props.localesHelper.localeString('contacts.selectContact')
                  : this.props.localesHelper.localeString('contacts.title')}
              </Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            {this.state.bubbleVisible && (
              <View style={{position: 'relative', top: verticalScale(80)}}>
                <ContactSpeechBubble
                  mode={this.state.mode}
                  localesHelper={this.props.localesHelper}
                  contact={this.state.selectedContact}
                  onClose={this.onBubbleClose.bind(this)}
                  showImport={this.state.showImportButton}
                  onModeSelect={this.onSpeechBubbleModeChange.bind(this)}
                />
              </View>
            )}
            {this.state.listVisible && (
              <View>
                {this.state.loadingContacts ? (
                  <Text style={styles.loading}>{this.props.localesHelper.localeString('common.loading')}...</Text>
                ) : (
                  <FlatList
                    alwaysBounceVertical={false}
                    showsHorizontalScrollIndicator={false}
                    data={contacts.sort((a, b) => {
                      // don't show Company Entries at the top
                      if (a.given[0] === '') {
                        return 1;
                      }
                      if (b.given[0] === '') {
                        return -1;
                      }
                      return a.getNameString().localeCompare(b.getNameString());
                    })}
                    ListHeaderComponent={
                      this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.import ? this.renderHeader() : this.renderHeader()
                    }
                    renderItem={this.renderContactListItem.bind(this)}
                  />
                )}
              </View>
            )}
          </View>
          <View style={styles.emergencyButton}>
            <EmergencyNumberButton />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  topTextView: {
    alignItems: 'center',
    alignSelf: 'center'
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  emergencyButton: {
    position: 'absolute',
    right: -0.2,
    top: verticalScale(45)
  },
  topView: {
    backgroundColor: colors.primary50opac,
    flex: 1,
    flexDirection: 'row'
  },
  bottomView: {
    backgroundColor: colors.white65opac,
    flex: 7
  },
  listItem: {
    marginVertical: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    maxWidth: scale(200)
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
    alignItems: 'center'
  },
  listItemInitialsText: {
    fontFamily: AppFonts.regular,
    fontSize: 1.8 * scale(TextSize.small),
    color: colors.white
  },
  loading: {
    fontFamily: AppFonts.regular,
    fontSize: TextSize.small,
    width: '100%',
    textAlign: 'center',
    marginTop: scale(10)
  }
});

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
    synchronizeResource: (r: Resource) => midataServiceActions.synchronizeResource(dispatch, r)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
