import Action from '../helpers/Action';
import {
  UserAuthenticationData,
  UPDATE_USER_AUTHENTICATION,
  LOGOUT_AUTHENTICATE_USER,
  ADD_RESOURCE,
  ADD_RESOURCE_TO_SYNCHRONIZE,
  RESOURCE_SENT,
  ALL_RESOURCES_SENT,
  ADD_TO_USER_PROFILE
} from '../definitions';
import {Resource, Bundle, CarePlanStatus, CarePlan} from '@i4mi/fhir_r4';
import {store} from '..';
import {Guid} from 'guid-typescript';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE} from '../../containers/App';

export function authenticateUser(
  dispatch: Function,
  accessToken: string,
  accessTokenExpirationDate: string,
  refreshToken: string,
  server: string
) {
  var actionData: UserAuthenticationData = {
    accessToken,
    accessTokenExpirationDate,
    refreshToken,
    server
  };
  dispatch(new Action(UPDATE_USER_AUTHENTICATION, actionData).getObjectAction());
}

/*
 * Add/Send/save a FHIR resource on a FHIR Server (MIDATA on our case)
 * make a simple HTTP POST
 */
export function addResource(dispatch: Function, resource: Resource) {
  dispatch(new Action(ADD_TO_USER_PROFILE, resource).getObjectAction());
  uploadResource(dispatch, {
    resource: resource,
    isUploading: true,
    mustBeSynchronized: false,
    timestamp: new Date()
  }).catch((error) => {
    console.log('Could not upload ' + resource.id ? resource.id : '' + ', add to queue.', error);
    dispatch(new Action(ADD_RESOURCE, resource).getObjectAction());
  });
}

/*
 * Synchronize/Add/Send/save a FHIR resource on a FHIR Server (MIDATA on our case)
 * check if this resource exist on the FHIR server. If no, we will add the resource.
 * if we found the same resource, we check if the given version is the newest.
 */
export function synchronizeResource(dispatch: Function, resource: Resource) {
  dispatch(new Action(ADD_TO_USER_PROFILE, resource).getObjectAction());
  if (resource.id?.indexOf('temp') === 0) {
    // when resource has temp id, it has not been uploaded before it was edited and synced again
    let uploadJobs = (store.getState() as any).MiDataServiceStore.pendingResources;
    const index = uploadJobs.findIndex((job) => job.resource.id === resource.id);
    if (index > -1) {
      dispatch(new Action(ADD_RESOURCE_TO_SYNCHRONIZE, resource).getObjectAction());
    }
  }
  uploadResource(dispatch, {
    resource: resource,
    isUploading: true,
    mustBeSynchronized: resource.id?.indexOf('temp') === -1, // don't have to sync resources with temp id
    timestamp: new Date()
  }).catch((error) => {
    console.log('Could not upload ' + resource.id ? resource.id : '' + ', add to queue.', error);
    dispatch(new Action(ADD_RESOURCE_TO_SYNCHRONIZE, resource).getObjectAction());
  });
}

export function logoutUser(dispatch: Function): Promise<void> {
  return new Promise((resolve, reject) => {
    // do not completely clear async storage, because
    // STORAGE.ASKED_FOR_CONTACT_PERMISSION needs to be persisted
    // over logout
    AsyncStorage.removeItem(STORAGE.SHOULD_DISPLAY_INTRO).then(() => {
      dispatch(new Action(LOGOUT_AUTHENTICATE_USER).getObjectAction());
      return resolve();
    })
    .catch(e => {
      console.log('could not clear AsyncStorage', e);
      return reject();
    });
  });
  
}

export async function uploadPendingResources(dispatch: Function): Promise<void> {
  let uploadJobs = (store.getState() as any).MiDataServiceStore.pendingResources;

  if (uploadJobs.length === 0) {
    return Promise.resolve();
  }

  let resourcesToUpload = new Array();
  uploadJobs.forEach(
    (uploadJob: {resource: Resource; isUploading: boolean; mustBeSynchronized: boolean; timestamp: Date}) => {
      if (!uploadJob.isUploading) {
        uploadJob.isUploading = true;
        resourcesToUpload.push(uploadResource(dispatch, uploadJob));
      }
    }
  );

  return Promise.all(resourcesToUpload)
    .then(() => {
      dispatch({type: ALL_RESOURCES_SENT});
    })
    .catch((error) => {
      console.warn('could not upload pending resources.', error);
    });
}

