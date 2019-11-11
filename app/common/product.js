import { BUNDLE, CONFIGURABLE, GROUPED } from '../constants/product-types';

/**
 * By product_type, this function will convert data for each product type to standard format
 */
export function handleProductType(productList) {
  const productListAssign = Object.assign({}, productList);
  const { items } = productListAssign.data.products;
  // Loop all products
  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      const typeId = item.type_id;
      switch (typeId) {
        case CONFIGURABLE:
          {
            // Find usedProduct for configurable
            const standardFormat = findUsedConfigurable(item);
            items[i] = standardFormat;
          }
          break;
        case BUNDLE:
          break;
        case GROUPED:
          break;
        default:
          break;
      }
    }
    return productListAssign;
  }
  return productListAssign;
}

/**
 * Find used configurable
 */
function findUsedConfigurable(item) {
  const reAssignItem = Object.assign({}, item);

  console.log('conf item:', reAssignItem);

  const configurableOption = reAssignItem.configurable_options;

  // Get all configurable options to get list array with key as option_code and value selected like: [color: 153, size: 198]
  if (configurableOption.length > 0) {
    const listOption = {};
    for (let i = 0; i < configurableOption.length; i += 1) {
      const confOption = configurableOption[i];
      // Assign code and value to listOption
      // Eg: listOption[color] = 1902
      listOption[confOption.attribute_code] = confOption.values
        ? confOption.values[0].value_index
        : 0;

      // Get first item to set to default select
      configurableOption[i].pos_selected = confOption.values[0].value_index;
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
