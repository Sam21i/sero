import {StackNavigationProp} from '@react-navigation/stack';
import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import AppButton from '../components/AppButton';
import EmergencyNumberButton from '../components/EmergencyNumberButton';
import SecurityplanSpeechBubble, {SECURITYPLAN_SPEECH_BUBBLE_MODE} from '../components/SecurityplanSpeechBubble';
import LocalesHelper from '../locales';
import SecurityPlanModel, {SECURITY_PLAN_MODULE_TYPE} from '../model/SecurityPlan';
import {SecurityPlanModule} from '../model/SecurityPlan';
import SortableList from 'react-native-sortable-list';
import UserProfile from '../model/UserProfile';
import SecurityPlanModuleComponent from '../components/SecurityPlanModuleComponent';
import {AppStore} from '../store/reducers';
import {AppFonts, colors, scale, TextSize} from '../styles/App.style';
import SecurityPlanEditModal from '../components/SecurityPlanEditModal';
import * as userProfileActions from '../store/userProfile/actions';
import * as midataServiceActions from '../store/midataService/actions';
import { CarePlan, Reference, Resource } from '@i4mi/fhir_r4';

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
  draggedModule: SECURITY_PLAN_MODULE_TYPE | undefined;
  currentEditModule: SecurityPlanModule;
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
      currentEditModule: undefined
    };
  }

  onBubbleClose(mode: SECURITYPLAN_SPEECH_BUBBLE_MODE): void {
    const newState = {
      bubbleVisible: false,
      isEditMode: this.state.isEditMode,
      isReplaceMode: this.state.isReplaceMode,
      previousOrder: this.state.moduleOrder.slice() // use slice for copying values but not reference
    };
    switch (mode) {
      case SECURITYPLAN_SPEECH_BUBBLE_MODE.new:
        newState.isReplaceMode = true;
        newState.isEditMode = true;
        this.newSecurityPlan();
        break;
      case SECURITYPLAN_SPEECH_BUBBLE_MODE.edit:
        newState.isEditMode = true;
      default: // nothing to do here, just close the bubble
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
      let modules = [...this.state.modules];
      modules[index] = editedModule;
      // make sure state gets updated
      this.setState(
        {
          modules: modules
        },
        () => {
          console.log(this.state.modules);
          this.setState({modalVisible: false});
        }
      );
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

  save() {
    if (this.state.isEditMode) {
      // get handy references ready
      const userReference = this.props.userProfile.getFhirReference();
      // sync order of modules in table and model
      this.state.moduleOrder.forEach((orderEntry, index) => {
        this.state.modules[parseInt(orderEntry)].order = index;
      });
      this.state.currentSecurityplan.setModulesWithOrder(this.state.modules);
      // then send to midata
      if (userReference) {
        this.props.synchronizeResource(this.state.currentSecurityplan.getFhirResource(userReference));
      }
    }
    if (this.state.isReplaceMode) {
      const userReference = this.props.userProfile.getFhirReference();
      if (userReference && this.state.replacedSecurityplan) {
        this.props.replaceSecurityPlan(
          this.state.currentSecurityplan, 
          this.state.replacedSecurityplan, 
          userReference
        );
      }
    }
    
    this.setState({
      isEditMode: false,
      isReplaceMode: false,
      modules: this.state.currentSecurityplan.getSecurityPlanModules()
    });
  }

  reset() { 
    const newState = {
      isEditMode: false,
      isReplaceMode: false,
      currentSecurityPlan: this.state.currentSecurityplan,
      replacedSecurityPlan: this.state.replacedSecurityplan,
      modules: this.state.currentSecurityplan.getSecurityPlanModules()
    }
    if (this.state.isReplaceMode && this.state.replacedSecurityplan) {
      newState.currentSecurityPlan = this.state.replacedSecurityplan;
      newState.modules = this.state.replacedSecurityplan.getSecurityPlanModules();
      newState.replacedSecurityPlan = undefined;
    }
    this.setState(newState);
  }

  renderListHeader() {
    return (
      <View style={styles.listHeader}>
        <AppButton
          label={this.props.localesHelper.localeString('common.options')}
          icon={
            '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 26.2.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <g> <g> <path fill="#fff" d="M256,0C114.8,0,0,114.8,0,256s114.8,256,256,256s256-114.9,256-256S397.2,0,256,0z M256,472.3 c-119.3,0-216.3-97-216.3-216.3S136.7,39.7,256,39.7s216.3,97,216.3,216.3S375.3,472.3,256,472.3z" /> </g> </g> <g> <g id="options"> <path fill="#fff" d="M216,146.3c0-22.1,17.9-40,40-40s40,17.9,40,40s-17.9,40-40,40S216,168.4,216,146.3z M256,213c-22.1,0-40,17.9-40,40 s17.9,40,40,40s40-17.9,40-40S278.1,213,256,213z M256,319.7c-22.1,0-40,17.9-40,40c0,22.1,17.9,40,40,40s40-17.9,40-40 C296,337.6,278.1,319.7,256,319.7z" /> </g> </g> </svg>'
          }
          position="left"
          color={colors.tumbleweed}
          onPress={() => {
            this.setState({bubbleVisible: true});
          }}
          style={styles.optionsButton}
        />
        {this.state.isEditMode ? <Text style={styles.editHint}>{this.props.localesHelper.localeString('securityplan.editHint')}</Text> : <View style={styles.editHint} />}
      </View>
    );
  }

  renderListFooter() {
    return this.state.isEditMode ? (
      <View style={{flexDirection: 'column'}}>
        {[
          {label: 'common.save', icon: '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>', onPress: this.save.bind(this)},
          {label: 'common.cancel', icon: '<svg id="Ebene_1" data-name="Ebene 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 37.5 37.5"><defs><style>.cls-1,.cls-3{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{stroke:#fff;stroke-width:2.5px;}.cls-4{clip-path:url(#clip-path-2);}</style><clipPath id="clip-path" transform="translate(0 0)"><path class="cls-1" d="M1.25,18.75a17.5,17.5,0,1,0,17.5-17.5,17.51,17.51,0,0,0-17.5,17.5"/></clipPath><clipPath id="clip-path-2" transform="translate(0 0)"><rect class="cls-1" width="37.5" height="37.5"/></clipPath></defs><g class="cls-2"><line class="cls-3" x1="11.25" y1="11.25" x2="26.25" y2="26.25"/><line class="cls-3" x1="26.25" y1="11.25" x2="11.25" y2="26.25"/></g><g class="cls-4"><circle class="cls-3" cx="18.75" cy="18.75" r="17.5"/></g></svg>', onPress: this.reset.bind(this)}
        ].map((button, index) => (
          <AppButton
            key={button.label}
            label={this.props.localesHelper.localeString(button.label)}
            position="right"
            icon={button.icon}
            color={colors.tumbleweed}
            onPress={button.onPress}
            style={styles.backButton}
          />
        ))}
      </View>
    ) : (
      <AppButton
        label={this.props.localesHelper.localeString('common.back')}
        icon={
          '<?xml version="1.0" encoding="UTF-8"?><svg id="a" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 52.5 52.5"><defs><style>.c,.d,.e{fill:none;}.d{stroke-linecap:round;stroke-linejoin:round;}.d,.e{stroke:#fff;stroke-width:2.5px;}.f{clip-path:url(#b);}</style><clipPath id="b"><rect class="c" width="52.5" height="52.5"/></clipPath></defs><polygon class="d" points="31.25 11.75 31.25 40.03 12.11 25.89 31.25 11.75"/><g class="f"><circle class="e" cx="26.25" cy="26.25" r="25"/></g></svg>'
        }
        position="right"
        color={colors.tumbleweed}
        onPress={() => {
          this.props.navigation.goBack();
        }}
        style={styles.backButton}
      />
    );
  }

  render() {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top']}>
        <ImageBackground
          source={require('../resources/images/backgrounds/mood_bg_lightOrange.png')}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <View style={styles.topView}>
            <View style={styles.topTextView}>
              <Text style={styles.topViewTextTitle}>{this.props.localesHelper.localeString('securityplan.current')}</Text>
              <Text style={styles.topViewTextDescr}>{this.state.currentSecurityplan.getLocaleDate(this.props.localesHelper.currentLang || 'de-CH')} </Text>
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
                  onActivateRow={this.onDragModule.bind(this)}
                  onReleaseRow={this.onDropModule.bind(this)}
                  sortingEnabled={this.state.isEditMode}
                  data={this.state.modules}
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
    backgroundColor: 'rgba(203, 95, 11, 0.5)',
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
    margin: scale(20)
  },
  optionsButton: {
    height: scale(50),
    width: scale(200),
    paddingVertical: scale(10)
  },
  backButton: {
    height: scale(50),
    width: scale(200),
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
    top: scale(55)
  },
  bottomView: {
    flex: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.65)'
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
    replaceSecurityPlan: (n: SecurityPlanModel, o: SecurityPlanModel, u: Reference) => userProfileActions.replaceSecurityPlan(dispatch, n, o, u),
    synchronizeResource: (r: Resource) => midataServiceActions.synchronizeResource(dispatch, r)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SecurityplanCurrent);
