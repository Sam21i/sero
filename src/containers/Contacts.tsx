import React, {Component} from 'react';
import {Text, StyleSheet, ImageBackground, View, FlatList, TouchableWithoutFeedback, Image, ListRenderItemInfo, Platform } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import * as midataServiceActions from '../store/midataService/actions';
import * as userProfileActions from '../store/userProfile/actions';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import { AppFonts, colors, scale, TextSize, verticalScale } from '../styles/App.style';
import ContactSpeechBubble, { CONTACT_SPEECH_BUBBLE_MODE } from '../components/ContactSpeechBubble';
import EmergencyContact from '../model/EmergencyContact';
import UserProfile from '../model/UserProfile';
import { Resource } from '@i4mi/fhir_r4';

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
}

class Contacts extends Component<PropsType, State> {
  slider: any;

  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: true,
      listVisible: false,
      mode: CONTACT_SPEECH_BUBBLE_MODE.menu
    };
  }

  onBubbleClose(_arg: {mode: CONTACT_SPEECH_BUBBLE_MODE, data?: EmergencyContact}): void {
    if (_arg.data === undefined) {
      this.setState({
        bubbleVisible: false,
        listVisible: (_arg.mode === CONTACT_SPEECH_BUBBLE_MODE.delete || _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.edit),
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
            : <View style={styles.listItemInitials}>
                <Text style={styles.listItemInitialsText}>{contact.getInitials()}</Text>
              </View>
          }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  render() {
    const contacts = this.props.userProfile.getEmergencyContacts();
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
              <ContactSpeechBubble mode={this.state.mode}
              localesHelper={this.props.localesHelper}
              contact={this.state.selectedContact}
              onClose={this.onBubbleClose.bind(this)}/>
            </View>
            }
            { this.state.listVisible &&
              <FlatList data={contacts}
                        alwaysBounceVertical={false}
                        renderItem={this.renderContactListItem.bind(this)}
                        showsHorizontalScrollIndicator={false}
              />
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
  bottomTextView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white,
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
    height: 4 * TextSize.small,
    borderTopRightRadius: 2 * TextSize.small,
    borderBottomRightRadius: 2 * TextSize.small
  },
  listItemText: {
    marginTop: 1.4 * TextSize.small,
    marginLeft: 2 * TextSize.small,
    fontFamily: AppFonts.regular,
    fontSize: TextSize.small,
    color: colors.white,
    maxWidth: scale(200),
  },
  listItemImage: {
    borderRadius: 2 * TextSize.small,
    height: 4 * TextSize.small,
    width: 4 * TextSize.small
  },
  listItemInitials: {
    borderRadius: 2 * TextSize.small,
    height: 4 * TextSize.small,
    width: 4 * TextSize.small,
    backgroundColor: colors.petrol
  },
  listItemInitialsText: {
    fontFamily: AppFonts.regular,
    fontSize: 1.8 * TextSize.small,
    alignSelf: 'center',
    marginTop: 0.9 * TextSize.small,
    color: colors.white,
  }
});

// Link store data to component :
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
