import { BUNDLE, SIMPLE, DOWNLOADABLE } from '../constants/product-types';
import { formatCurrencyCode } from './settings';
import { getProductBySku } from '../reducers/db/products';
import { format } from 'date-fns';

/**
 * Get price by product type
 * @param product
 * @param currencyCode
 * @returns {any}
 */
export function calcPrice(product, currencyCode) {
  let productAssign = Object.assign({}, product);
  const typeId = productAssign.type_id;
  switch (typeId) {
    case SIMPLE:
    case DOWNLOADABLE:
    case undefined: {
      const finalPrice = priceByTierPrice(productAssign);
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
  const finalPrice = price * qty;
  if (item.tier_prices || item.special_price) {
    // Get tier price now
    let priceByTierPrice;
    if (item.tier_prices && item.tier_prices.length > 0) {
      // Find iterItem match the qty condition & customer group
      let tierItemMatch = null;

      const specialPrice = item.special_price;
      const specialPriceActive = false;

      item.tier_prices.forEach(tierItem => {
        const tierQty = tierItem.qty;
        // todo check with customer here
        if (qty >= tierQty) {
          tierItemMatch = tierItem;
        }
      });

      // Type fixed amount & percent => percent type auto calculator by api response
      if (tierItemMatch && tierItemMatch.value) {
        priceByTierPrice = tierItemMatch.value;
      }

      console.log('tier price:', priceByTierPrice);
      console.log('special price:', specialPrice);

      if (specialPrice) {
        console.log('spec price:', item);
        let specialFromDate = item.special_from_date;
        let specialToDate = item.special_to_date;

        const result = await getProductBySku('24-MB01');
        console.log('result 1:', result);

        // if (!specialFromDate) {
        //   specialFromDate = format(new Date(), 'yyyy-MM-dd hh:m:s');
        // }
        //
        // if (!specialToDate) {
        //   specialToDate = format(new Date(), 'yyyy-MM-dd hh:m:s');
        // }

        console.log('from date:', specialFromDate);
        console.log('to date:', specialToDate);
      }
    }
    return 0;
  }
  return finalPrice;
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
