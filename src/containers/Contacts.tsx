import React, {Component} from 'react';
import {Text, StyleSheet, ImageBackground, View, FlatList, TouchableWithoutFeedback, Image, ListRenderItemInfo } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import EmergencyContactIcon from '../resources/images/icons/icon_emergencyContact.svg';
import { AppFonts, colors, scale, TextSize, verticalScale } from '../styles/App.style';
import ContactSpeechBubble, { CONTACT_SPEECH_BUBBLE_MODE } from '../components/ContactSpeechBubble';
import EmergencyContact from '../model/EmergencyContact';
import UserProfile from '../model/UserProfile';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  userProfile: UserProfile;
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
    console.log('close button', _arg)
    if (_arg.data === undefined) {
      this.setState({
        bubbleVisible: false,
        listVisible: (_arg.mode === CONTACT_SPEECH_BUBBLE_MODE.delete || _arg.mode === CONTACT_SPEECH_BUBBLE_MODE.edit),
        mode: _arg.mode
      });
    } else {
      console.warn('TODO: handle bubble close with EmergencyContact in argument (save/delete)')
      this.setState({
        bubbleVisible: false
      });
      this.props.navigation.pop()
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
          <Text style={styles.listItemText}>
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
            <View style={styles.button}>
                <EmergencyContactIcon/>
            </View>
          </View>
          <View style={styles.bottomView}>
            { this.state.bubbleVisible &&
              <ContactSpeechBubble mode={this.state.mode}
                                   localesHelper={this.props.localesHelper}
                                   contact={this.state.selectedContact}
                                   onClose={this.onBubbleClose.bind(this)}/>
            }
            { this.state.listVisible &&
              <FlatList data={contacts}
                        alwaysBounceVertical={false}
                        style={styles.list}
                        renderItem={this.renderContactListItem.bind(this)}
                        showsHorizontalScrollIndicator={false}
              >
              </FlatList>

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
    justifyContent: 'center',
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big),
  },
  topText: {
    textAlign: 'center',
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.small),
    color: colors.white,
  },
  button: {
    alignSelf: 'center',
    width: scale(90),
    height: verticalScale(75),
    paddingVertical: verticalScale(15),
    paddingLeft: scale(10),
    paddingRight: scale(20),
    backgroundColor: colors.petrol,
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 100,
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
    flex: 1,
    flexDirection: 'row',
  },
  bottomView: {
    flex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  list: {
    marginTop: scale(30)
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

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
