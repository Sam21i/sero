import Action from '../helpers/Action';
import {ADD_TO_USER_PROFILE, UPDATE_USER_PROFILE} from '../definitions';
import {UserProfileData} from './reducer';
import {QuestionnaireResponse} from '@i4mi/fhir_r4';

export function updateUserProfile(dispatch, userProfileInfo: UserProfileData) {
  dispatch(new Action(UPDATE_USER_PROFILE, userProfileInfo).getObjectAction());
}

export function addQuestionnaireResponseToUserProfileWithoutUploading(
  dispatch,
  questionnaireResponse: QuestionnaireResponse,
) {
  dispatch(
    new Action(ADD_TO_USER_PROFILE, questionnaireResponse).getObjectAction(),
  );
}
