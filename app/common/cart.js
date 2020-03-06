import { formatCurrencyCode } from './settings';

/**
 * Sum total price for offline mode
 * @param cartCurrent
 * @param withCurrency
 * @returns {number|*}
 */
export function sumCartTotalPrice(
  cartCurrent: Object,
  withCurrency: boolean = true
): any {
  let totalPrice = 0;
  cartCurrent.data.forEach(item => {
    totalPrice += item.pos_totalPrice;
  });
  if (withCurrency) {
    return formatCurrencyCode(totalPrice);
  }
  return totalPrice;
}
