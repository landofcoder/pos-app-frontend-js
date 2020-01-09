import { BUNDLE, SIMPLE, DOWNLOADABLE } from '../constants/product-types';
import { formatCurrencyCode } from './product';

export function calcPrice(product, currencyCode) {
  let productAssign = Object.assign({}, product);
  const typeId = productAssign.type_id;
  switch (typeId) {
    case SIMPLE:
    case DOWNLOADABLE:
    case undefined: {
      const price = productAssign.price.regularPrice.amount.value;
      const qty = productAssign.pos_qty;
      const finalPrice = price * qty;
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
