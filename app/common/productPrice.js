import { addSeconds, compareAsc } from 'date-fns';
import { BUNDLE, SIMPLE, DOWNLOADABLE } from '../constants/product-types';
import { formatCurrencyCode } from './settings';

/**
 * Get price by product type
 * @param product
 * @returns {any}
 */
export async function calcPrice(product) {
  const currencyCode = window.currency;
  let productAssign = Object.assign({}, product);
  const typeId = productAssign.type_id;
  switch (typeId) {
    case SIMPLE:
    case DOWNLOADABLE:
    case undefined: {
      const finalPrice = await priceByTierPrice(productAssign);
      productAssign.pos_totalPrice = finalPrice;
      productAssign.pos_totalPriceFormat = formatCurrencyCode(
        finalPrice,
        currencyCode
      );
      break;
    }
    case BUNDLE: {
      // Calculator price for bundle product
      productAssign = sumBundlePrice(productAssign, currencyCode);
      break;
    }
    default:
      console.log('run to default');
      break;
  }
  return productAssign;
}

/**
 * Get price by tier price or normal price
 * @param item
 * @returns {number}
 */
async function priceByTierPrice(item) {
  const price = item.price.regularPrice.amount.value;
  const qty = item.pos_qty;
  let finalPrice = price;

  if (item.tier_prices || item.special_price) {
    // Get tier price now
    let priceByTierPrice;
    if (item.tier_prices && item.tier_prices.length > 0) {
      // Find iterItem match the qty condition & customer group
      let tierItemMatch = null;

      const specialPrice = item.special_price;

      // eslint-disable-next-line no-restricted-syntax
      for (const tierItem of item.tier_prices) {
        const tierQty = tierItem.qty;
        // todo check with customer here
        if (qty >= tierQty) {
          tierItemMatch = tierItem;
        }
      }

      // Type fixed amount & percent => percent type auto calculator by api response
      if (tierItemMatch && tierItemMatch.value) {
        priceByTierPrice = tierItemMatch.value;

        // #CODE01 Update final price
        finalPrice = priceByTierPrice;
        console.info('got by tier price config');
      }

      // Check specialPrice to compare with default price of product
      if (specialPrice) {
        let specialFromDate = item.special_from_date;
        let specialToDate = item.special_to_date;

        // Special from date
        if (!specialFromDate) {
          specialFromDate = new Date();
        } else {
          specialFromDate = new Date(specialFromDate);
        }

        // Special to date
        if (!specialToDate) {
          // Add 30 seconds to specialToDate
          specialToDate = addSeconds(new Date(), 30);
        } else {
          specialToDate = new Date(specialToDate);
        }

        const nowTime = new Date();
        const dateFromCompareAsc = compareAsc(nowTime, specialFromDate);
        const dateToCompareAsc = compareAsc(nowTime, specialToDate);
        let dateFromMatched = false;
        let dateToMatched = false;

        // DateFrom have less than or equal specialFromDate
        if (dateFromCompareAsc >= 0) {
          dateFromMatched = true;
        }

        // DateTo have greater than or equal to dateToCompareAsc
        if (dateToCompareAsc <= 0) {
          dateToMatched = true;
        }

        // If all conditions are meet
        if (dateFromMatched && dateToMatched && specialPrice < finalPrice) {
          // #CODE01 Update final price
          finalPrice = specialPrice;
        } else {
          console.info('Not get by special price');
        }
      }
    }
  }
  return finalPrice * qty;
}

/**
 * Sum bundle price
 * @param product
 * @param currencyCode
 * @returns {any}
 */
export function sumBundlePrice(product, currencyCode) {
  const productAssign = Object.assign({}, product);
  // Calculator price for bundle product
  let price = 0;
  const { items } = productAssign;
  items.forEach(itemBundle => {
    const listOptionSelected = findOptionSelected(
      itemBundle.option_selected,
      itemBundle.options
    );
    if (listOptionSelected.length > 0) {
      // Get product
      listOptionSelected.forEach(itemOption => {
        price +=
          itemOption.product.price.regularPrice.amount.value * itemOption.qty;
      });
    }
  });
  productAssign.pos_totalPrice = price;
  productAssign.pos_totalPriceFormat = formatCurrencyCode(price, currencyCode);
  return productAssign;
}

/**
 * Find option selected
 * @param optionSelected
 * @param options
 */
function findOptionSelected(optionSelected, options) {
  const listProductSelected = [];
  options.forEach(item => {
    if (optionSelected.indexOf(item.id) !== -1) {
      // Exists item
      listProductSelected.push(item);
    }
  });
  return listProductSelected;
}
