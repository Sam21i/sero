import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import {Input, NativeBaseProvider} from 'native-base';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import BackButton from '../components/BackButton';
import {CONTACT_SPEECH_BUBBLE_MODE} from '../components/ContactSpeechBubble';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import EmergencyContact from '../model/EmergencyContact';
import MidataService from '../model/MidataService';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import * as midataServiceActions from '../store/midataService/actions';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;
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
          <View style={{paddingTop: verticalScale(50)}}></View>
          <Input
            autoCapitalize='none'
            autoCorrect={false}
            onChangeText={this.handleSearch}
            placeholder={this.props.t('common.search') + '...'}
            style={{
              borderColor: colors.grey,
              backgroundColor: colors.white
            }}
            textStyle={{color: colors.black}}
            _focus={{borderColor: colors.gold}}
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
    const contacts = this.props.userProfile
      .getEmergencyContacts()
      .filter((contact: EmergencyContact) => this.contains(contact, this.state.query.toLowerCase()));
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodYellow}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <BackButton
              color={colors.white}
              onPress={() => {
                this.props.navigation.navigate('AssessmentEndOptions');
              }}
            />
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>
                {this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.edit ||
                this.state.mode === CONTACT_SPEECH_BUBBLE_MODE.delete
                  ? this.props.t('contacts.selectContact')
                  : this.props.t('contacts.title')}
              </Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            <FlatList
              style={{height: '100%'}}
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
            />
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
    width: scale(200),
    paddingVertical: scale(10),
    marginTop: scale(20),
    marginBottom: scale(40)
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
  }
});

function mapStateToProps(state: AppStore) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Contacts));
