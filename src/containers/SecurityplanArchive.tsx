import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';
import {Alert, ImageBackground, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SvgCss} from 'react-native-svg';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import BackButton from '../components/BackButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import SecurityPlanModuleComponent from '../components/SecurityPlanModuleComponent';
import MidataService from '../model/MidataService';
import SecurityPlanModel from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import {AppStore} from '../store/reducers';
import * as userProfileActions from '../store/userProfile/actions';
import {AppFonts, appStyles, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType extends WithTranslation {
  navigation: StackNavigationProp<any>;
  deletePlan: (plan: SecurityPlanModel) => void;
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

  renderList() {
    return (
      <FlatList
        data={this.state.securityplanHistory}
        renderItem={this.renderListItem.bind(this)}
        alwaysBounceVertical={false}
        ListHeaderComponent={this.renderListHeaderComponent}
      />
    );
  }

  renderListHeaderComponent() {
    return <View style={{height: scale(50)}}></View>;
  }

  renderListFooterComponent() {
    if (!this.state.selectedSecurityplan) return <></>;
    return (
      <AppButton
        label={this.props.t('common.delete')}
        position='right'
        color={colors.tumbleweed}
        onPress={() => {
          if (this.state.selectedSecurityplan) this.deleteSelectedSecurityPlan(this.state.selectedSecurityplan);
        }}
        style={styles.deleteButton}
        icon={images.imagesSVG.common.cancel}
      />
    );
  }

  deleteSelectedSecurityPlan(planToDelete: SecurityPlanModel): void {
    Alert.alert(
      this.props.t('securityplan.alertDelete.title'),
      this.props.t('securityplan.alertDelete.description', {
        date: planToDelete.getLocaleDate(this.props.i18n.language)
      }),
      [
        {
          text: this.props.t('common.cancel'),
          style: 'cancel'
        },
        {
          text: this.props.t('common.ok'),
          onPress: () => {
            this.props.deletePlan(planToDelete);
            this.setState({
              selectedSecurityplan: undefined,
              securityplanHistory: this.props.userProfile.getSecurityPlanHistory()
            });
          }
        }
      ]
    );
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
              numberOfLines={1}
              style={appStyles.listItemTitleText}>
              {item.getLocaleDate(this.props.i18n.language || 'de-CH')}
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
        ListFooterComponent={this.renderListFooterComponent.bind(this)}
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
              <BackButton
                color={colors.white}
                onPress={() => {
                  this.state.selectedSecurityplan
                    ? this.setState({selectedSecurityplan: undefined})
                    : this.props.navigation.goBack();
                }}
              />
              <View style={styles.topTextView}>
                <Text style={[styles.topViewTextTitle, {fontSize: TextSize.normal}]}>
                  {this.props.t('securityplan.former')}
                </Text>
                <Text style={styles.topViewTextDescr}>
                  {this.state.selectedSecurityplan.getLocaleDate(this.props.i18n.language || 'de-CH')}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.topView}>
              <BackButton
                color={colors.white}
                onPress={() => {
                  this.props.navigation.pop();
                }}
              />
              <View style={styles.topTextView}>
                <Text style={styles.topViewTextTitle}>{this.props.t('securityplan.archive')}</Text>
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
    flex: 1,
    flexDirection: 'row'
  },
  topTextView: {
    flex: 1,
    alignSelf: 'center',
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
  },
  deleteButton: {
    height: scale(50),
    width: scale(225),
    paddingVertical: scale(10),
    marginVertical: 20
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
    deletePlan: (plan: SecurityPlanModel) => userProfileActions.deleteArchivedSecurityPlan(dispatch, plan)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SecurityplanArchive));