export function uploadResource(
  dispatch: Function,
  _jobItem: {resource: Resource; isUploading: boolean; mustBeSynchronized: boolean; timestamp: Date}
): Promise<void> {
  return new Promise((resolve, reject) => {
    let endPoint = '/fhir';

    // determine the endPoint based on resource type
    if (_jobItem.resource.resourceType !== 'Bundle') {
      endPoint += '/' + _jobItem.resource.resourceType;
    }

    let MIDATAStore = (store.getState() as any).MiDataServiceStore;

    if (!_jobItem.mustBeSynchronized || !_jobItem.resource.id) {
      // TODO : try/catch when user's token no more valid!
      MIDATAStore.fetch(endPoint, 'POST', JSON.stringify(_jobItem.resource))
        .then((result: Resource) => {
          // update resources IDs to match the ID on MIDATA (for later sync)
          if (_jobItem.resource.resourceType === 'Bundle') {
            const response = result as Bundle;
            const request = _jobItem.resource as Bundle;
            for (const i in response.entry) {
              const type = request.entry[i].resource.resourceType;
              const id = response.entry[i].response.location.split(type + '/')[1].split('/')[0];
              request.entry[i].resource.id = id;
            }
          } else {
            _jobItem.resource.id = result.id;
          }
          dispatch({
            type: RESOURCE_SENT,
            resource: _jobItem
          });
          uploadPendingResources(dispatch);
          resolve();
        })
        .catch((error: Error) => {
          _jobItem.isUploading = false;
          reject(error);
        });
    } else {
      if (Guid.isGuid(_jobItem.resource.id)) {
        // resource is in a I4MIBundle that has not been synced before resource was added to queue
        const pendingJobs = (store.getState() as any).MiDataServiceStore.pendingResources;

        let foundResourceInPendingJobs = false;
        // look for the bundle if it's still in queue
        pendingJobs.forEach((pendingJob: {resource: Resource}) => {
          if (pendingJob.resource.resourceType === 'Bundle') {
            const bundle = pendingJob.resource as Bundle;

            for (let i in bundle.entry) {
              if (bundle.entry[i].resource.id === _jobItem.resource.id) {
                bundle.entry[i].resource = _jobItem.resource;
                foundResourceInPendingJobs = true;
              }
            }
          }
        });

        if (foundResourceInPendingJobs) {
          // we found the resource in the bundle, and we replaced it with the updated resource
          // => newest version will be uploaded with bundle and we can end here
          dispatch({
            type: RESOURCE_SENT,
            resource: _jobItem
          });
          uploadPendingResources(dispatch);
          return Promise.resolve();
        } else {
          if (_jobItem.resource.resourceType === 'CarePlan') {
            const carePlan = _jobItem.resource as CarePlan;
            if (carePlan.status === CarePlanStatus.ACTIVE) {
              // if we don't have an ID, only syncing the active care plan does make sense
              endPoint = '/fhir/CarePlan?status=active';
            } else {
              endPoint = '/fhir/CarePlan/' + carePlan.id;
            } 
          } else {
            // syncing RelatedPerson without the acual ID doesn't make sense
            console.log('Could not sync resource, ', _jobItem);
            return Promise.reject();
          }
        }
      } else {
        endPoint = '/fhir/' + _jobItem.resource.resourceType + '/' + _jobItem.resource.id;
      }

      // TODO : try/catch when user's token no more valid!
      MIDATAStore.fetch(endPoint, 'GET')
        .then((serverResource: Resource) => {
          let mustBeUpdated = false;
          if (serverResource.resourceType === 'Bundle') {
            const bundle = serverResource as Bundle;
            if (bundle.entry && bundle.entry[0] && bundle.entry[0].resource) {
              serverResource = bundle.entry[0].resource;
            } else {
              serverResource = {}; // nothing found that matches
            }
          }
          if (serverResource && serverResource.meta?.lastUpdated) {
            mustBeUpdated = new Date(serverResource.meta.lastUpdated).getTime() < _jobItem.timestamp.getTime();
          } else {
            // search result was empty bundle, so don't update but upload
            MIDATAStore.fetch('/fhir/' + _jobItem.resource.resourceType, 'POST', JSON.stringify(_jobItem.resource))
              .then((createdResource: Resource) => {
                _jobItem.resource.id = createdResource.id;
                dispatch({
                  type: RESOURCE_SENT,
                  resource: _jobItem
                });
                uploadPendingResources(dispatch);
              })
              .catch((error) => {
                console.log('error in uploading resource', error);
                _jobItem.isUploading = false;
              });
            return resolve();
          }

          if (mustBeUpdated) {
            _jobItem.resource.id = serverResource?.id;
            _jobItem.resource.meta = serverResource?.meta;
            endPoint = '/fhir/' + _jobItem.resource.resourceType + '/' + _jobItem.resource.id;

            // TODO : try/catch when user's token no more valid!
            MIDATAStore.fetch(endPoint, 'PUT', JSON.stringify(_jobItem.resource))
              .then(() => {
                dispatch({
                  type: RESOURCE_SENT,
                  resource: _jobItem
                });
                uploadPendingResources(dispatch);
              })
              .catch((error) => {
                console.log('error in updating resource', error);
                _jobItem.isUploading = false;
              });
            return resolve();
          } else {
            _jobItem.resource = serverResource;
            dispatch({
              type: RESOURCE_SENT,
              resource: _jobItem
            });
            return resolve();
          }
        })
        .catch((error: Error) => {
          // TODO-heg2 catch Error when Server Response is 404 because Resource ID is not found (=> can't be updated, but uploaded)
          console.log(error);
          _jobItem.isUploading = false;
          reject(error);
        });
    }
  });
}

