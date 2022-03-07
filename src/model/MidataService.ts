import Config from 'react-native-config';
import UserProfile from './UserProfile';
import { Bundle, BundleEntry, Patient, RelatedPerson, Resource } from "@i4mi/fhir_r4";
import UserSession from './UserSession';
import { store } from '../store';
import { logoutUser } from '../store/midataService/actions';
import EmergencyContact from './EmergencyContact';

export default class MidataService {
    currentSession: UserSession = new UserSession();
    pendingResources : Array<{
        resource : Resource,
        isUploading : boolean,
        mustBeSynchronized : boolean
    }> = [];

    readonly OBSERVATION_ENDPOINT = "/fhir/Observation";
    readonly PATIENT_ENDPOINT = "/fhir/Patient";
    readonly RELATED_PERSON_ENDPOINT = '/fhir/RelatedPerson';

    constructor(miDataServiceStore?: MidataService) {
        if (miDataServiceStore) {
            this.currentSession = new UserSession(miDataServiceStore.currentSession);

            if (miDataServiceStore.hasOwnProperty('pendingResources') ){
                this.setPendingResources(miDataServiceStore.pendingResources);
            }
        }
    }
   /**
    * Sets the OAuth tokens for the current session.
    * CAVE: This function modifies the store. Do not run it outside of a reducer.
    * @param accessToken
    * @param accessTokenExpirationDate
    * @param refreshToken
    */
    public authenticateUser(accessToken: string, accessTokenExpirationDate: string, refreshToken: string, server: string): void {
        this.currentSession.updateToken(accessToken, accessTokenExpirationDate, refreshToken, server);
    }

   /**
    * Logs out user by deleting access token.
    * CAVE: This function modifies the store. Do not run it outside of a reducer.
    */
    public logoutUser(): void {
        this.currentSession.resetToken();

        // delete all pending (not uploaded) resources // TODO : warn the user before logout
        this.pendingResources = new Array<{
            resource: Resource,
            isUploading: boolean,
            mustBeSynchronized: boolean
        }>();
    }

   /**
    * Checks if currently any user is authenticated with Midata.
    * @returns  true if a valid access token exists
    *           false if no valid access token exists
    */
    public isAuthenticated(): boolean {
        return this.currentSession.isTokenValid();
    }

   /**
    * Loads the user profile data from MIDATA.
    * @returns A promise with an UserProfile containing the personal data from MIDATA.
    */
    public getUserData(): Promise<UserProfile> {
        return new Promise((resolve, reject) => {
           Promise.all([
               this.fetch(this.PATIENT_ENDPOINT, 'GET'), // load patient resource
               // place for other resource fetching being added later
           ]).then((results) => {
               // cast as bundle and remove 'entered in error' entries
               const bundles = results.map((result) => {
                   const bundle = result as Bundle;
                   return bundle;
               })
               if (bundles[0].entry === undefined) {
                   reject('No user data returned');
               } else {
                   const resource = bundles[0].entry[0].resource as Patient;

                   resolve (new UserProfile({
                       patientResource: resource
                   }));
               }
           }).catch((error) => {
               console.log('Error when getting user data', error);
               reject(error);
           });
       });
    }

    public fetchEmergencyContactsForUser(_userID: string): Promise<EmergencyContact[]> {
        return this.fetch(this.RELATED_PERSON_ENDPOINT + '?active=true&patient=' + _userID, 'GET')
        .then((result) => {
            console.log('fetched emergency contacts', result)
            const contacts = new Array<EmergencyContact>();
            if ((result as Bundle).entry) {
                ((result as Bundle).entry || []).forEach(c => {
                    if (c.resource && c.resource.resourceType === 'RelatedPerson') {
                        contacts.push(new EmergencyContact(c.resource as RelatedPerson));
                    }
                });
            }
            return contacts;
        })
        .catch((e) => {
            console.log('could not load related persons', e)
            return Promise.reject();
        });
    }

    /**
    * Used to load an image (eg. an avatar) from MIDATA, that is only accessible with
    * access token.
    * @param _url   the url of the image, with or without additional parameters
    * @return       a Promise with the image
    **/
    private fetchImageWithToken(_url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.currentSession.getValidAccessToken()
            .then((accessToken) => {
                const url = (_url.indexOf('?') > -1)
                ? '&access_token=' + accessToken
                : '?access_token=' + accessToken;
                fetch(url)
                .then((image) => {
                    console.log('fetched image', typeof image, image);
                    return resolve(image)
                })
                .catch((e) => {
                    console.log('midataservice.fetchImageWithToken(): unable to fetch image from url ' + url, e);
                    return reject();
                });
            })
            .catch((e) => {
                console.log('midataservice.fetchImageWithToken(): unable to get valid access token', e);
                return reject();
            });
        });
    }

    private actualFetch(_url: string, _config: RequestInit): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(_url, _config)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    response.text()
                    .then((responseText) => {
                        return resolve(JSON.parse(responseText));
                    })
                    .catch((e) => {
                        return reject('Unknow server response with status: ' + e.status);
                    });
                } else if (response.status === 401) {
                    logoutUser(store.dispatch);
                    return reject('Can\'t fetch: Server responds with "401 unauthorized".');
                } else {
                    return reject('Bad response with status: ' + response.status);
                }
            })
            .catch((error) => {
                console.log('Can\'t reach server', error);
                return reject('Can\'t reach server.');
            });
        });

    }

   /**
    * Does an operation to a given endpoint on MIDATA and returns the servers answer as a Promise.
    * @param endpoint   the endpoint on the server, including trailing '/fhir/' -> e.g. '/fhir/Observation'
    * @param method?    the HTTP method to use. defaults to GET for reading resources
    * @param body?      the body to send with the request. defaults to undefined. this can for example be
    *                   a (stringified) resource to be posted to MIDATA.
    * @Returns          A promise that resolves when the operation is successful, or rejects on errors.
    */
    public fetch(endpoint: string, method = 'GET', body: string|undefined = undefined): Promise<Resource> {
        return new Promise((resolve, reject) => {
            let headersContent = {
                'Accept': 'application/json',
                'Content-Type': 'application/fhir+json; fhirVersion=4.0',
                'Authorization': ''
            }

            if (endpoint.indexOf(Config.open_endpoint) > -1) {
                // no need for authorization when we talk to the open endpoint
                return this.actualFetch(Config.host + endpoint, {
                    method: method,
                    headers: headersContent,
                    body: body
                }).then(r => {
                    return resolve(r as Resource);
                });
            } else {
                // get valid token:
                this.currentSession.getValidAccessToken().then((accessToken: string | undefined) => {
                    if (!accessToken) {
                        reject('Can\'t fetch when no user logged in first or token is no longuer valid.');
                    }
                    headersContent.Authorization = 'Bearer ' + accessToken;

                    return this.actualFetch(Config.host + endpoint, {
                        method: method,
                        headers: headersContent,
                        body: body
                    });
                }).then(r => {
                    return resolve(r as Resource);
                })
                .catch((error) => {
                    console.warn('Can\'t fetch token.');
                    reject(error);
                });
            }
        });
    }

    private setPendingResources(_resources: Array<{resource : Resource, isUploading : boolean, mustBeSynchronized : boolean}>) {
        this.pendingResources = new Array<{resource : Resource, isUploading : boolean, mustBeSynchronized : boolean}>();
        _resources.forEach(resource => {
            this.pendingResources.push(resource);
        });
    }
}
