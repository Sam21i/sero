import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import SecurityPlanModuleComponent from '../components/SecurityPlanModuleComponent';
import LocalesHelper from '../locales';
import MidataService from '../model/MidataService';
import SecurityPlanModel from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import {AppFonts, appStyles, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  midataService: MidataService;
  userProfile: UserProfile;
}

interface State {
  bubbleVisible: boolean;
  securityplanHistory: SecurityPlanModel[];
  selectedSecurityplan: SecurityPlanModel | undefined;
}

class SecurityplanArchive extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    this.state = {
      bubbleVisible: false,
      securityplanHistory: this.props.userProfile.getSecurityPlanHistory(),
      selectedSecurityplan: undefined
    };
  }

  renderFooterComponent() {
    return (
      <AppButton
        label={this.props.localesHelper.localeString('common.back')}
        icon={images.imagesSVG.common.back}
        position='right'
        color={colors.tumbleweed}
        onPress={() => {
          this.state.selectedSecurityplan
            ? this.setState({selectedSecurityplan: undefined})
            : this.props.navigation.goBack();
        }}
        style={{width: scale(225), marginVertical: scale(20)}}
        isLargeButton={false}
      />
    );
  }

  renderList() {
    return (
      <FlatList
        data={this.state.securityplanHistory}
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

  renderListItem({item}) {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({selectedSecurityplan: item});
        }}
        key={item.fhirResource.id}>
        <View style={appStyles.listItem}>
          <View style={appStyles.listItemContent}>
            <Text
              numberOfLines={2}
              style={appStyles.listItemTitleText}>
              {this.props.localesHelper.localeString('securityplan.former')}
            </Text>
            <Text
              numberOfLines={1}
              style={appStyles.listItemSubtitleText}>
              {item.getLocaleDate(this.props.localesHelper.currentLang || 'de-CH')}
            </Text>
          </View>
          <View style={appStyles.listItemContentIcon}>
            <SvgCss
              xml={images.imagesSVG.common.securityplan}
              style={appStyles.listItemIcon}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderSecurityplanItem({item}) {
    return (
      <SecurityPlanModuleComponent
        localesHelper={this.props.localesHelper}
        key={'key.' + item.title}
        editable={false}
        isBeingDragged={false}
        module={item}
      />
    );
  }

  renderSecurityplan() {
    let filteredModules = this.state.selectedSecurityplan.getSecurityPlanModules().filter((m) => m.entries.length > 0);
    filteredModules =
      filteredModules.length > 1 ? filteredModules : this.state.selectedSecurityplan.getSecurityPlanModules();
    return (
      <FlatList
        data={filteredModules}
        renderItem={this.renderSecurityplanItem.bind(this)}
        alwaysBounceVertical={false}
        ListHeaderComponent={this.renderListHeaderComponent}
        ListFooterComponent={this.renderFooterComponent.bind(this)}
      />
    );
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={images.imagesPNG.backgrounds.moodLightOrange}
          resizeMode='cover'
          style={styles.backgroundImage}>
          {this.state.selectedSecurityplan ? (
            <View style={styles.topView}>
              <View style={styles.topTextView}>
                <Text style={[styles.topViewTextTitle, {fontSize: TextSize.normal}]}>
                  {this.props.localesHelper.localeString('securityplan.former')}
                </Text>
                <Text style={styles.topViewTextDescr}>
                  {this.state.selectedSecurityplan.getLocaleDate(this.props.localesHelper.currentLang || 'de-CH')}{' '}
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
            {this.state.selectedSecurityplan ? this.renderSecurityplan() : this.renderList()}
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
    backgroundColor: colors.primary50opac,
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

export default connect(mapStateToProps, undefined)(SecurityplanArchive);