export function deleteResource(dispatch: Function, _mustBeSynchronized: boolean, _resource: Resource): Promise<void> {
  return new Promise((resolve, reject) => {
    if (_resource.id) {
      if (Guid.isGuid(_resource.id)) {
        // we have a GUID if the resource isn't known to MIDATA yet
        const pendingJobs = (store.getState() as any).MiDataServiceStore.pendingResources;
        let foundResourceInPendingJobs = false;
        // look for the bundle if it's still in queue
        pendingJobs.forEach((pendingJob: {resource: Resource}) => {
          if (pendingJob.resource.resourceType === 'Bundle') {
            const bundle = pendingJob.resource as Bundle;
            for (let i in bundle.entry) {
              if (bundle.entry[i].resource.id === _resource.id) {
                bundle.entry.splice(Number(i), 1);
                foundResourceInPendingJobs = true;
              }
            }
          }
        });

        if (foundResourceInPendingJobs) {
          uploadPendingResources(dispatch);
          dispatch({
            type: RESOURCE_SENT,
            resource: {
              resource: _resource,
              isUploading: false,
              mustBeSynchronized: _mustBeSynchronized
            }
          });
        } else {
          // TODO: adjust for used resource Types
          if (_resource.resourceType === 'AllergyIntolerance') {
            // let endPoint = '/fhir/' + _resource.resourceType + '?code=' + _resource.code.coding.find(coding => coding.system === 'http://snomed.info/sct')?.code;
            //
            // store.getState().MiDataServiceStore.fetch( endPoint, 'GET' ).then((serverResource: Resource) => {
            //     _resource.id = serverResource.id;
            //     _resource.meta = serverResource.meta;
            //     store.getState().MiDataServiceStore.fetch('/fhir/' + _resource.resourceType + '/' + _resource.id, 'PUT', JSON.stringify(_resource)).then(() => {
            //         uploadPendingResources(dispatch);
            //         dispatch({
            //             type: RESOURCE_SENT,
            //             resource: {
            //                 resource: _resource,
            //                 isUploading: false,
            //                 mustBeSynchronized: _mustBeSynchronized
            //             }
            //         });
            //         return resolve();
            //     })
            //     .catch((error: any) => {
            //         console.log('Could not delete resource, add Request to queue.', error);
            //         dispatch(new Action(
            //             _mustBeSynchronized
            //                         ? ADD_RESOURCE_TO_SYNCHRONIZE
            //                         : ADD_RESOURCE,
            //             _resource).getObjectAction());
            //         return resolve();
            //     });
            // });
          } else {
            console.warn(
              'Could not delete resource - bundle sync for type ' + _resource.resourceType + ' not implemented',
              _resource
            );
            return reject();
          }
        }
      } else {
        switch (
          _resource.resourceType
          // case 'Observation':         const observation = _resource as Observation
          //                             observation.status = ObservationStatus.ENTERED_IN_ERROR;
          //                             break;
          // case 'AllergyIntolerance':  const allergyIntolerance = _resource as AllergyIntolerance;
          //                             allergyIntolerance.verificationStatus = ALLERGY_STATUS.enteredInError;
        ) {
        }

        store
          .getState()
          .MiDataServiceStore.deleteResource(_resource)
          .then(() => {
            dispatch({
              type: RESOURCE_SENT,
              resource: {
                resource: _resource,
                isUploading: false,
                mustBeSynchronized: _mustBeSynchronized
              }
            });
            resolve();
          })
          .catch((error: any) => {
            console.log('Could not delete resource, add Request to queue.', error);
            dispatch(
              new Action(_mustBeSynchronized ? ADD_RESOURCE_TO_SYNCHRONIZE : ADD_RESOURCE, _resource).getObjectAction()
            );
            resolve();
          });
      }
    } else {
      return reject('Can not delete observation without id.');
    }
  });
}
