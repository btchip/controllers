import BaseController, { BaseConfig, BaseState } from '../BaseController';

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

export enum SwapsError {
  QUOTES_EXPIRED_ERROR = 'QUOTES_EXPIRED_ERROR',
  QUOTES_NOT_AVAILABLE_ERROR = 'QUOTES_NOT_AVAILABLE_ERROR',
}

interface SwapsQuotes {
  [key: string]: Record<string, any>
}

export interface SwapsState extends BaseState {
  quotes: SwapsQuotes;
  fetchParams: null | Record<string, any>;
  tokens: null | SwapsTokenObject[];
  quotesLastFetched: null | Date;
  errorKey: null | SwapsError;
  topAggId: null | string;
  swapsFeatureIsLive: boolean;
}

const QUOTE_POLLING_INTERVAL = 50 * 1000

export default class SwapsController extends BaseController<SwapsConfig, SwapsState> {
  private handle?: NodeJS.Timer;
  // private pollCount?: number;

  /**
   * Fetch current gas price
   * 
   * @returns - Promise resolving to the current gas price
   */
  // private async getEthersGasPrice (): Promise<string> {
  //   return ''
  // }

  /**
   * Find best quote and savings from specific quotes
   * 
   * @param quotes - Quotes to do the calculation
   * @returns - Promise resolving to an object containing best aggregator id and respective savings
   */
  // private async findTopQuoteAndCalculateSavings (quotes: SwapsQuotes): Promise<Object> {
  //   Object.keys(quotes)
  //   return {topAggId: '', isBest: true, savings: {}}
  // }

  /**
   * Get current allowance for a wallet address to access ERC20 contract address funds
   * 
   * @param _contractAddress - Hex address of the ERC20 contract
   * @param _walletAddress - Hex address of the wallet
   * @returns
   */
  // private async getERC20Allowance (_contractAddress: string, _walletAddress: string): Promise<number> {
  //   return 0
  // }

  // private _setupSwapsLivenessFetching () {}

  // private async _fetchAndSetSwapsLiveness () {}

  // private async _modifyValuesForMaxEthMode (newQuotes, accountBalance) {}
  
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

  setSwapsTokens (newTokens: null | SwapsTokenObject[]) {
    this.update({ tokens: newTokens })
  }

  setSwapsErrorKey (newErrorKey: null | SwapsError) {
    this.update({ errorKey: newErrorKey })
  }

  setQuotesLastFetched (quotesLastFetched: SwapsQuotes) {
    this.update({ quotes: quotesLastFetched })
  }

  setSwapsLiveness (isLive: boolean) {
    this.update({ swapsFeatureIsLive: isLive })
  }

  /**
   * Starts a new polling process
   * 
   */
  pollForNewQuotes() {
    this.handle && clearTimeout(this.handle);
    this.fetchAndSetQuotes(null, {}, true)
    this.handle = setTimeout(() => {
      this.fetchAndSetQuotes(null, {}, true)
    }, QUOTE_POLLING_INTERVAL);
  }

  /**
   * Stops the polling process
   * 
   */
  stopPollingForQuotes() {
    this.handle && clearTimeout(this.handle)
  }

  async fetchAndSetQuotes (fetchParams: null | Record<string, any>, fetchParamsMetaData: Object, isPolledRequest: boolean) {
    if (!fetchParams) {
      return null
    }

    // Every time we get a new request that is not from the polling, we reset the poll count so we can poll for up to three more sets of quotes with these new params.
    if (!isPolledRequest) {
      // this.pollCount = 0
    }

    // If there are any pending poll requests, clear them so that they don't get call while this new fetch is in process
    this.handle && clearTimeout(this.handle)

    if (!isPolledRequest) {
      this.setSwapsErrorKey(null)
    }
    // ...

    this.update({fetchParams: { ...fetchParams, metaData: fetchParamsMetaData }})
  }

  safeRefetchQuotes () {
    const {fetchParams} = this.state
    if (!this.handle && fetchParams) {
      this.fetchAndSetQuotes(fetchParams, {}, false)
    }
  }

  async getAllQuotesWithGasEstimates (quotes: SwapsQuotes):   Promise<SwapsQuotes> {
    const newQuotes = quotes
    return newQuotes
  }

  resetPostFetchState () {
    const {tokens: resetTokens, fetchParams: resetFetchParams, swapsFeatureIsLive: resetSwapsFeatureIsLive} = this.state
    this.update({
      ...this.state,
      tokens: resetTokens,
      fetchParams: resetFetchParams,
      swapsFeatureIsLive: resetSwapsFeatureIsLive
    })
    this.handle && clearTimeout(this.handle)
  }

  // resetSwapsState () {}

  // timedoutGasReturn (tradeTxParams) {}

  // setSelectedQuoteAggId (selectedAggId) () {}

  // async setInitialGasEstimate (initialAggId, baseGasEstimate) {}

  // setApproveTxId (approveTxId) {}

  // setTradeTxId (tradeTxId) {}

  // setMaxMode (maxMode) {}

  // setSwapsTxGasPrice (gasPrice) {}

  // setSwapsTxGasLimit (gasLimit) {}

  // setCustomApproveTxData (data) {}

  // setBackgroundSwapRouteState (routeState) {}
}
