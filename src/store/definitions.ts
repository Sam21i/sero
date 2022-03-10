export const UPDATE_USER_AUTHENTICATION = 'miDataService/UPDATE_USER_AUTHENTICATION';
export const LOGOUT_AUTHENTICATE_USER = 'miDataService/LOGOUT_AUTHENTICATE_USER';
export const ADD_RESOURCE = 'miDataService/ADD_RESOURCE';
export const RESOURCE_SENT = 'miDataService/RESOURCE_SENT';
export const ADD_RESOURCE_TO_SYNCHRONIZE = 'miDataService/ADD_RESOURCE_TO_SYNCHRONIZE';
export const ALL_RESOURCES_SENT = 'miDataService/ALL_RESOURCES_SENT';

export const UPDATE_USER_PROFILE = 'userProfile/UPDATE_USER_PROFILE';
export const SET_EMERGENCY_CONTACTS = 'userProfile/SET_EMERGENCY_CONTACTS';
export const ADD_TO_USER_PROFILE = 'userProfile/ADD_TO_USER_PROFILE';

export const UPDATE_LOCALE_LANGUAGE = 'localesHelper/UPDATE_LOCALE_LANGUAGE';

export type UserAuthenticationData = {
    accessToken: string,
    accessTokenExpirationDate: string,
    refreshToken: string,
    server: string
};
