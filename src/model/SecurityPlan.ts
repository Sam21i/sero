import { CarePlan, CarePlanIntent, CarePlanStatus, Reference } from '@i4mi/fhir_r4';
import fhirpath from 'fhirpath';

const CODE_SYSTEM = 'http://midata.coop/sero/CODESYSTEMTBD';

export enum SECURITY_PLAN_MODULE_TYPE {
  MOTIVATION = 'securityplan/motivation',
  WARNING_SIGNS = 'securityplan/warningSigns',
  COPING_STRATEGIES = 'securityplan/copingStrategies',
  DISTRACTION_STRATIES = 'securityplan/distractionStrategies',
  PERSONAL_BELIEFS = 'securityplan/personalBeliefs',
  PROFESSIONAL_CONTACTS = 'securityplan/professionalContacts'
}

export interface SecurityPlanModule {
  type: SECURITY_PLAN_MODULE_TYPE;
  order: number;
  title: string;
  description: string;
  entries: string[];
}

export interface SecurityPlan {
  title: string;
  description: string;
  creationDate?: Date;
  modules: SecurityPlanModule[];
}

export default class SecurityPlanModel {
  fhirResource: CarePlan = {
    status: CarePlanStatus.ACTIVE,
    subject: {},
    intent: CarePlanIntent.PLAN,
    contained: [],
    basedOn: [],
    created: ''
  }

  constructor(_data: Partial<SecurityPlanModel> | CarePlan | SecurityPlan) {
    if ((_data as CarePlan).resourceType && (_data as CarePlan).resourceType === 'CarePlan') {
      this.setFhirResource(_data as CarePlan);
    } else if ((_data as SecurityPlan).modules) { // is SecurityPlan
      const plan = _data as SecurityPlan;
      this.fhirResource = {
        status: CarePlanStatus.ACTIVE,
        title: plan.title,
        description: plan.description,
        subject: {},
        intent: CarePlanIntent.PLAN,
        contained: [],
        basedOn: [],
        created: plan.creationDate?.toISOString()
      }
      this.setModulesOnFhir(plan.modules);
    } else { // is Partial<SecurityPlanModel>
      Object.assign(this, _data);
    }
  }

  /**
   * Sets the complete CarePlan FHIR resource.
   * @param _fhirResource 
   */
  private setFhirResource(_fhirResource: CarePlan){
    this.fhirResource = _fhirResource;
  }

  /**
   * Sets the title attribute of the SecurityPlan.
   * @param _title  the new title as string
   */
  setTitle(_title: string): void {
    this.fhirResource.title = _title;
  }

  /**
   * Sets the description attribute of the SecurityPlan.
   * @param _description  the new description as string
   */
  setDescription(_description: string): void {
    this.fhirResource.description = _description;
  }

  /**
   * Sets the CarePlan FHIR resource status to SUSPENDED
   */
  setStatusToArchived(): void {
    this.fhirResource.status = CarePlanStatus.SUSPENDED;
  }

  /**
   * Updates the security plan modules and their order, given by the order parameter (lowest first)
   * @param _modules  the new modules to replace the current modules in a given order.
   * @throws          an Error if:
   *                  - we do not have the same amount of modules as before
   *                  - two or more modules have the same order number
   */
  setModulesWithOrder(_modules: SecurityPlanModule[]): void {
    // check validity before we do anything
    if (_modules.length !== this.fhirResource.contained?.length) {
      throw new Error(
        'Error in updateModulesWithOrder(): Wrong number of modules (expected: ' + this.fhirResource.contained?.length + ', got: ' + _modules.length + (').')
      );
    }
    for (let i = 0; i < _modules.length; i++) {
      for (let j = i+1; j < _modules.length; j++) {
        if (_modules[i].order === _modules[j].order) {
          throw new Error(
            'Error in updateModulesWithOrder(): Modules must have different order numbers (' + i + '. and ' + j + '. both have ' + _modules[i].order + ').'
          );
        }
      }
    }

    // sort array by order number
    _modules.sort((a,b) => a.order - b.order);

    // overwrite fhirResource
    this.setModulesOnFhir(_modules);
  }

