import { BUNDLE, SIMPLE } from '../constants/product-types';

export function calcPrice(product) {
  const productAssign = Object.assign({}, product);
  const typeId = productAssign.type_id;
  switch (typeId) {
    case SIMPLE:
    case undefined: {
      const price = productAssign.price.regularPrice.amount.value;
      const qty = productAssign.pos_qty;
      productAssign.pos_totalPrice = price * qty;
      break;
    }
    case BUNDLE: {
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
            price += itemOption.product.price.regularPrice.amount.value;
          });
        }
      });
      productAssign.pos_totalPrice = price;
      break;
    }
    default:
      console.log('run to default');
      break;
  }
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