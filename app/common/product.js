import { CONFIGURABLE, BUNDLE } from '../constants/product-types';

/**
 * By product_type, this function will convert data for each product type to standard format
 */
export function handleProductType(productDetailSingle) {
  const productDetailSingleAssign = Object.assign({}, productDetailSingle);
  switch (productDetailSingleAssign.type_id) {
    case BUNDLE:
      console.log('bundle type');
      break;
    case CONFIGURABLE:
      // Find usedProduct for configurable
      return findUsedConfigurable(productDetailSingleAssign);
    default:
      break;
  }
}

/**
 * FInd
 * @param item
 * @param firstInit
 */
export function reformatBundleProduct(item, firstInit = true) {

}

/**
 * Find used configurable
 */
export function findUsedConfigurable(item, firstInit = true) {
  let reAssignItem = null;

  /**
   * If firstInit then just assign
   * if not firstInit: item is object of react just read only, should convert to JSON from JSON stringify
   */
  if (firstInit) {
    reAssignItem = Object.assign({}, item);
  } else {
    reAssignItem = JSON.parse(JSON.stringify(item));
  }
  const configurableOption = reAssignItem.configurable_options;

  // Get all configurable options to get list array with key as option_code and value selected like: [color: 153, size: 198]
  if (configurableOption.length > 0) {
    const listOption = {};
    for (let i = 0; i < configurableOption.length; i += 1) {
      const confOption = configurableOption[i];

      // If not first init, get first item to set default selected
      if (firstInit) {
        // Get first item to set to default select, just set for first time
        configurableOption[i].pos_selected = confOption.values[0].value_index;
        // Assign code and value to listOption. Eg: listOption[color] = 1902
        listOption[confOption.attribute_code] = confOption.values
          ? Number(confOption.values[0].value_index)
          : 0;
      } else {
        // If not firstInit, we don't have to set pos_selected anymore. pos_selected has changed before by other function
        // Assign code and value to listOption. Eg: listOption[color] = 1902
        listOption[confOption.attribute_code] = Number(
          configurableOption[i].pos_selected
        );
      }
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
  // Before return
  return reAssignItem;
}