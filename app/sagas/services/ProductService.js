import {
  searchProductsLocal,
  getProductsByCategoryLocal,
  syncProducts,
  counterProduct
} from '../../reducers/db/products';
import { getCategories } from '../../reducers/db/categories';
import { getGraphqlPath } from '../../common/settings';

/**
 * Search product service
 * @returns array
 */
export async function searchProductService(payload) {
  const { searchValue, offlineMode } = payload;

  if (offlineMode === 1) {
    const data = await searchProductsLocal(searchValue);
    return data;
  }
  const response = await fetch(getGraphqlPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.liveToken}`
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

/**
 * Get detail product configurable
 * @param payload
 */
export async function getDetailProductConfigurableService(payload) {
  const response = await fetch(getGraphqlPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.liveToken}`
    },
    body: JSON.stringify({
      query: `{
      products(filter: { sku: { eq: "${payload}" } }) {
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
  const response = await fetch(getGraphqlPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.liveToken}`
    },
    body: JSON.stringify({
      query: `{
        products(filter: {sku:
          {eq: "${payload}"}
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
  const response = await fetch(getGraphqlPath(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.liveToken}`
    },
    body: JSON.stringify({
      query: `
           {
        products(filter: {sku: {eq: "${payload}"}}) {
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
  const response = await fetch(getGraphqlPath(), {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.liveToken}`
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
  let data;
  if (offlineMode === 1) {
    data = await getProductsByCategoryLocal(categoryId);
    return data;
  }
  data = await getProductsByCategory(categoryId).items;
  return data;
}

/* Page size for query products */
const defaultPageSize = 100;

/**
 *
 * @param categoryId
 * @param currentPage
 * @returns array
 */
async function getProductsByCategory(categoryId, currentPage = 1) {
  const response = await fetch(getGraphqlPath(), {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${window.liveToken}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify({
      query: `{
      products(filter: {category_id: {eq: "${categoryId}"}}, pageSize: ${defaultPageSize}, currentPage: ${currentPage}) {
        total_count
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
                media_gallery_entries {
                  file
                }
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
                      amount {
                        value
                      }
                    }
                  }
                }
              }
            }
          }
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
export async function syncAllProducts(listCategories) {
  const childCategories = listCategories.children_data;

  if (childCategories.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const cate of childCategories) {
      // Show counter product
      // eslint-disable-next-line no-await-in-loop
      const productQty = await counterProduct();
      console.log('qty:', productQty);

      // Call api to get large products
      // eslint-disable-next-line no-await-in-loop
      await syncAllProductsByCategory(cate.id);

      // Check children and recall this syncAllProducts
      if (cate.children_data.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await syncAllProducts(cate);
      }
    }
  }
}

/**
 * Get product with paging by category
 * @param categoryId
 */
async function syncAllProductsByCategory(categoryId) {
  const currentPage = 1;
  // Get products as first page
  const productsResult = await getProductsByCategory(categoryId, currentPage);

  // Let all parents categories of this category
  const defaultCategory = await getCategories();
  const allParentIds = await findAllParentCategories(
    defaultCategory[0].children_data,
    categoryId
  );

  // Sync products
  const { totalCount } = productsResult;
  await syncProducts(productsResult.items, allParentIds);
  const page = totalCount / defaultPageSize;

  if (page > 1) {
    // Get by next page, rounding increases
    const numberPage = Math.ceil(page);

    // Get products from n page
    for (let i = 2; i <= numberPage; i += 1) {
      // Sync products
      const productsResult = await getProductsByCategory(categoryId, i);
      await syncProducts(productsResult.items, allParentIds);
    }
  }
}

// Find parents
export async function findAllParentCategories(
  defaultCategory,
  parentId,
  parentIds = []
) {
  let foundParent = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of defaultCategory) {
    // Đã tìm thấy id cha
    if (item.id === parentId) {
      parentIds.push(item.id);
      foundParent = true;
      const newParentId = item.parent_id;
      // Đã tìm thấy parent, sẽ tìm lại từ đầu dựa trên mảng danh mục từ đầu
      // eslint-disable-next-line no-await-in-loop
      const defaultCategory = await getCategories();
      // eslint-disable-next-line no-await-in-loop
      await findAllParentCategories(
        defaultCategory[0].children_data,
        newParentId,
        parentIds
      );
    }

    // Nếu không tìm thấy, tiếp tục tìm trong child_data
    if (foundParent === false) {
      // Next, find it in children_data
      if (item.children_data.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await findAllParentCategories(item.children_data, parentId, parentIds);
      }
    }
  }

  return parentIds;
}
