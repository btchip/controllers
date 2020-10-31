// eslint-disable-next-line import/named
import { Draft, produce } from 'immer';

/**
 * State change callbacks
 */
export type Listener<T> = (state: T) => void;

type Anonymizer<T> = (value: T) => T;

export type Schema<T> = {
  [P in keyof T]: {
    persist: boolean;
    anonymous: boolean | Anonymizer<T[P]>;
  }
};

function isAnonymizingFunction<T>(x: boolean | Anonymizer<T>): x is Anonymizer<T> {
  return typeof x === 'function';
}

/**
 * Controller class that provides state management and subscriptions
 */
export class BaseController<S extends Record<string, any>> {
  /**
   * Default state set on this controller
   */

  private internalState: S;

  private internalListeners: Listener<S>[] = [];

  private schema: Schema<S>;

  /**
   * Creates a BaseController instance. The initial state is merged with
   * defaults upon initialization.
   *
   * @param state - Initial state to set on this controller
   * @param persistanceSchema - TODO
   * @param anonymizedSchema - TODO
   */
  constructor(state: S, schema: Schema<S>) {
    this.internalState = state;
    this.schema = schema;
  }

  /**
   * Retrieves current controller state
   *
   * @returns - Current state
   */
  get state() {
    return this.internalState;
  }

  getPersistedState() {
    return Object.keys(this.state)
      .reduce(
        (persistedState, _key) => {
          const key: keyof S = _key; // https://stackoverflow.com/questions/63893394/string-cannot-be-used-to-index-type-t
          if (this.schema[key].persist) {
            persistedState[key] = this.state[key];
          }
          return persistedState;
        },
        {} as Partial<S>,
      );
  }

  getAnonymizedState() {
    return Object.keys(this.state)
      .reduce(
        (anonymizedState, _key) => {
          const key: keyof S = _key; // https://stackoverflow.com/questions/63893394/string-cannot-be-used-to-index-type-t
          const schemaValue = this.schema[key].anonymous;
          if (isAnonymizingFunction(schemaValue)) {
            anonymizedState[key] = schemaValue(this.state[key]);
          } else if (schemaValue) {
            anonymizedState[key] = this.state[key];
          }
          return anonymizedState;
        },
        {} as Partial<S>,
      );
  }

  /**
   * Adds new listener to be notified of state changes
   *
   * @param listener - Callback triggered when state changes
   */
  subscribe(listener: Listener<S>) {
    this.internalListeners.push(listener);
  }

  /**
   * Removes existing listener from receiving state changes
   *
   * @param listener - Callback to remove
   * @returns - True if a listener is found and unsubscribed
   */
  unsubscribe(listener: Listener<S>) {
    const index = this.internalListeners.findIndex((cb) => listener === cb);
    index > -1 && this.internalListeners.splice(index, 1);
    return index > -1;
  }

  /**
   * Updates controller state
   *
   * @param callback - New state
   */
  protected update(callback: (state: Draft<S>) => void | S) {
    this.internalState = produce(this.internalState, callback) as S;
  }

  /**
   *
   */
  protected destroy() {
    this.internalListeners = [];
  }
}

export default BaseController;
