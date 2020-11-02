import SwapsController from '../src/swaps/SwapsController';

describe('SwapsController', () => {
  it('should set default config', () => {
    const controller = new SwapsController();
    expect(controller.config).toEqual({
      maxGasLimit: 2500000,
      pollCountLimit: 3,
      metaSwapAddress: '0x881d40237659c251811cec9c364ef91dc08d300c',
    });
  });

  it('should set default state', () => {
    const controller = new SwapsController();
    expect(controller.state).toEqual({
      quotes: {},
      fetchParams: null,
      tokens: null,
      quotesLastFetched: null,
      errorKey: null,
      topAggId: null,
      swapsFeatureIsLive: false,
    });
  });
});
