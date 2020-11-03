import BaseController, { BaseConfig, BaseState } from '../BaseController';
import { SwapsError } from './SwapsUtil';

const METASWAP_ADDRESS = '0x881d40237659c251811cec9c364ef91dc08d300c';

export interface SwapsTokenObject {
  address: string;
  symbol: string;
  decimals: number;
  occurances?: number;
  iconUrl?: string;
}

export interface SwapsConfig extends BaseConfig {
  maxGasLimit: number;
  pollCountLimit: number;
  metaSwapAddress: string;
}

export interface SwapsState extends BaseState {
  quotes: { [key: string]: Record<string, any> };
  fetchParams: null | Record<string, any>;
  tokens: null | SwapsTokenObject[];
  quotesLastFetched: null | Date;
  errorKey: null | SwapsError;
  topAggId: null | string;
  swapsFeatureIsLive: boolean;
}

export default class SwapsController extends BaseController<SwapsConfig, SwapsState> {
  /**
   * Name of this controller used during composition
   */
  name = 'SwapsController';

  /**
   * List of required sibling controllers this controller needs to function
   */
  requiredControllers = ['NetworkController', 'TokenRatesController'];

  /**
   * Creates a SwapsController instance
   *
   * @param config - Initial options used to configure this controller
   * @param state - Initial state to set on this controller
   */
  constructor(config?: Partial<SwapsConfig>, state?: Partial<SwapsState>) {
    super(config, state);
    this.defaultConfig = {
      maxGasLimit: 2500000,
      pollCountLimit: 3,
      metaSwapAddress: METASWAP_ADDRESS,
    };
    this.defaultState = {
      quotes: {},
      fetchParams: null,
      tokens: null,
      quotesLastFetched: null,
      errorKey: null,
      topAggId: null,
      swapsFeatureIsLive: false,
    };
    this.initialize();
  }
}
