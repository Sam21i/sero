import {Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, FlatList, Image} from 'react-native';
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
import {AppStore} from '../store/reducers';
import {activeOpacity, AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

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
        <View style={styles.listItem}>
          <View style={styles.listItemContent}>
            <Text
              numberOfLines={2}
              style={styles.listItemTitleText}>
              {this.props.localesHelper.localeString('assessment.former')}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.listItemSubtitleText}>
              {item.getLocaleDate(this.props.localesHelper.currentLang || 'de-CH')}
            </Text>
          </View>
          <View style={styles.listItemContentIcon}>
            <SvgCss
              xml={
                '<?xml version="1.0" encoding="utf-8"?> <svg version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 146.7 146.7" style="enable-background:new 0 0 146.7 146.7;" xml:space="preserve"> <style type="text/css"> .st0{fill:#FFFFFF;} .st1{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-miterlimit:10;} .st2{fill:none;stroke:#FFFFFF;stroke-width:2.4;stroke-linejoin:round;} </style> <g> <path class="st0" d="M45,89.7c14.3,0,25.9-11.6,25.9-25.9S59.2,38,45,38S19.1,49.6,19.1,63.8l0,0l0,0C19.1,78.1,30.7,89.7,45,89.7" /> <circle class="st1" cx="107.9" cy="88.9" r="17.7"/> <rect x="10.8" y="29.8" class="st2" width="125" height="87.1"/> </g> </svg>'
              }
              style={styles.icon}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderListFooter() {
    return (
      <AppButton
        label={this.props.localesHelper.localeString('common.back')}
        icon={
          '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
        }
        position='right'
        color={colors.gold}
        onPress={() => {
          this.state.selectedPrismSession
            ? this.setState({selectedPrismSession: undefined})
            : this.props.navigation.goBack();
        }}
        style={{width: scale(200), marginVertical: scale(20), marginBottom: 70}}
        isLargeButton={false}
      />
    );
  }

  renderList() {
    return (
      <FlatList
        style={{paddingTop: 50}}
        data={this.state.prismSessionHistory}
        renderItem={this.renderListItem.bind(this)}
        ListFooterComponent={this.renderListFooter.bind(this)}
      />
    );
  }

  renderFooterComponent() {
    return (
      <AppButton
        label={this.props.localesHelper.localeString('common.back')}
        icon={
          '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
        }
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
        renderItem={(listElement) => (
          <View style={{paddingLeft: scale(40), paddingRight: scale(20)}}>
            <Question
              question={listElement.item}
              onChangeText={() => {}}
              isArchiveMode={true}
            />
          </View>
        )}
        ListHeaderComponent={this.renderPrismSessionHeader.bind(this)}
        keyExtractor={(item) => item.id}
        ListFooterComponent={this.renderFooterComponent.bind(this)}
      />
    );
  }

  renderPrismSessionHeader() {
    let svgImage = this.state.selectedPrismSession?.getSVGImage() || '';
    let base64Image = this.state.selectedPrismSession?.getBase64Image() || {
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
          source={require('../resources/images/backgrounds/mood_bg_yellow.png')}
          resizeMode='cover'
          style={styles.backgroundImage}>
          {this.state.selectedPrismSession 
          ? (
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
  listItem: {
    marginBottom: scale(20),
    marginRight: scale(80),
    backgroundColor: colors.grey,
    height: scale(80),
    borderTopRightRadius: scale(80),
    borderBottomRightRadius: scale(80),
    flexDirection: 'row'
  },
  listItemTitleText: {
    marginTop: 0.5 * verticalScale(TextSize.verySmall),
    marginLeft: 2 * scale(TextSize.verySmall),
    fontFamily: AppFonts.medium,
    fontSize: scale(TextSize.small),
    color: colors.white
  },
  listItemSubtitleText: {
    marginTop: 0.2 * scale(TextSize.verySmall),
    marginLeft: 2 * scale(TextSize.verySmall),
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall),
    color: colors.black
  },
  image: {
    width: scale(297 * 0.75),
    height: scale(210 * 0.75),
    marginVertical: scale(15)
  },
  icon: {
    flex: 1,
    height: '100%'
  },
  listItemContent: {
    flex: 3
  },
  listItemContentIcon: {
    flex: 1,
    margin: scale(10),
    marginRight: scale(20)
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
