// Test configuration error handling that requires module reloading

describe('PaymentService Configuration', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('throws error when Stripe secret key is missing', () => {
    // Mock config without stripe secret key
    jest.doMock('../config', () => ({
      __esModule: true,
      default: {
        stripeSecretKey: undefined,
        stripePriceId: 'price_123'
      }
    }));

    // Mock Stripe constructor to prevent actual instantiation
    jest.doMock('stripe', () => {
      return class StripeMock {
        constructor() {}
      };
    });

    // This should throw when the module is imported
    expect(() => {
      require('../services/payment.service');
    }).toThrow('Stripe secret key is not configured!');
  });

  it('initializes successfully with valid configuration', () => {
    // Mock config with valid values
    jest.doMock('../config', () => ({
      __esModule: true,
      default: {
        stripeSecretKey: 'sk_test_valid_key',
        stripePriceId: 'price_123'
      }
    }));

    // Mock Stripe constructor
    jest.doMock('stripe', () => {
      return class StripeMock {
        constructor() {}
      };
    });

    // This should not throw
    expect(() => {
      require('../services/payment.service');
    }).not.toThrow();
  });
});
