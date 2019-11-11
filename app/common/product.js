import { CONFIGURABLE, BUNDLE, GROUPED } from '../constants/product-types';
/**
 * By product_type, this function will convert data for each product type to standard format
 */
export function handleProductType(productList) {
  const { items } = productList.data.products;
  // Loop all products
  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const typeId = item.type_id;
      switch (typeId) {
        case CONFIGURABLE:
          // Find usedProduct for configurable
          items[i] = findUsedConfigurable(item);
          break;
        case BUNDLE:
          break;
        case GROUPED:
          break;
        default:
          break;
      }
    }
    return productList;
  }
  return productList;
}

/**
 * Find used configurable
 */
function findUsedConfigurable(item) {
  const reAssignItem = Object.assign({}, item);

  const configurableOption = reAssignItem.configurable_options;
  if (configurableOption.length > 0) {
    const listOption = {};
    for (let i = 0; i < configurableOption.length; i += 1) {
      const confOption = configurableOption[i];
      const optionFirstSelect = confOption.values
        ? confOption.values[0].value_index
        : 0;
      listOption[confOption.attribute_code] = optionFirstSelect;
    }

    const listOptionLength = Object.keys(listOption).length;

    let foundProduct = {};

    // Find variant match with list option
    const { variants } = reAssignItem;
    for (let k = 0; k < variants.length; k += 1) {
      const productVariant = variants[k];
      const { attributes } = variants[k];

      let foundIt = 0;
      for (let l = 0; l < attributes.length; l += 1) {
        const attribute = attributes[l];
        const { code } = attribute;
        const valueIndex = attribute.value_index;
        if (listOption[code] === valueIndex) {
          foundIt += 1;
        }
      }

      if (listOptionLength === foundIt) {
        // Breaking and return found variant product
        foundProduct = productVariant;
        break; // End of loop
      }
    }

    reAssignItem.usedProduct = foundProduct;
  }
  return reAssignItem;
}
