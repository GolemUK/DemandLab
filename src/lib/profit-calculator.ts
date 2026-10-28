export type Currency = 'UAH' | 'USD' | 'EUR' | 'CZK';
export type PricingMode = 'known-price' | 'target-margin';

export interface PricingInput {
  unitCost: number;
  additionalCosts: number;
  packaging: number;
  sellerShipping: number;
  fixedFee: number;
  percentageFee: number;
  taxRate: number;
  targetMargin: number;
  quantity: number;
  periodFixedCosts: number;
  salePrice?: number;
}

export interface PricingResult {
  price: number;
  revenue: number;
  unitCosts: number;
  fixedFee: number;
  percentageFee: number;
  tax: number;
  profitPerUnit: number;
  periodProfit: number;
  margin: number;
  markup: number | null;
  breakEvenUnits: number | null;
  targetMargin: number;
}

export const currencies: Currency[] = ['UAH', 'USD', 'EUR', 'CZK'];

export function validatePricingInput(input: PricingInput, mode: PricingMode): string | null {
  const nonnegative: (keyof PricingInput)[] = [
    'unitCost', 'additionalCosts', 'packaging', 'sellerShipping', 'fixedFee',
    'percentageFee', 'taxRate', 'targetMargin', 'quantity', 'periodFixedCosts',
  ];
  for (const key of nonnegative) {
    const value = input[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return 'invalid';
  }
  if (input.percentageFee >= 100 || input.taxRate >= 100 || input.percentageFee + input.taxRate >= 100) return 'rates';
  if (mode === 'target-margin' && input.targetMargin >= 100) return 'margin';
  if (!Number.isInteger(input.quantity) || input.quantity < 1) return 'quantity';
  if (mode === 'known-price' && (typeof input.salePrice !== 'number' || !Number.isFinite(input.salePrice) || input.salePrice < 0)) return 'invalid';
  return null;
}

export function calculatePricing(input: PricingInput, mode: PricingMode): PricingResult {
  const validation = validatePricingInput(input, mode);
  if (validation) throw new RangeError(validation);
  const costs = input.unitCost + input.additionalCosts + input.packaging + input.sellerShipping;
  const retainedRate = 1 - input.percentageFee / 100 - input.taxRate / 100;
  let price: number;
  if (mode === 'known-price') price = input.salePrice!;
  else {
    const denominator = retainedRate - input.targetMargin / 100;
    if (denominator <= 0) throw new RangeError('unreachable-margin');
    price = (costs + input.fixedFee) / denominator;
  }
  if (!Number.isFinite(price) || price < 0) throw new RangeError('invalid');
  const percentageFee = price * input.percentageFee / 100;
  const tax = price * input.taxRate / 100;
  const profitPerUnit = price - percentageFee - tax - costs - input.fixedFee;
  return {
    price,
    revenue: price * input.quantity,
    unitCosts: costs,
    fixedFee: input.fixedFee,
    percentageFee,
    tax,
    profitPerUnit,
    periodProfit: profitPerUnit * input.quantity - input.periodFixedCosts,
    margin: price > 0 ? profitPerUnit / price * 100 : 0,
    markup: costs > 0 ? profitPerUnit / costs * 100 : null,
    breakEvenUnits: profitPerUnit > 0 ? Math.ceil(input.periodFixedCosts / profitPerUnit) : null,
    targetMargin: input.targetMargin,
  };
}

export function calculateTargetPrice(input: PricingInput, targetMargin: number): PricingResult {
  return calculatePricing({ ...input, targetMargin }, 'target-margin');
}

export function formatMoney(value: number, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}
