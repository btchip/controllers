import { handleFetch, timeoutFetch, constructTxParams, BNToHex } from '../util';

export enum SwapsError {
  QUOTES_EXPIRED_ERROR = 'QUOTES_EXPIRED_ERROR',
  QUOTES_NOT_AVAILABLE_ERROR = 'QUOTES_NOT_AVAILABLE_ERROR',
}

export enum APIType {
  TRADES = 'TRADES',
  TOKENS = 'TOKENS',
  TOP_ASSETS = 'TOP_ASSETS',
  FEATURE_FLAG = 'FEATURE_FLAG',
  AGGREGATOR_METADATA = 'AGGREGATOR_METADATA',
}

interface APITradeRequest {
  sourceToken: string;
  destinationToken: string;
  sourceAmount: string;
  slippage: number;
  excludeFees?: boolean;
  txOriginAddress?: string;
  timeout: number;
  walletAddress: string;
  exchangeList?: null | string[];
}

interface APIAsset {
  address: string;
  symbol: string;
}

interface APITrade {
  trade: null | {
    data: string;
    to: string;
    from: string;
    value: string;
    gas: number;
  };

  approvalNeeded: null | {
    data: string;
    to: string;
    from: string;
  };
  sourceAmount: string;
  destinationAmount: string;
  error: null | Error;
  sourceToken: string;
  destinationToken: string;
  maxGas: number;
  averageGas: number;
  estimatedRefund: number;
  fetchTime: number;
  aggregator: string;
  aggType: string;
  fee: number;
  gasMultiplier?: number;
}

export const getBaseApiURL = function (type: APIType): string {
  switch (type) {
    case APIType.TRADES:
      return 'https://api.metaswap.codefi.network/trades';
    case APIType.TOKENS:
      return 'https://api.metaswap.codefi.network/tokens';
    case APIType.TOP_ASSETS:
      return 'https://api.metaswap.codefi.network/topAssets';
    case APIType.FEATURE_FLAG:
      return 'https://api.metaswap.codefi.network/featureFlag';
    case APIType.AGGREGATOR_METADATA:
      return 'https://api.metaswap.codefi.network/aggregatorMetadata';
    default:
      throw new Error('getBaseApiURL requires an api call type');
  }
};

export async function fetchTradesInfo({
  slippage,
  sourceToken,
  sourceAmount,
  destinationToken,
  fromAddress,
  exchangeList,
}: {
  slippage: number;
  sourceToken: string;
  sourceAmount: string;
  destinationToken: string;
  fromAddress: string;
  exchangeList?: string[];
}): Promise<Record<string, APITrade>> {
  const urlParams: APITradeRequest = {
    destinationToken,
    sourceToken,
    sourceAmount,
    slippage,
    timeout: 10000,
    walletAddress: fromAddress,
  };

  if (exchangeList) {
    urlParams.exchangeList = exchangeList;
  }

  const tradeURL = `${getBaseApiURL(APIType.TRADES)}?${new URLSearchParams(urlParams as Record<any, any>).toString()}`;
  const tradesResponse = ((await timeoutFetch(tradeURL, { method: 'GET' }, 15000)).json() as unknown) as APITrade[];

  const newQuotes = tradesResponse.reduce((aggIdTradeMap: Record<string, APITrade>, quote: APITrade) => {
    if (quote.trade && !quote.error) {
      const constructedTrade = constructTxParams({
        to: quote.trade.to,
        from: quote.trade.from,
        data: quote.trade.data,
        amount: BNToHex(quote.trade.value),
        gas: BNToHex(quote.maxGas),
      });

      let { approvalNeeded } = quote;

      if (approvalNeeded) {
        approvalNeeded = constructTxParams({
          ...approvalNeeded,
        });
      }

      return {
        ...aggIdTradeMap,
        [quote.aggregator]: {
          ...quote,
          slippage,
          trade: constructedTrade,
          approvalNeeded,
        },
      };
    }

    return aggIdTradeMap;
  }, {});

  return newQuotes;
}

// export async function fetchTokens() {}

// export async function fetchAggregatorMetadata() {}

export async function fetchTopAssets(): Promise<APIAsset[]> {
  const topAssetsUrl = getBaseApiURL(APIType.TOP_ASSETS);
  const response = await handleFetch(topAssetsUrl, { method: 'GET' });
  return response;
}

export async function fetchSwapsFeatureLiveness(): Promise<boolean> {
  try {
    const status = await handleFetch(getBaseApiURL(APIType.FEATURE_FLAG), { method: 'GET' });
    return status?.active;
  } catch (err) {
    return false;
  }
}

export async function fetchTokenPrice(address: string): Promise<string> {
  const query = `contract_addresses=${address}&vs_currencies=eth`;
  const prices = await handleFetch(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?${query}`, {
    method: 'GET',
  });

  return prices && prices[address]?.eth;
}

// export function getRenderableNetworkFeesForQuote(
//   tradeGas,
//   approveGas,
//   gasPrice,
//   currentCurrency,
//   conversionRate,
//   tradeValue,
//   sourceSymbol,
//   sourceAmount,
// ) {}

// export function quotesToRenderableData(
//   quotes,
//   gasPrice,
//   conversionRate,
//   currentCurrency,
//   approveGas,
//   tokenConversionRates,
// ) {}

// export function getSwapsTokensReceivedFromTxMeta(
//   tokenSymbol,
//   txMeta,
//   tokenAddress,
//   accountAddress,
//   tokenDecimals,
//   approvalTxMeta,
// ) {}

// export function formatSwapsValueForDisplay(destinationAmount) {}
