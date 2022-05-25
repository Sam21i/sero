import Config from 'react-native-config';
import UserProfile from './UserProfile';
import {Bundle, CarePlan, CarePlanStatus, Media, Observation, Patient, Questionnaire, QuestionnaireResponse, RelatedPerson, Resource} from '@i4mi/fhir_r4';
import UserSession from './UserSession';
import {store} from '../store';
import {logoutUser} from '../store/midataService/actions';
import EmergencyContact from './EmergencyContact';
import RNFetchBlob from 'rn-fetch-blob';
import { PrismResources, PRISM_OBSERVATION_CODE } from './PrismSession';
import PRISM_QUESTIONNAIRE  from '../resources/static/Questionnaire.json'

export default class MidataService {
  currentSession: UserSession = new UserSession();
  pendingResources: Array<{
    resource: Resource;
    isUploading: boolean;
    mustBeSynchronized: boolean;
  }> = [];

  readonly OBSERVATION_ENDPOINT = '/fhir/Observation';
  readonly PATIENT_ENDPOINT = '/fhir/Patient';
  readonly RELATED_PERSON_ENDPOINT = '/fhir/RelatedPerson';
  readonly CARE_PLAN_ENDPOINT = '/fhir/CarePlan';
  readonly RESPONSE_ENDPOINT = '/fhir/QuestionnaireResponse';
  readonly MEDIA_ENDPOINT = '/fhir/Media';


