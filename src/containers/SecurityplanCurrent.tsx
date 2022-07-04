import {Reference, Resource} from '@i4mi/fhir_r4';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SortableList from 'react-native-sortable-list';
import {connect} from 'react-redux';

import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import SecurityPlanEditModal from '../components/SecurityPlanEditModal';
import SecurityPlanModuleComponent from '../components/SecurityPlanModuleComponent';
import SecurityplanSpeechBubble, {SECURITYPLAN_SPEECH_BUBBLE_MODE} from '../components/SecurityplanSpeechBubble';
import LocalesHelper from '../locales';
import SecurityPlanModel, {SECURITY_PLAN_MODULE_TYPE, SecurityPlanModule} from '../model/SecurityPlan';
import UserProfile from '../model/UserProfile';
import images from '../resources/images/images';
import * as midataServiceActions from '../store/midataService/actions';
import {AppStore} from '../store/reducers';
import * as userProfileActions from '../store/userProfile/actions';
import {AppFonts, colors, scale, TextSize, verticalScale} from '../styles/App.style';

interface PropsType {
  navigation: StackNavigationProp<any>;
  localesHelper: LocalesHelper;
  userProfile: UserProfile;
  synchronizeResource: (r: Resource) => void;
  replaceSecurityPlan: (newPlan: SecurityPlanModel, oldPlan: SecurityPlanModel, u: Reference) => void;
}

interface State {
  currentSecurityplan: SecurityPlanModel;
  replacedSecurityplan: SecurityPlanModel | undefined;
  bubbleVisible: boolean;
  modules: SecurityPlanModule[];
  isEditMode: boolean;
  isReplaceMode: boolean;
  moduleOrder: string[];
  modalVisible: boolean;
  isFirstPlan: boolean;
  draggedModule: SECURITY_PLAN_MODULE_TYPE | undefined;
  currentEditModule: SecurityPlanModule | undefined;
}

class SecurityplanCurrent extends Component<PropsType, State> {
  constructor(props: PropsType) {
    super(props);

    let startWithEmptyPlan = false;

    let plan = this.props.userProfile.getCurrentSecurityPlan();
    if (plan.getSecurityPlanModules().length === 0) {
      // create a new, empty security plan
      plan = new SecurityPlanModel({});
      startWithEmptyPlan = true;
    }
    if (plan.fhirResource.id === 'emptyPlan') {
      startWithEmptyPlan = true;
    }
    const modules = plan.getSecurityPlanModules();

    this.state = {
      currentSecurityplan: plan,
      replacedSecurityplan: undefined,
      bubbleVisible: false,
      isEditMode: startWithEmptyPlan,
      isReplaceMode: false,
      modules: modules,
      draggedModule: undefined,
      moduleOrder: modules.map((module) => module.order.toString()),
      modalVisible: false,
      isFirstPlan: startWithEmptyPlan,
      currentEditModule: undefined
    };
  }

  onBubbleClose(mode: SECURITYPLAN_SPEECH_BUBBLE_MODE): void {
    const newState: Partial<State> = {
      bubbleVisible: false,
      isEditMode: this.state.isEditMode,
      isReplaceMode: this.state.isReplaceMode
    };
    switch (mode) {
      case SECURITYPLAN_SPEECH_BUBBLE_MODE.new:
        newState.isReplaceMode = true;
        newState.isEditMode = true;
        this.newSecurityPlan();
        break;
      case SECURITYPLAN_SPEECH_BUBBLE_MODE.edit:
        newState.isEditMode = true;
        break;
      default:
    }
    this.setState(newState);
  }

  newSecurityPlan(): void {
    const previousPlan = this.state.currentSecurityplan;
    const newPlan = new SecurityPlanModel({});

    this.setState({
      currentSecurityplan: newPlan,
      replacedSecurityplan: previousPlan,
      modules: newPlan.getSecurityPlanModules()
    });
  }

  editModule(m: SecurityPlanModule): void {
    this.setState({currentEditModule: m}, () => {
      this.setState({modalVisible: true});
    });
  }

  onEditedModule(editedModule: SecurityPlanModule): void {
    const index = this.state.modules.findIndex((m) => m.type === editedModule.type);
    if (index > -1) {
      const modules = [...this.state.modules];
      modules[index] = editedModule;
      // make sure state gets updated
      this.setState({
        modules: modules,
        modalVisible: false
      });
    }
  }

  onDragModule(key: number) {
    const draggedModule = this.state.modules[key];
    this.setState({
      draggedModule: draggedModule.type
    });
  }

  onDropModule(key: number, order: string[]) {
    this.setState({
      draggedModule: undefined,
      moduleOrder: order
    });
  }

  filterVisibleModules(): SecurityPlanModule[] {
    const filteredModules = this.state.modules.filter((m) => m.entries.length > 0);
    return filteredModules.length > 1 ? filteredModules : this.state.modules;
  }

  save() {
    const userReference = this.props.userProfile.getFhirReference();
    // sync order of modules in table and model
    this.state.moduleOrder.forEach((orderEntry, index) => {
      const newModules = this.state.modules.slice(0);
      newModules[parseInt(orderEntry)].order = index;
      this.setState({modules: newModules});
    });
    this.state.currentSecurityplan.setModulesWithOrder(this.state.modules);

    if (this.state.isReplaceMode) {
      if (userReference && this.state.replacedSecurityplan) {
        this.props.replaceSecurityPlan(this.state.currentSecurityplan, this.state.replacedSecurityplan, userReference);
      }
    } else if (this.state.isEditMode) {
      if (userReference) {
        this.props.synchronizeResource(this.state.currentSecurityplan.getFhirResource(userReference));
      }
    }

    this.setState({
      isEditMode: false,
      isReplaceMode: false,
      isFirstPlan: false,
      modules: this.state.currentSecurityplan.getSecurityPlanModules()
    });
  }

