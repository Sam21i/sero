import { IQuestion, QuestionnaireData } from "@i4mi/fhir_questionnaire";
import { Bundle, BundleType, Composition, CompositionSectionMode, CompositionStatus, Media, NarrativeStatus, Observation, Questionnaire, QuestionnaireResponse, Reference } from "@i4mi/fhir_r4";

export interface PrismSessionResources {
    observation: Observation;
    questionnaire: Questionnaire;
    answers?: QuestionnaireResponse;
    image?: Media;
}

export default class PrismSession {
    private observation: Observation;
    private image?: Media;
    private date: Date;
    private questionnaireData: QuestionnaireData;


    constructor(_data: Partial<PrismSession> | PrismSessionResources) {
        
        if ((_data as PrismSessionResources).composition && (_data as PrismSessionResources).observation) {
            const resources = _data as PrismSessionResources;
            this.observation = resources.observation;
            this.questionnaireData = new QuestionnaireData(resources.questionnaire);
            this.image = resources.image;
            if (resources.answers) {
                this.questionnaireData.restoreAnswersFromQuestionnaireResponse(resources.answers);
            }
        } else {
            Object.assign(this, _data);
        }
    }

    resetData(): void {
    }

    getFollowUpQuestions(): IQuestion[] {
     return this.questionnaireData.items
    }

    /**
     * Returns a bundle representing the prism session, ready to upload to MIDATA
     * @returns a valid FHIR bundle of type transaction
     */
    getUploadBundle(_patientReference: Reference): Bundle {
        return {
            type: BundleType.TRANSACTION
        };
    }
}