  constructor(miDataServiceStore?: MidataService) {
    if (miDataServiceStore) {
      this.currentSession = new UserSession(miDataServiceStore.currentSession);

      if (miDataServiceStore.hasOwnProperty('pendingResources')) {
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
  public authenticateUser(
    accessToken: string,
    accessTokenExpirationDate: string,
    refreshToken: string,
    server: string
  ): void {
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
      resource: Resource;
      isUploading: boolean;
      mustBeSynchronized: boolean;
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
        this.fetch(this.PATIENT_ENDPOINT, 'GET') // load patient resource
        // place for other resource fetching being added later
      ])
        .then((results) => {
          // cast as bundle and remove 'entered in error' entries
          const bundles = results.map((result) => {
            const bundle = result as Bundle;
            return bundle;
          });
          if (bundles[0].entry === undefined) {
            reject('No user data returned');
          } else {
            const resource = bundles[0].entry[0].resource as Patient;

            resolve(
              new UserProfile({
                patientResource: resource
              })
            );
          }
        })
        .catch((error) => {
          console.log('Error when getting user data', error);
          reject(error);
        });
    });
  }

  public fetchEmergencyContactsForUser(_userID: string): Promise<EmergencyContact[]> {
    return new Promise((resolve, reject) => {
      this.fetch(this.RELATED_PERSON_ENDPOINT + '?patient=' + _userID, 'GET')
        .then((result) => {
          const contacts = new Array<EmergencyContact>();
          const waitForImagePromises = new Array<Promise<any>>();
          if ((result as Bundle).entry) {
            ((result as Bundle).entry || []).forEach((c) => {
              if (c.resource && c.resource.resourceType === 'RelatedPerson') {
                const contact = new EmergencyContact(c.resource as RelatedPerson);
                const photo = (c.resource as RelatedPerson).photo?.find(
                  (p) => p.title && p.title.indexOf('Profilbild') > -1
                );
                if (photo && photo.url) {
                  waitForImagePromises.push(
                    this.fetchImageBase64WithToken(photo.url)
                      .then((base64img) => {
                        contact.setImage({
                          contentType: photo.contentType || '',
                          data: photo.contentType + ';base64,' + base64img
                        });
                      })
                      .catch((e) => {
                        console.log('Error fetching contact avatar from ' + photo.url, e);
                      })
                  );
                }
                contacts.push(contact);
              }
            });
          }
          Promise.all(waitForImagePromises).finally(() => {
            resolve(contacts);
          });
        })
        .catch((e) => {
          console.log('could not load related persons', e);
          return reject();
        });
    });
  }

  public fetchPrismSessions(_userID: string): Promise<PrismResources[]> {
    const prismResources = new Array<PrismResources>();
    const questionnaire = undefined;

    const waitForIt = [
      // fetch Questionnaire (needed for rendering follow-up questions)
      new Promise((resolve, reject) => {
        console.warn('TODO: implement fetching PRISM questionnaire from (open endpoint?) MIDATA');
        return resolve(PRISM_QUESTIONNAIRE as Questionnaire);
      }),
      // fetch PRISM-S observation resources
      new Promise((resolve, reject) => {
        this.fetch(this.OBSERVATION_ENDPOINT + '?patient=' + _userID + '&code=' + PRISM_OBSERVATION_CODE.system + '|' + PRISM_OBSERVATION_CODE.code)
      .then(res => {
        const bundle = res as Bundle;
        bundle.entry?.forEach(entry => {
          const observation = entry.resource as Observation;
          const resources: Partial<PrismResources> = {
            observation: observation as Observation,
            questionnaire: questionnaire
          }
          // fetch QuestionnaireResponse to Observation
          waitForIt.push(
            this.fetch(this.RESPONSE_ENDPOINT + '?part-of=Observation/' + observation.id)
            .then(res => {
              const responseBundle = res as Bundle;
              if (responseBundle.entry && responseBundle.entry[0] && responseBundle.entry[0].resource) {
                resources.questionnaireResponse = responseBundle.entry[0].resource as QuestionnaireResponse;
                return resources.questionnaireResponse;
              } else {
                // This observation has no corresponding QuestionnaireResponse. Which is fine. Totally fine. Really.
                return undefined;
              }
            })
            .catch(e => {
              console.log('Error fetching QuestionnaireResponse for PRISM observation ' + observation.id);
              return reject(e);
            })
          );
          // fetch Media to Observation
          const mediaReference = observation.derivedFrom 
            ? observation.derivedFrom[0].reference
            : undefined;
          if (mediaReference) {
            waitForIt.push(
              this.fetch('/fhir/' + mediaReference)
              .then(res => {
                if (res.resourceType === 'Media') {
                  const media = res as Media;
                  resources.media = media;
                  if (media.content.url) {
                    return this.fetchImageBase64WithToken(media.content.url)
                    .then(imageData => {
                      media.content.data = imageData;
                      return media;
                    })
                    .catch(e => {
                      console.log('Error fetching image for Media/' + media.id + ':', e);
                      reject(e);
                    });
                  }
                }
              })
              .catch(e => {
                console.log('Error fetching' + mediaReference + ' for PRISM observation ' + observation.id);
                reject(e);
              })
            );
          } else {
            console.warn('PRISM observation ' + observation.id + ' has no derivedFrom Media resource.');
          }
          
          prismResources.push(resources as PrismResources);
        });
        if (!bundle.entry || bundle.entry.length === 0) {
          return resolve([]);
        }
      })
      .catch(e => {
        console.log('Error fetching prism resources: ', e);
        reject(e);
      })
      })
    ];
    return Promise.all(waitForIt)
    .then((results) => {
      return prismResources.filter(r => {
        // only return complete PrismResource sets
        r.questionnaire = results[0] as Questionnaire;
        if (r.media !== undefined && r.observation !== undefined) {
          return true;
        } else {
          console.log('Observation ' + r.observation + ' resulted in incomplete PrismResources set and was thus filtered out.', r);
          return false;
        }
      });
    })
    .catch(e => {
      console.log('Something unexpected happened fetching all the PRISM-S sessions.', e);
      return Promise.reject();
    });
  }

  /**
   * Loads security plan(s) from MIDATA
   * @param _history?    boolean indicating if the archived plans should be loaded (defaults to false)
   * @returns            an Array of the found CarePlan resources
   */
  public fetchSecurityPlans(_history?: boolean): Promise<CarePlan[]> {
    return new Promise((resolve, reject) => {
      this.fetch(
        this.CARE_PLAN_ENDPOINT + '?status=' + (_history ? CarePlanStatus.REVOKED : CarePlanStatus.ACTIVE),
        'GET'
      )
        .then((result) => {
          const carePlans = (result as Bundle).entry?.map((entry) => entry.resource as CarePlan) || ([] as CarePlan[]);
          return resolve(carePlans);
        })
        .catch((e) => {
          console.log('Error in midataService.fetchSecurityPlans()', e);
          return reject('Could not load SecurityPlans.');
        });
    });
  }

  /**
   * Used to load an image (eg. an avatar) from MIDATA, that is only accessible with
   * access token.
   * @param _url   the url of the image, with or without additional parameters
   * @return       a Promise with the image as base64 string
   **/
  private fetchImageBase64WithToken(_url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.currentSession
        .getValidAccessToken()
        .then((accessToken) => {
          const url = _url + (_url.indexOf('?') > -1 ? '&access_token=' + accessToken : '?access_token=' + accessToken);
          RNFetchBlob.fetch('GET', url)
            .then((image) => {
              return resolve(image.base64());
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
            response
              .text()
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
          console.log("Can't reach server", error);
          return reject("Can't reach server.");
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
  public fetch(endpoint: string, method = 'GET', body: string | undefined = undefined): Promise<Resource> {
    return new Promise((resolve, reject) => {
      let headersContent = {
        Accept: 'application/json',
        'Content-Type': 'application/fhir+json; fhirVersion=4.0',
        Authorization: ''
      };

      if (endpoint.indexOf(Config.open_endpoint) > -1) {
        // no need for authorization when we talk to the open endpoint
        return this.actualFetch(Config.host + endpoint, {
          method: method,
          headers: headersContent,
          body: body
        }).then((r) => {
          return resolve(r as Resource);
        });
      } else {
        // get valid token:
        this.currentSession
          .getValidAccessToken()
          .then((accessToken: string | undefined) => {
            if (!accessToken) {
              reject("Can't fetch when no user logged in first or token is no longuer valid.");
            }
            headersContent.Authorization = 'Bearer ' + accessToken;

            return this.actualFetch(Config.host + endpoint, {
              method: method,
              headers: headersContent,
              body: body
            });
          })
          .then((r) => {
            return resolve(r as Resource);
          })
          .catch((error) => {
            console.warn('Error fetching from url ' + Config.host + endpoint);
            reject(error);
          });
      }
    });
  }

  private setPendingResources(
    _resources: Array<{resource: Resource; isUploading: boolean; mustBeSynchronized: boolean}>
  ) {
    this.pendingResources = new Array<{resource: Resource; isUploading: boolean; mustBeSynchronized: boolean}>();
    _resources.forEach((resource) => {
      this.pendingResources.push(resource);
    });
  }
}
