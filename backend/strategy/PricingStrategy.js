class PricingStrategy {
  // compute next price from current state + optional signal
  compute({ current, signal, context = {} }) {
    return typeof current === 'number' ? current : 0;
  }
}

class ManualPricingStrategy extends PricingStrategy {
  // Trader-provided 'signal' (req.body.current_price) wins; fall back to current
  compute({ current, signal }) {
    return typeof signal === 'number' ? signal : Number(current) || 0;
  }
}

// Simple registry/selector
const strategies = {
  manual: new ManualPricingStrategy(),
};

function getPricingStrategy(name = process.env.PRICE_STRATEGY) {
  return strategies[(name || 'manual').toLowerCase()] || strategies.manual;
}

module.exports = {
  PricingStrategy,
  ManualPricingStrategy,
  getPricingStrategy,
};