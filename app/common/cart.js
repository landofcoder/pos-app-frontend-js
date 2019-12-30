// @flow
import LocaleCurrency from 'locale-currency';

export function sumCartTotalPrice(cartCurrent, currencyCode) {
  let totalPrice = 0;
  cartCurrent.data.forEach(item => {
    totalPrice += item.pos_totalPrice;
  });
  return formatCurrencyCode(totalPrice, currencyCode);
}

function formatCurrencyCode(value, currencyCode) {
  const locale = LocaleCurrency.getLocales(currencyCode)[0];
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode
  });
  return formatter.format(value);
}
