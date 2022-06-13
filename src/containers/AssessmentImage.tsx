import React, {Component} from 'react';
import {Text, StyleSheet, ImageBackground, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {AppStore} from '../store/reducers';
import {connect} from 'react-redux';
import * as midataServiceActions from '../store/midataService/actions';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';
import UserProfile from '../model/UserProfile';
import {Resource} from '@i4mi/fhir_r4';
import AssessmentSpeechBubble, {ASSESSMENT_SPEECH_BUBBLE_MODE} from '../components/AssessmentSpeechBubble';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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
  mode: ASSESSMENT_SPEECH_BUBBLE_MODE;
  new_image?: {
    contentType: string;
    data: string;
  };
}

const MAX_IMAGE_SIZE = 500;

class AssessmentImage extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: true,
      mode: ASSESSMENT_SPEECH_BUBBLE_MODE.menu,
      new_image: undefined
    };
  }

  pickImage() {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true
    })
      .then((image) => {
        if (!image.didCancel && image.assets && image.assets.length > 0) {
          const type = image.assets[0].type?.replace('jpg', 'jpeg');
          this.setState(
            {
              new_image: {
                contentType: type || '',
                data: type + ';base64,' + image.assets[0].base64 || ''
              }
            },
            () => {
              console.log(this.state.new_image);
              this.props.navigation.navigate('AssessmentQuestions', {prismExample: this.state.new_image});
            }
          );
        }
      })
      .catch((e) => {
        console.log('Error picking image', e);
      });
  }

  newImage() {
    launchCamera({
      mediaType: 'photo',
      includeBase64: true
    })
      .then((image) => {
        if (!image.didCancel && image.assets && image.assets.length > 0) {
          const type = image.assets[0].type?.replace('jpg', 'jpeg');
          this.setState(
            {
              new_image: {
                contentType: type || '',
                data: type + ';base64,' + image.assets[0].base64 || ''
              }
            },
            () => {
              this.props.navigation.navigate('AssessmentQuestions', {prismExample: this.state.new_image});
            }
          );
        }
      })
      .catch((e) => {
        console.log('Error picking image', e);
      });
  }

  async onBubbleClose(mode: ASSESSMENT_SPEECH_BUBBLE_MODE): Promise<void> {
    const newState = {
      bubbleVisible: false
    };
    switch (mode) {
      case ASSESSMENT_SPEECH_BUBBLE_MODE.new:
        this.newImage();
        break;
      case ASSESSMENT_SPEECH_BUBBLE_MODE.select:
        this.pickImage();
      default:
      // nothing to do here, just close the bubble
    }
    this.setState(newState);
  }

  render() {
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
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('assessment.addEntry')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            {this.state.bubbleVisible && (
              <AssessmentSpeechBubble
                localesHelper={this.props.localesHelper}
                navigation={this.props.navigation}
                onClose={this.onBubbleClose.bind(this)}
              />
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginLeft: scale(40)
  },
  topViewText: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.normal)
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

export default connect(mapStateToProps, mapDispatchToProps)(AssessmentImage);
