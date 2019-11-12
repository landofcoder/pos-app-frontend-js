/**
 * By product_type, this function will convert data for each product type to standard format
 */
export function handleProductType(productDetailSingle) {
  const productDetailSingleAssign = Object.assign({}, productDetailSingle);
  // Find usedProduct for configurable
  return findUsedConfigurable(productDetailSingleAssign);
}

/**
 * Find used configurable
 */
export function findUsedConfigurable(item, firstInit = true, payload) {
  console.log('item pass:', item);
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

  console.log('conf option:', configurableOption);

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

      // If not first init, get first item to set default selected
      if (firstInit) {
        // Get first item to set to default select
        configurableOption[i].pos_selected = confOption.values[0].value_index;
      } else {
        // Get by event selected
        console.log('run to get event selected:', payload);
        console.log('configurable option:', configurableOption[i]);
        // configurableOption[i].pos_selected = payload;
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
  return reAssignItem;
}
