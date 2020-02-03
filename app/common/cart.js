import { formatCurrencyCode } from './settings';

/**
 * Sum total price for offline mode
 * @param cartCurrent
 * @param currencyCode
 * @param withCurrency
 * @returns {number|*}
 */
export function sumCartTotalPrice(
  cartCurrent: Object,
  currencyCode: string,
  withCurrency: boolean = true
): any {
  let totalPrice = 0;
  cartCurrent.data.forEach(item => {
    totalPrice += item.pos_totalPrice;
  });
  if (withCurrency) {
    return formatCurrencyCode(totalPrice, currencyCode);
  }
  return totalPrice;
}
