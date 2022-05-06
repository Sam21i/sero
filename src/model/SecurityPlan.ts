import {CarePlan, CarePlanIntent, CarePlanStatus, Reference} from '@i4mi/fhir_r4';
import fhirpath from 'fhirpath';
import {v4 as uuid} from 'uuid';
import EMPTY_SECURITY_PLAN from '../resources/static/emptySecurityplan.json';

const CODE_SYSTEM = 'http://midata.coop/sero/securityplan';

export enum SECURITY_PLAN_MODULE_TYPE {
  MOTIVATION = 'motivation',
  WARNING_SIGNS = 'warningSigns',
  COPING_STRATEGIES = 'copingStrategies',
  DISTRACTION_STRATIES = 'distractionStrategies',
  PERSONAL_BELIEFS = 'personalBeliefs',
  PROFESSIONAL_CONTACTS = 'professionalContacts'
}

export interface SecurityPlanModule {
  type: SECURITY_PLAN_MODULE_TYPE;
  order: number;
  title: string;
  description: string;
  entries: string[];
}

export default class SecurityPlanModel {
  fhirResource: CarePlan = {
    status: CarePlanStatus.ACTIVE,
    subject: {},
    intent: CarePlanIntent.PLAN,
    contained: [],
    basedOn: [],
    created: ''
  };

  constructor(_data: Partial<SecurityPlanModel> | CarePlan) {
    if ((_data as CarePlan).resourceType && (_data as CarePlan).resourceType === 'CarePlan') {
      this.setFhirResource(_data as CarePlan);
    } else if (Object.getOwnPropertyNames(_data).length === 0) {
      // create new security plan
      this.fhirResource = EMPTY_SECURITY_PLAN as CarePlan;
      this.fhirResource.created = new Date().toISOString();
      this.fhirResource.id = uuid();
    } else {
      // is Partial<SecurityPlanModel>
      Object.assign(this, _data);
    }
  }

  /**
   * Sets the complete CarePlan FHIR resource.
   * @param _fhirResource
   */
  private setFhirResource(_fhirResource: CarePlan) {
    this.fhirResource = _fhirResource;
  }

  /**
   * Checks if a given FHIR Careplan has the same FHIR ID as the Security Plan.
   * @param _fhirResource a CarePlan resource to compare
   * @returns             true if both the given _fhirResource and
   *                      the security plans FHIR resource have the same ID
   *                      false if t
   */
  hasEqualFhirId(_fhirResource: CarePlan): boolean {
    return this.fhirResource.id === _fhirResource.id;
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
    this.fhirResource.status = CarePlanStatus.REVOKED;
  }

  /**
   * Gets a date string of the security plans creation date
   * @param locale
   * @returns locale representation of the date
   */
  getLocaleDate(locale: string): string {
    if (this.fhirResource.created) {
      return new Intl.DateTimeFormat('de-CH', {dateStyle: 'long', timeStyle: 'short'}).format(
        new Date(this.fhirResource.created)
      );
    } else {
      return '';
    }
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
        'Error in updateModulesWithOrder(): Wrong number of modules (expected: ' +
          this.fhirResource.contained?.length +
          ', got: ' +
          _modules.length +
          ').'
      );
    }
    for (let i = 0; i < _modules.length; i++) {
      for (let j = i + 1; j < _modules.length; j++) {
        if (_modules[i].order === _modules[j].order) {
          throw new Error(
            'Error in updateModulesWithOrder(): Modules must have different order numbers (' +
              i +
              '. and ' +
              j +
              '. both have ' +
              _modules[i].order +
              ').'
          );
        }
      }
    }

    // sort array by order number
    _modules.sort((a, b) => a.order - b.order);

    // overwrite fhirResource
    this.setModulesOnFhir(_modules);
  }

  /**
   * Get the title of the security plan.
   * @returns   the title of the security plan or an empty string if
   *            title is not defined.
   */
  getTitle(): string {
    return this.fhirResource.title || '';
  }

  /**
   * Get the security plans modules as SecurityPlanModule array.
   * @returns   an Array of SecurityPlanModule in sorted order
   */
  getSecurityPlanModules(): SecurityPlanModule[] {
    if (this.fhirResource.contained) {
      const modules = new Array<SecurityPlanModule>();
      this.fhirResource.contained.forEach((containedResource, index) => {
        if (containedResource.resourceType === 'CarePlan') {
          modules.push(this.mapCarePlanToSecurityPlanModule(containedResource as CarePlan, index));
        }
      });
      return modules;
    } else {
      return [];
    }
  }

  /**
   * Gets the the security plan module of a given type.
   * @param moduleType  the type of the security plan module to be returned.
   * @returns           the security plan module as
   * @throws            an Error if no security plan has been loaded from midata before or
   *                    the loaded plan does not contain the module requested.
   */
  getSecurityPlanModule(_moduleType: SECURITY_PLAN_MODULE_TYPE): SecurityPlanModule {
    const index = this.fhirResource.contained?.findIndex((containedResource) => {
      fhirpath.evaluate(containedResource, 'CarePlan.category.coding.code')[0] === _moduleType;
    });
    if (index && index > -1 && this.fhirResource.contained) {
      const module = this.fhirResource.contained[index] as CarePlan;
      return this.mapCarePlanToSecurityPlanModule(module, index);
    } else {
      throw new Error(
        'No securityplan module of type ' +
          _moduleType +
          ' available. Make sure to load SecurityPlan before trying to get modules.'
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
    this.fhirResource.contained?.forEach((containedResource) => {
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
        ".where(category.coding.system='" +
        CODE_SYSTEM +
        "')" +
        ".where(category.coding.code='+ _type + ')"
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
        id: module.type,
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
        activity: module.entries.map((entry) => {
          return {
            detail: {
              status: 'unknown',
              description: entry
            }
          };
        })
      };
    });
  }

  private mapCarePlanToSecurityPlanModule(_sp: CarePlan, index: number): SecurityPlanModule {
    return {
      type: fhirpath.evaluate(_sp, 'CarePlan.category.coding.code')[0],
      order: index,
      title: _sp.title || '',
      description: _sp.description || '',
      entries: _sp.activity?.map((activity) => activity.detail?.description || '') || []
    };
  }
}
