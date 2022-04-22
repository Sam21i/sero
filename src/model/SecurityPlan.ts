import { CarePlan, CarePlanIntent, CarePlanStatus, Reference } from '@i4mi/fhir_r4';

export default class SecurityPlan {
  fhirResource: CarePlan = {
    status: CarePlanStatus.ACTIVE,
      subject: {},
      intent: CarePlanIntent.PLAN
  }

  constructor(_data: Partial<SecurityPlan> | CarePlan) {
    if ((_data as CarePlan).resourceType && (_data as CarePlan).resourceType === 'CarePlan') {
      this.fillFromResource(_data as CarePlan);
    } else {
      Object.assign(this, _data);
    }
  }

  fillFromResource(_fhirResource: CarePlan){
    console.warn('SecurityPlan.fillFromResource() is not yet implemented');
  }

  isEqual(_securityPlan: SecurityPlan): boolean {
    console.warn('SecurityPlan.isEqual() is not yet implemented');
    return false;
  }

  createFhirResource(_patientReference: Reference, _data?: Partial<SecurityPlan>, ): CarePlan {
    return {
      status: CarePlanStatus.ACTIVE,
      subject: _patientReference,
      intent: CarePlanIntent.PLAN
    };
  }
}