import { adminToken, baseUrl } from '../../params';
import {
  getDefaultProductLocal,
  getProductsByCategoryLocal,
  syncProducts,
  counterProduct
} from '../../reducers/db/products';
import { getCategories } from '../../reducers/db/categories';

const graphqlPath = `${baseUrl}graphql`;

/**
 * Search product service
 * @returns {any}
 */
export async function searchProductService(payload) {
  const searchValue = payload.searchValue;
  const offlineMode = payload.offlineMode;
  if (Number(offlineMode) === 1) {
    return await getDefaultProductLocal();
  } else {
    const response = await fetch(graphqlPath, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        query: `{
      products(filter: { sku: { like: "%${searchValue}%" } }) {
        items {
          id
          attribute_set_id
          name
          sku
          type_id
          media_gallery_entries {
             file
          }
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          categories {
            id
          }
          ... on ConfigurableProduct {
            configurable_options {
              id
              attribute_id
              label
              position
              use_default
              attribute_code
              values {
                value_index
                label
              }
              product_id
            }
            variants {
              product {
                id
                name
                sku
                attribute_set_id
                ... on PhysicalProductInterface {
                  weight
                }
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
              }
              attributes {
                label
                code
                value_index
              }
            }
          }
        }
      }
    }`
      })
    });
    const data = await response.json();
    return data.data.products.items;
  }
}

/**
 * Get detail product configurable
 * @param payload
 */