  reset() {
    const newState: Partial<State> = {
      isEditMode: false,
      isReplaceMode: false,
      currentSecurityplan: this.state.currentSecurityplan,
      replacedSecurityplan: this.state.replacedSecurityplan,
      modules: this.state.currentSecurityplan.getSecurityPlanModules()
    };
    if (this.state.isReplaceMode && this.state.replacedSecurityplan) {
      newState.currentSecurityplan = this.state.replacedSecurityplan;
      newState.modules = this.state.replacedSecurityplan.getSecurityPlanModules();
      newState.replacedSecurityplan = undefined;
    }
    this.setState(newState);
  }

  renderListHeader() {
    return (
      <View style={styles.listHeader}>
        {this.state.isEditMode ? (
          <Text style={styles.editHint}>{this.props.localesHelper.localeString('securityplan.editHint')}</Text>
        ) : (
          <AppButton
            label={this.props.localesHelper.localeString('common.options')}
            icon={images.imagesSVG.common.options}
            position='left'
            color={colors.tumbleweed}
            onPress={() => {
              this.setState({bubbleVisible: true});
            }}
            style={styles.optionsButton}
          />
        )}
      </View>
    );
  }

  renderListFooter() {
    const buttons = new Array<{label: string; icon: string; onPress: () => void}>();
    const saveButton = {
      label: 'common.save',
      icon: images.imagesSVG.common.save,
      onPress: this.save.bind(this)
    };
    const cancelButton = {
      label: 'common.cancel',
      icon: images.imagesSVG.common.cancel,
      onPress: this.reset.bind(this)
    };
    const backButton = {
      label: 'common.back',
      icon: images.imagesSVG.common.back,
      onPress: () => {
        this.props.navigation.goBack();
      }
    };
    if (this.state.isEditMode) {
      buttons.push(saveButton);
      if (this.state.isFirstPlan) {
        buttons.push(backButton);
      } else {
        buttons.push(cancelButton);
      }
    } else {
      buttons.push(backButton);
    }

    return (
      <View style={{flexDirection: 'column'}}>
        {buttons.map((button, index) => (
          <View key={index}>
            <AppButton
              label={this.props.localesHelper.localeString(button.label)}
              position='right'
              icon={button.icon}
              color={colors.tumbleweed}
              onPress={button.onPress}
              style={styles.backButton}
            />
          </View>
        ))}
      </View>
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
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewTextTitle}>
                {this.props.localesHelper.localeString('securityplan.current')}
              </Text>
              <Text style={styles.topViewTextDescr}>
                {this.state.currentSecurityplan.getLocaleDate(this.props.localesHelper.currentLang || 'de-CH')}{' '}
              </Text>
            </View>
          </View>
          <View style={styles.bottomView}>
            {this.state.bubbleVisible ? (
              <SecurityplanSpeechBubble
                navigation={this.props.navigation}
                localesHelper={this.props.localesHelper}
                onClose={this.onBubbleClose.bind(this)}
              />
            ) : (
              <View>
                <SortableList
                  style={{height: '100%'}}
                  key={'sortlist' + this.state.modalVisible + this.state.isEditMode}
                  onActivateRow={this.onDragModule.bind(this)}
                  onReleaseRow={this.onDropModule.bind(this)}
                  sortingEnabled={this.state.isEditMode}
                  data={this.state.isEditMode ? this.state.modules : this.filterVisibleModules()}
                  renderHeader={this.renderListHeader.bind(this)}
                  renderFooter={this.renderListFooter.bind(this)}
                  renderRow={(row: {data: SecurityPlanModule; key: string}) => {
                    return (
                      <SecurityPlanModuleComponent
                        localesHelper={this.props.localesHelper}
                        key={row.key}
                        editable={this.state.isEditMode}
                        isBeingDragged={row.data.type === this.state.draggedModule}
                        onEdit={this.editModule.bind(this)}
                        module={row.data}
                      />
                    );
                  }}
                />
              </View>
            )}
          </View>
          <View style={styles.emergencyButton}>
            <EmergencyNumberButton />
          </View>
          {this.state.modalVisible && (
            <SecurityPlanEditModal
              localesHelper={this.props.localesHelper}
              module={this.state.currentEditModule}
              onSave={(module) => {
                this.onEditedModule(module);
              }}></SecurityPlanEditModal>
          )}
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
    paddingVertical: scale(20),
    alignSelf: 'flex-start',
    justifyContent: 'space-between'
  },
  topViewTextTitle: {
    color: colors.white,
    fontFamily: AppFonts.bold,
    fontSize: scale(TextSize.normal)
  },
  topViewTextDescr: {
    color: colors.black,
    fontFamily: AppFonts.regular,
    fontSize: scale(TextSize.verySmall)
  },
  container: {
    flex: 1
  },
  listHeader: {
    marginTop: scale(20)
  },
  editHint: {
    marginHorizontal: scale(20),
    marginTop: scale(50),
    marginBottom: scale(30)
  },
  optionsButton: {
    height: scale(50),
    width: scale(200),
    paddingVertical: scale(10),
    marginBottom: scale(40)
  },
  backButton: {
    height: scale(50),
    width: scale(225),
    paddingVertical: scale(10),
    marginVertical: 0,
    marginBottom: 20
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
    replaceSecurityPlan: (n: SecurityPlanModel, o: SecurityPlanModel, u: Reference) =>
      userProfileActions.replaceSecurityPlan(dispatch, n, o, u),
    synchronizeResource: (r: Resource) => midataServiceActions.synchronizeResource(dispatch, r)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityplanCurrent);
