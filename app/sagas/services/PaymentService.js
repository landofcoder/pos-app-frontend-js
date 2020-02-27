const stripe = require('stripe')('sk_test_7A41m1DQ7bgQ22hpDeqkuJCV00xpLDxjGv');

export async function stripeCreateToken() {
  // Create token
  const token = await stripe.tokens.create({
    card: {
      number: '4242424242424242',
      exp_month: 2,
      exp_year: 2021,
      cvc: '314'
    }
  });

  const amount = convertUSDToCents(57);
  console.log('convert amount:', amount);

  // Create charges
  const response = await stripe.charges.create({
    amount: 57000,
    currency: 'usd',
    source: token.id,
    description: 'POS - orders'
  });
  console.log('response from stripe:', response);
}

/**
 * Convert usd to cents
 * @param amount
 * @returns void
 */
async function convertUSDToCents(amount) {
  console.log('convert now:', amount);
  return 57000;
}