export async function getDetailProductConfigurableService(payload) {
  const response = await fetch(graphqlPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      query: `{
      products(filter: { sku: { eq: "${payload.payload}" } }) {
        items {
          id
          attribute_set_id
          name
          sku
          type_id
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          categories {
            id
          }
          ... on ConfigurableProduct {
            configurable_options {
              id
              attribute_id
              label
              position
              use_default
              attribute_code
              values {
                value_index
                label
              }
              product_id
            }
            variants {
              product {
                id
                name
                sku
                attribute_set_id
                ... on PhysicalProductInterface {
                  weight
                }
                 media_gallery_entries {
                  file
                }
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
              }
              attributes {
                label
                code
                value_index
              }
            }
          }
        }
      }
    }`
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Get detail product bundle service
 * @returns {Promise<void>}
 */
export async function getDetailProductBundleService(payload) {
  const response = await fetch(graphqlPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      query: `{
        products(filter: {sku:
          {eq: "${payload.payload}"}
        })
         {
            items{
               sku
               type_id
               id
               name
                ... on BundleProduct {
                dynamic_sku
                dynamic_price
                dynamic_weight
                price_view
                media_gallery_entries {
                  file
                }
                ship_bundle_items
                items {
                  option_id
                  title
                  required
                  type
                  position
                  sku
                  options {
                    id
                    qty
                    position
                    is_default
                    price
                    price_type
                    can_change_quantity
                    label
                    product {
                      id
                      name
                      sku
                      type_id
                      media_gallery_entries {
                        file
                      }
                      price {
                      regularPrice {
                      amount  {
                          value
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
         }
      }
      `
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Get detail product grouped service
 * @returns {Promise<void>}
 */
export async function getDetailProductGroupedService(payload) {
  const response = await fetch(graphqlPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      query: `
           {
        products(filter: {sku: {eq: "${payload.payload}"}}) {
          items {
            id
            name
            sku
            type_id
            ... on GroupedProduct {
              items {
                qty
                position
                 product {
                    id
                    media_gallery_entries {
                      file
                    }
                    sku
                    name
                    price {
                      regularPrice {
                        amount {
                          value
                          currency
                        }
                      }
                    }
                    type_id
                    url_key
                  }
              }
            }
          }
        }
      }
      `
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Get products
 * @returns {Promise<any>}
 * @returns {Promise<any>}
 */
export async function getDefaultProductsService() {
  const response = await fetch(graphqlPath, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify({
      query: `{
           products(filter:
            {sku: {in: ["24-WG085_Group", "24-MB01", "MT07", "24-WG080", "MS12", "MS08", "MS09", "MS10", "MS11", "MS12", "MSH12", "MS06", "MS07", "WJ12", "WJ11", "WJ10", "WJ09"]}}
          )
          {
            items {
              id
              name
              sku
              media_gallery_entries {
                file
              }
              type_id
              price {
                regularPrice {
                  amount {
                    value
                    currency
                  }
                }
              }
            }
            total_count
            page_info {
              page_size
            }
          }
        }
      `
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Get products
 * @returns {Promise<any>}
 * @returns {Promise<any>}
 */
export async function getProductByCategoryService({ categoryId, offlineMode }) {
  if (Number(offlineMode) === 1) {
    return await getProductsByCategoryLocal(categoryId);
  } else {
    return await getProductsByCategory(categoryId).items;
  }
}

/* Page size for query products */
const defaultPageSize = 100;

/**
 *
 * @param categoryId
 * @param currentPage
 * @returns {Promise<{items: *}>} {items, totalCount}
 */
async function getProductsByCategory(categoryId, currentPage = 1) {
  const response = await fetch(graphqlPath, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify({
      query: `{
      products(filter: {category_id: {eq: "${categoryId}"}}, pageSize: ${defaultPageSize}, currentPage: ${currentPage}) {
      total_count,
        items {
          id
          attribute_set_id
          name
          sku
          type_id
          media_gallery_entries {
             file
          }
          price {
            regularPrice {
              amount {
                value
                currency
              }
            }
          }
          categories {
            id
          }
          ... on ConfigurableProduct {
            configurable_options {
              id
              attribute_id
              label
              position
              use_default
              attribute_code
              values {
                value_index
                label
              }
              product_id
            }
            variants {
              product {
                id
                name
                sku
                attribute_set_id
                ... on PhysicalProductInterface {
                  weight
                }
                price {
                  regularPrice {
                    amount {
                      value
                      currency
                    }
                  }
                }
              }
              attributes {
                label
                code
                value_index
              }
            }
          }
        }
      }
    }`
    })
  });
  const data = await response.json();
  return {
    items: data.data.products.items,
    totalCount: data.data.products.total_count
  };
}

/**
 * Sync all products
 * @param listCategories
 */
export function syncAllProducts(listCategories) {
  const childCategories = listCategories.children_data;
  let existsChildInList = false;

  if (childCategories.length > 0) {
    childCategories.forEach(async item => {
      // Show counter product
      const productQty = await counterProduct();
      console.info('qty:', productQty);

      // Call api to get large products
      await syncAllProductsByCategory(item.id, item);

      if (item.children_data.length > 0) {
        existsChildInList = true;
        await syncAllProducts(item);
      }
    });
  }
}

/**
 * Get product with paging by category
 * @param categoryId
 * @param category
 */
async function syncAllProductsByCategory(categoryId, category = null) {
  // Let all parents categories of this category
  const defaultCategory = await getCategories();

  console.log('dd0:', defaultCategory);

  const allParentIds = await findAllParentCategories(defaultCategory[0].children_data, category);

  console.log('item category:', category);

  const currentPage = 1;
  // Get products as first page
  const productsResult = await getProductsByCategory(categoryId, currentPage);

  // Sync products
  const totalCount = productsResult.totalCount;
  syncProducts(productsResult.items);
  const page = totalCount / defaultPageSize;
  if (page > 1) {
    // Get by next page, rounding increases
    const numberPage = Math.ceil(page);

    // Get products from n page
    for (let i = 2; i <= numberPage; i++) {
      // Sync products
      const productsResult = await getProductsByCategory(categoryId, i);
      syncProducts(productsResult.items);
    }
  }
}

// Find parents
async function findAllParentCategories(defaultCategory, category, parentIds = []) {
  // Get first parent
  const parentId = category.parent_id;
  const childrenCategories = category.children_data;

  console.log('prev parents:', parentIds);
  console.log('default category:', defaultCategory);

  if(defaultCategory.length > 0) {
    let foundCategory = null;
    defaultCategory.forEach(item => {
      if (parentId === item.id) {
        // Found
        foundCategory = item;
        parentIds.push(item.id);
      }
    });

    // Next, find parent_id of found item
    if(foundCategory) {
      // Find all parent of found item
      await findAllParentCategories(defaultCategory, foundCategory, parentIds);
    }
  }
}
