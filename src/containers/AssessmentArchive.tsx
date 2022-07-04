import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {FlatList, Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import Question from '../components/Question';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import PrismSession from '../model/PrismSession';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {activeOpacity, AppFonts, appStyles, colors, scale, TextSize, verticalScale} from '../styles/App.style';

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
  prismSessionHistory: PrismSession[];
  selectedPrismSession: PrismSession | undefined;
}

class AssessmentArchive extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: false,
      prismSessionHistory: this.props.userProfile.getPrismSessions(),
      selectedPrismSession: undefined
    };
  }

  renderListItem({item}) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={() => {
          this.setState({selectedPrismSession: item});
        }}
        key={item.date.toString()}>
        <View style={appStyles.listItem}>
          <View style={appStyles.listItemContent}>
            <Text
              numberOfLines={2}
              style={appStyles.listItemTitleText}>
              {this.props.localesHelper.localeString('assessment.former')}
            </Text>
            <Text
              numberOfLines={1}
              style={appStyles.listItemSubtitleText}>
              {item.getLocaleDate(this.props.localesHelper.currentLang || 'de-CH')}
            </Text>
          </View>
          <View style={appStyles.listItemContentIcon}>
            <SvgCss
              xml={images.imagesSVG.common.assessment}
              style={appStyles.listItemIcon}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderList() {
    return (
      <FlatList
        data={this.state.prismSessionHistory}
        renderItem={this.renderListItem.bind(this)}
        alwaysBounceVertical={false}
        ListFooterComponent={this.renderFooterComponent.bind(this)}
        ListHeaderComponent={this.renderListHeaderComponent}
      />
    );
  }

  renderListHeaderComponent() {
    return <View style={{height: scale(50)}}></View>;
  }

  renderFooterComponent() {
    return (
      <AppButton
        label={this.props.localesHelper.localeString('common.back')}
        icon={images.imagesSVG.common.back}
        position='right'
        color={colors.gold}
        onPress={() => {
          this.state.selectedPrismSession
            ? this.setState({selectedPrismSession: undefined})
            : this.props.navigation.goBack();
        }}
        style={{width: scale(225), marginVertical: scale(20)}}
        isLargeButton={false}
      />
    );
  }

  renderPrismSession() {
    return (
      <FlatList
        data={this.state.selectedPrismSession?.getQuestionnaireData().getQuestions()}
        ListHeaderComponent={this.renderPrismSessionHeader.bind(this)}
        alwaysBounceVertical={false}
        renderItem={this.renderPrismSessionItem.bind(this)}
        ListFooterComponent={this.renderFooterComponent.bind(this)}
        keyExtractor={(item) => item.id}
      />
    );
  }

  renderPrismSessionItem({item}) {
    return (
      <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
        <Question
          question={item}
          isArchiveMode={true}
        />
      </View>
    );
  }

  renderPrismSessionHeader() {
    const svgImage = this.state.selectedPrismSession?.getSVGImage() || '';
    const base64Image = this.state.selectedPrismSession?.getBase64Image() || {
      contentType: '',
      data: ''
    };
    return (
      <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
        <View style={{height: 50, width: '100%'}}></View>
        {svgImage !== '' && (
          <SvgCss
            xml={svgImage}
            style={[
              styles.image,
              {
                overflow: 'visible',
                shadowColor: colors.black,
                shadowOffset: {
                  width: scale(5),
                  height: scale(5)
                },
                shadowOpacity: 0.5,
                shadowRadius: scale(5)
              }
            ]}
          />
        )}
        {base64Image.contentType !== '' && (
          <Image
            style={[
              styles.image,
              {
                overflow: 'visible',
                shadowColor: colors.black,
                shadowOffset: {
                  width: scale(5),
                  height: scale(5)
                },
                shadowOpacity: 0.5,
                shadowRadius: scale(5)
              }
            ]}
            source={{uri: 'data:' + base64Image.contentType + ';base64,' + base64Image.data}}
          />
        )}
      </View>
    );
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
          {this.state.selectedPrismSession ? (
            <View style={styles.topView}>
              <View style={styles.topTextView}>
                <Text style={[styles.topViewTextTitle, {fontSize: TextSize.normal}]}>
                  {this.props.localesHelper.localeString('assessment.former')}
                </Text>
                <Text style={styles.topViewTextDescr}>
                  {this.state.selectedPrismSession.getLocaleDate(this.props.localesHelper.currentLang || 'de-CH')}{' '}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.topView}>
              <View style={styles.topTextView}>
                <Text style={styles.topViewTextTitle}>{this.props.localesHelper.localeString('common.archive')}</Text>
              </View>
            </View>
          )}
          <View style={styles.bottomView}>
            {this.state.selectedPrismSession ? this.renderPrismSession() : this.renderList()}
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
  topView: {
    backgroundColor: colors.gold50opac,
    flex: 1
  },
  topTextView: {
    flex: 1,
    paddingLeft: scale(50),
    alignSelf: 'flex-start',
    justifyContent: 'center'
  },
  topViewTextTitle: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.big)
  },
  topViewTextDescr: {
    color: colors.black,
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall)
  },
  container: {
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center'
  },
  emergencyButton: {
    position: 'absolute',
    right: -0.2,
    top: verticalScale(45)
  },
  bottomView: {
    flex: 7,
    backgroundColor: colors.white65opac
  },
  image: {
    width: '100%',
    height: scale(300),
    resizeMode: 'contain',
    marginVertical: scale(15)
  },
  icon: {
    flex: 1,
    height: '100%'
  }
});

function mapStateToProps(state: AppStore) {
  return {
    localesHelper: state.LocalesHelperStore,
    midataService: state.MiDataServiceStore,
    userProfile: state.UserProfileStore
  };
}

export default connect(mapStateToProps, undefined)(AssessmentArchive);
