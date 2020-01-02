// @flow
import LocaleCurrency from 'locale-currency';

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

export function formatCurrencyCode(value: number, currencyCode: string) {
  const locale = LocaleCurrency.getLocales(currencyCode)[0];
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode
  });
  return formatter.format(value);
}