  /**
   * Gets the whole security plan, with description, title and the modules in the ordered way.
   * @returns 
   */
  getSecurityPlan(): SecurityPlan {
    return {
      title: this.fhirResource.title || '',
      description: this.fhirResource.description || '',
      creationDate: this.fhirResource.created ? new Date(this.fhirResource.created) : undefined,
      modules: this.fhirResource.contained?.map((mod, index) => { 
        const carePlan = mod as CarePlan;
        return {
          type: fhirpath.evaluate(carePlan, 'CarePlan.category.coding.code')[0],
          order: index,
          title: carePlan.title || '',
          description: carePlan.description || '',
          entries: carePlan.activity?.map(activity => activity.detail?.description || '') || []
        }
      }) || []
    } || [];
  }

  /**
   * Gets the the security plan module of a given type.
   * @param moduleType  the type of the security plan module to be returned.
   * @returns           the security plan module as 
   * @throws            an Error if no security plan has been loaded from midata before or
   *                    the loaded plan does not contain the module requested.
   */
  getSecurityPlanModule(_moduleType: SECURITY_PLAN_MODULE_TYPE): SecurityPlanModule {
    const index = this.fhirResource.contained?.findIndex(containedResource => {
      fhirpath.evaluate(containedResource, 'CarePlan.category.coding.code')[0] === _moduleType;
    });
    if (index && index > -1 && this.fhirResource.contained) {
      const module = this.fhirResource.contained[index] as CarePlan;
      return {
        type: _moduleType,
        order: index,
        title: module.title || '',
        description: module.description || '',
        entries: module.activity?.map(activity => activity.detail?.description || '') || []
      };
    } else {
      throw new Error(
        'No securityplan module of type ' + _moduleType + ' available. Make sure to load SecurityPlan before trying to get modules.'
      );
    }
  }

  /**
   * Returns the full CarePlan FHIR resource as specified, ready for uploading to MIDATA.
   * Date created is set to current date.
   * @param _patientReference   a FHIR reference to the patient (on MIDATA, or relative in a possible bundle)
   * @returns                   a CarePlan resource depicting the users CarePlan
   */
  getFhirResource(_patientReference: Reference): CarePlan {
    this.fhirResource.id = this.fhirResource.id || 'securityPlan1';
    this.fhirResource.created = new Date().toISOString();
    this.fhirResource.basedOn = [];
    this.fhirResource.subject = _patientReference;
    this.fhirResource.author = _patientReference;
    this.fhirResource.contained?.forEach(containedResource => {
      if (containedResource.resourceType === 'CarePlan') {
        (containedResource as CarePlan).author = _patientReference;
        (containedResource as CarePlan).subject = _patientReference;
        this.fhirResource.basedOn?.push({
          reference: '#' + containedResource.id,
          type: 'CarePlan'
        });
      } 
    });
    return this.fhirResource;
  }

  private findModuleByType(_type: SECURITY_PLAN_MODULE_TYPE): CarePlan {
    return fhirpath.evaluate(
      this.fhirResource, 
      'CarePlan.contained' + 
      '.where(category.coding.system=\'' + CODE_SYSTEM + '\')' +
      '.where(category.coding.code=\'+ _type + \')'
      )[0];
  }

  /**
   * Maps SecurityPlanModules to contained FHIR resources
   * @param _modules the input modules
   */
  private setModulesOnFhir(_modules: SecurityPlanModule[]): void {
    this.fhirResource.contained = _modules.map((module, index) => {
      return {
        resourceType: 'CarePlan',
        id: 'modul' + index,
        status: CarePlanStatus.ACTIVE,
        intent: CarePlanIntent.PLAN,
        title: module.title,
        category: [
          {
            coding: [
              {
                system: CODE_SYSTEM,
                code: module.type
              }
            ]
          }
        ],
        description: module.description,
        activity: module.entries.map(entry => {
          return {
            status: 'unknown',
            description: entry
          };
        })
      }
    });
  }
}