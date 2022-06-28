import {Resource} from '@i4mi/fhir_r4';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {ImageBackground, PermissionsAndroid, Platform, StyleSheet, Text, View} from 'react-native';
import {ImagePickerResponse, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AssessmentImageSpeechBubble, {
  ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE
} from '../components/AssessmentImageSpeechBubble';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import {PrismInitializer} from '../model/PrismSession';
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
  mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE;
  showCameraButton: boolean;
}

const MAX_IMAGE_SIZE = 800;

class AssessmentImage extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: true,
      mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE.menu,
      showCameraButton: true
    };

    AsyncStorage.getItem(STORAGE.ASKED_FOR_CAMERA_PERMISSION).then((asked) => {
      if (asked === 'true') {
        if (Platform.OS === 'android') {
          PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then((permission) => {
            if (permission) {
              this.setState({
                showCameraButton: true
              });
            } else {
              AsyncStorage.getItem(STORAGE.CAMERA_PERMISSION_STATUS_ANDROID).then((permission) => {
                if (permission === 'denied') {
                  this.setState({
                    showCameraButton: true
                  });
                } else if (permission === 'never_ask_again') {
                  this.setState({
                    showCameraButton: false
                  });
                }
              });
            }
          });
        } else if (Platform.OS === 'ios') {
          check(PERMISSIONS.IOS.CAMERA).then((permission) => {
            this.setState({
              showCameraButton: !(permission === 'blocked' || permission === 'unavailable' || permission === 'denied')
            });
          });
        }
      }
    });
  }

  setImage(image: ImagePickerResponse) {
    if (!image.didCancel && image.assets && image.assets.length > 0) {
      const type = image.assets[0].type?.replace('jpg', 'jpeg');
      const prismData: PrismInitializer = {
        canvasWidth: image.assets[0].width || MAX_IMAGE_SIZE,
        questionnaire: this.props.midataService.getPrismQuestionnaire(),
        image: {
          contentType: type || '',
          data: image.assets[0].base64 || ''
        }
      };
      this.props.navigation.navigate('AssessmentQuestions', {prismData: prismData});
    }
  }

  pickImage() {
    launchImageLibrary({
      mediaType: 'photo',
      maxHeight: MAX_IMAGE_SIZE,
      maxWidth: MAX_IMAGE_SIZE,
      includeBase64: true
    })
      .then((image) => this.setImage(image))
      .catch((e) => {
        console.log('Error picking image', e);
      });
  }

  takeNewImage() {
    launchCamera({
      mediaType: 'photo',
      maxHeight: MAX_IMAGE_SIZE,
      maxWidth: MAX_IMAGE_SIZE,
      includeBase64: true
    })
      .then((image) => {
        this.setImage(image);
      })
      .catch((e) => {
        console.log('Error taking image', e);
      });
  }

  handleCameraPermissions() {
    if (Platform.OS === 'ios') {
      request(PERMISSIONS.IOS.CAMERA)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this.setState({
                mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE.menu,
                showCameraButton: false,
                bubbleVisible: true
              });
              break;
            case RESULTS.DENIED:
              this.setState({
                mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE.menu,
                showCameraButton: false,
                bubbleVisible: true
              });
              break;
            case RESULTS.LIMITED:
              {
                this.takeNewImage();
              }
              break;
            case RESULTS.GRANTED:
              {
                this.takeNewImage();
              }
              break;
            case RESULTS.BLOCKED:
              this.setState({
                mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE.menu,
                showCameraButton: false,
                bubbleVisible: true
              });
              break;
          }
          AsyncStorage.setItem(STORAGE.ASKED_FOR_CAMERA_PERMISSION, 'true');
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA).then((permission) => {
        if (permission) {
          this.takeNewImage();
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: this.props.localesHelper.localeString('assessment.permissionAndroid.title'),
            message: this.props.localesHelper.localeString('assessment.permissionAndroid.message'),
            buttonPositive: this.props.localesHelper.localeString('common.ok')
          })
            .then((permission) => {
              AsyncStorage.setItem(STORAGE.ASKED_FOR_CAMERA_PERMISSION, 'true');
              if (permission === PermissionsAndroid.RESULTS.GRANTED) {
                this.takeNewImage();
              } else if (permission === PermissionsAndroid.RESULTS.DENIED) {
                AsyncStorage.setItem(STORAGE.CAMERA_PERMISSION_STATUS_ANDROID, 'denied');
                this.setState({
                  mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE.menu,
                  showCameraButton: true
                });
              } else if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                AsyncStorage.setItem(STORAGE.CAMERA_PERMISSION_STATUS_ANDROID, 'never_ask_again');
                this.setState({
                  mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE.menu,
                  showCameraButton: false
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    }
  }

  onBubbleClose(mode: ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE) {
    mode === ASSESSMENT_IMAGE_SPEECH_BUBBLE_MODE.new ? this.handleCameraPermissions() : this.pickImage();
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodYellow}
          resizeMode='cover'
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewText}>{this.props.localesHelper.localeString('assessment.addEntry')}</Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            {this.state.bubbleVisible && (
              <AssessmentImageSpeechBubble
                localesHelper={this.props.localesHelper}
                navigation={this.props.navigation}
                onClose={this.onBubbleClose.bind(this)}
                showNew={this.state.showCameraButton}
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
