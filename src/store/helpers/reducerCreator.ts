import Action from './Action';

export function createReducer(initialState: object, handlers: object) {
  return function reducer(state = initialState, action: Action) {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    } else {
      return state;
    }
  };
}
