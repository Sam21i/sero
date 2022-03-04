import Action from './helpers/Action';
export const APPLICATION_STARTED = 'ServiceData/APPLICATION_STARTED';

export function applicationStarted(dispatch: any) {
    dispatch(new Action(APPLICATION_STARTED).getObjectAction());
}