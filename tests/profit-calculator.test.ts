import {describe,it,expect} from 'vitest';
import {calculatePricing,calculateTargetPrice,validatePricingInput,formatMoney,type PricingInput} from '../src/lib/profit-calculator';

const base:PricingInput={unitCost:40,additionalCosts:0,packaging:0,sellerShipping:0,fixedFee:2,percentageFee:0,taxRate:0,targetMargin:25,quantity:10,periodFixedCosts:0,salePrice:100};

describe('profit and pricing calculator',()=>{
  it('calculates revenue, costs, profit, margin, markup and break-even with zero fees',()=>{
    const result=calculatePricing(base,'known-price');
    expect(result.revenue).toBe(1000); expect(result.profitPerUnit).toBeCloseTo(58,12); expect(result.margin).toBeCloseTo(58,12); expect(result.markup).toBeCloseTo(145,12); expect(result.breakEvenUnits).toBe(0);
  });
  it('applies a percentage payment fee and tax on revenue',()=>{
    const result=calculatePricing({...base,percentageFee:5,taxRate:10},'known-price');
    expect(result.percentageFee).toBe(5); expect(result.tax).toBe(10); expect(result.profitPerUnit).toBe(43);
  });
  it('adds variable packaging, seller shipping, additional cost and fixed payment fee',()=>{
    const result=calculatePricing({...base,unitCost:20,additionalCosts:3,packaging:2,sellerShipping:5,fixedFee:1},'known-price');
    expect(result.unitCosts).toBe(30); expect(result.profitPerUnit).toBe(69);
  });
  it('finds the target price for the requested margin without intermediate rounding',()=>{
    const result=calculateTargetPrice({...base,percentageFee:5,taxRate:10},25);
    expect(result.price).toBeCloseTo(70,12); expect(result.margin).toBeCloseTo(25,12); expect(result.profitPerUnit).toBeCloseTo(17.5,12);
  });
  it('handles break-even quantity and period fixed costs',()=>{
    const result=calculatePricing({...base,salePrice:50,periodFixedCosts:101},'known-price');
    expect(result.profitPerUnit).toBe(8); expect(result.breakEvenUnits).toBe(13); expect(result.periodProfit).toBe(-21);
  });
  it('returns zero profit at a break-even sale price and allows a loss',()=>{
    const zero=calculatePricing({...base,salePrice:42},'known-price');
    expect(zero.profitPerUnit).toBe(0); expect(zero.breakEvenUnits).toBeNull();
    expect(calculatePricing({...base,salePrice:20},'known-price').profitPerUnit).toBe(-22);
  });
  it('rejects an impossible target margin',()=>expect(()=>calculateTargetPrice({...base,percentageFee:20,taxRate:30},50)).toThrow('unreachable-margin'));
  it('validates negative, non-finite, excessive rates, margins and fractional quantities',()=>{
    expect(validatePricingInput({...base,unitCost:-1},'known-price')).toBe('invalid');
    expect(validatePricingInput({...base,unitCost:Number.NaN},'known-price')).toBe('invalid');
    expect(validatePricingInput({...base,percentageFee:80,taxRate:20},'known-price')).toBe('rates');
    expect(validatePricingInput({...base,targetMargin:100},'target-margin')).toBe('margin');
    expect(validatePricingInput({...base,quantity:1.5},'known-price')).toBe('quantity');
  });
  it('supports very large values and currency labels without rounding calculation inputs',()=>{
    const result=calculatePricing({...base,unitCost:1e12,additionalCosts:0.125,fixedFee:0.005,salePrice:2e12},'known-price');
    expect(result.profitPerUnit).toBe(999999999999.87); expect(formatMoney(result.price,'EUR','en-US')).toContain('€');
  });
});
