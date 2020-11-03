import * as swapsUtil from '../src/swaps/SwapsUtil';

describe('SwapsUtil', () => {
  describe('getBaseApiURL', () => {
    it('should return expected values', () => {
      expect(swapsUtil.getBaseApiURL(swapsUtil.APIType.TRADES)).toBeTruthy();
      expect(swapsUtil.getBaseApiURL(swapsUtil.APIType.TRADES)).toBeTruthy();
      expect(swapsUtil.getBaseApiURL(swapsUtil.APIType.TOKENS)).toBeTruthy();
      expect(swapsUtil.getBaseApiURL(swapsUtil.APIType.TOP_ASSETS)).toBeTruthy();
      expect(swapsUtil.getBaseApiURL(swapsUtil.APIType.FEATURE_FLAG)).toBeTruthy();
      expect(swapsUtil.getBaseApiURL(swapsUtil.APIType.AGGREGATOR_METADATA)).toBeTruthy();
    });
  });

  describe('fetchTradesInfo', () => {
    it.todo('should work');
  });
  describe('fetchTokens', () => {
    it.todo('should work');
  });
  describe('fetchAggregatorMetadata', () => {
    it.todo('should work');
  });

  describe('fetchTopAssets', () => {
    it('should work', async () => {
      // TODO(wachunei): this is actually performing a fetch request to production server
      const assets = await swapsUtil.fetchTopAssets();
      expect(assets).toBeTruthy();
    });
  });

  describe('fetchSwapsFeatureLiveness', () => {
    it.todo('should work');
  });

  describe('fetchTokenPrice', () => {
    it.todo('should work');
  });

  describe('getRenderableNetworkFeesForQuote', () => {
    it.todo('should work');
  });

  describe('quotesToRenderableData', () => {
    it.todo('should work');
  });

  describe('getSwapsTokensReceivedFromTxMeta', () => {
    it.todo('should work');
  });

  describe('formatSwapsValueForDisplay', () => {
    it.todo('should work');
  });
});
