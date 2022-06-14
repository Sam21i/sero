import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Image,
  ListRenderItemInfo,
  Platform,
  PermissionsAndroid,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import * as midataServiceActions from '../store/midataService/actions';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import ContactSpeechBubble, {CONTACT_SPEECH_BUBBLE_MODE} from '../components/ContactSpeechBubble';
import EmergencyContact from '../model/EmergencyContact';
import UserProfile from '../model/UserProfile';
import {Resource} from '@i4mi/fhir_r4';
import RNContacts from 'react-native-contacts';
import RNFS from 'react-native-fs';
import {STORAGE} from './App';
import {Input, NativeBaseProvider} from 'native-base';
import AppButton from '../components/AppButton';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  userProfile: UserProfile;
  addResource: (r: Resource) => void;
  synchronizeResource: (r: Resource) => void;
}

interface State {
  mode: CONTACT_SPEECH_BUBBLE_MODE;
  selectedContact?: EmergencyContact;
  query: string;
  showImportButton: boolean;
}

class Contacts extends Component<PropsType, State> {
  slider: any;

  constructor(props: PropsType) {
    super(props);
    this.state = {
      mode: CONTACT_SPEECH_BUBBLE_MODE.menu,
      query: '',
      showImportButton: true
    };
  }

  onListItemPress(_contact: EmergencyContact) {
    Linking.openURL('tel:' + _contact.phone.replace(/\s/g, '')).then(
      this.props.navigation.navigate('MainStackScreen', {screen: 'Main'})
    );
  }

  callNumber(_number: string): void {
    Linking.openURL('tel:' + _number.replace(/\s/g, '')).then(
      this.props.navigation.navigate('MainStackScreen', {screen: 'Main'})
    );
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

  _renderListFooter() {
    return (
      <AppButton
        label={this.props.localesHelper.localeString('common.back')}
        icon={
          '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
        }
        position='right'
        color={colors.gold}
        onPress={() => {
          this.props.navigation.navigate('AssessmentEndOptions');
        }}
        style={{width: scale(200), paddingVertical: scale(10), marginVertical: scale(20)}}
        isLargeButton={false}
      />
    );
  }

  render() {
    const contacts = this.props.userProfile
      .getEmergencyContacts()
      .filter((contact: EmergencyContact) => this.contains(contact, this.state.query.toLowerCase()));
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_yellow.png')}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
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
            <View style={{position: 'relative', top: verticalScale(50)}}>
              <FlatList
                ListHeaderComponent={this.renderHeader()}
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
                alwaysBounceVertical={false}
                renderItem={this.renderContactListItem.bind(this)}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={this._renderListFooter.bind(this)}
              />
            </View>
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
  backButton: {
    height: scale(50),
    width: scale(225),
    paddingVertical: scale(10),
    marginVertical: 0,
    marginBottom: 20
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  topTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(40)
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
    backgroundColor: colors.gold50opac,
    flex: 1,
    flexDirection: 'row'
  },
  bottomView: {
    flex: 7,
    backgroundColor: colors.white65opac
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
