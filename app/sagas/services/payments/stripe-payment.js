import {
  CANNOT_CHARGE,
  SHOP_CURRENCY_IS_NOT_CONFIG,
  SUCCESS_CHARGE
} from '../../../constants/payment';

const stripe = require('stripe')('sk_test_7A41m1DQ7bgQ22hpDeqkuJCV00xpLDxjGv');

/**
 * Stripe payment
 * @param amount
 * @returns void
 */
export async function stripeMakePayment(amount) {
  // Create token
  const token = await stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 2,
      exp_year: 2021,
      cvc: '314'
    }
  });

  let amountUnitForStripe = 0;
  switch (window.currency.toLowerCase()) {
    case 'usd':
      amountUnitForStripe = await convertUSDToCents(amount);
      break;
    case '':
      break;
    default:
      break;
  }

  if (amountUnitForStripe > 0) {
    // Create charges
    const response = await stripe.charges.create({
      amount: amountUnitForStripe,
      currency: window.currency,
      source: token.id,
      description: 'POS - orders'
    });
    if (response.status && response.status === 'succeeded') {
      return SUCCESS_CHARGE;
    }
    return CANNOT_CHARGE;
  }
  return SHOP_CURRENCY_IS_NOT_CONFIG;
}

/**
 * Convert usd to cents
 * @param value
 * @returns void
 */
async function convertUSDToCents(value) {
  let valueAssign = value;
  valueAssign = `${valueAssign}`.replace(/[^\d.-]/g, '');
  if (value && valueAssign.includes('.')) {
    valueAssign = valueAssign.substring(0, value.indexOf('.') + 3);
  }
  return valueAssign ? Math.round(parseFloat(valueAssign) * 100) : 0;
}
