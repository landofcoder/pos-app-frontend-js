import { CONFIGURABLE, SIMPLE } from '../constants/product-types';

export function calcPrice(product) {
  const productAssign = Object.assign({}, product);
  const typeId = productAssign.type_id;
  switch (typeId) {
    case SIMPLE: {
      const price = productAssign.price.regularPrice.amount.value;
      const qty = productAssign.pos_qty;
      productAssign.pos_totalPrice = price * qty;
      break;
    }
    case CONFIGURABLE:
      break;
    default:
      break;
  }
  return productAssign;
}
