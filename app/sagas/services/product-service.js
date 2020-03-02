import { call } from 'redux-saga/effects';
import {
  searchProductsLocal,
  getProductBySku,
  getProductsByCategoryLocal,
  syncProducts,
  counterProduct
} from '../../reducers/db/products';
import { getCategories } from '../../reducers/db/categories';
import { getAllTbl, deleteByKey } from '../../reducers/db/sync_custom_product';
import {
  getGraphqlPath,
  getOfflineMode,
  defaultPageSize
} from '../../common/settings';
import {
  QUERY_GET_PRODUCT_BY_CATEGORY,
  QUERY_SEARCH_PRODUCT
} from '../../constants/product-query';
import { updateCurrentPosCommand } from './common-service';

/**
 * Search product service
 * @returns array
 */
export function* searchProductService(payload) {
  const offlineMode = yield getOfflineMode();
  const { searchValue, currentPage } = payload;

  // Update to current command
  yield updateCurrentPosCommand(
    QUERY_SEARCH_PRODUCT,
    0,
    searchValue,
    currentPage
  );

  if (offlineMode === 1) {
    const data = yield searchProductsLocal(searchValue, currentPage);
    return data;
  }

  const data = yield querySearchProduct(searchValue, currentPage);
  return data;
}

/**
 * Get product by sku for scanner
 * @param payload
 * @returns void
 */
export function* getProductBySkuFromScanner(payload) {
  const offlineMode = yield getOfflineMode();
  const sku = payload;
  if (offlineMode === 1) {
    return yield getProductBySku(sku);
  }
  // Call filter by sku
  const result = yield querySearchProduct(sku, 1);
  if (result && result.length > 0) {
    return result[0];
  }
}

/**
 * Search product
 * @param searchValue
 * @param currentPage
 * @returns void
 */
export async function querySearchProduct(searchValue, currentPage) {
  try {
    let itemResult = [];
    // Full text search by product name
    const response = await fetch(getGraphqlPath(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.liveToken}`
      },
      body: JSON.stringify({
        query: `{
          products(${
            searchValue.length > 0 ? `search: "${searchValue}",` : ''
          } filter: {}, pageSize: ${defaultPageSize}, currentPage: ${currentPage}) {
            items {
              id
              attribute_set_id
              name
              sku
              type_id
              special_price
              special_from_date
              special_to_date
              tier_prices {
                qty
                value
                customer_group_id
                percentage_value
                value
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
                    special_price
                    special_from_date
                    special_to_date
                    tier_prices {
                      qty
                      value
                      customer_group_id
                      percentage_value
                      value
                    }
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
            }
          }
        }`
      })
    });
    const data = await response.json();
    if (!data.data.products.items) itemResult = [];
    else itemResult = data.data.products.items;
    if (!itemResult || itemResult.length === 0) {
      const response = await fetch(getGraphqlPath(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.liveToken}`
        },
        body: JSON.stringify({
          query: `{
          products(filter: { sku: { eq: "${searchValue}" }}, pageSize: ${defaultPageSize}, currentPage: ${currentPage}) {
            items {
              id
              attribute_set_id
              name
              sku
              type_id
              special_price
              special_from_date
              special_to_date
              tier_prices {
                qty
                value
                customer_group_id
                percentage_value
                value
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
                    special_price
                    special_from_date
                    special_to_date
                    tier_prices {
                      qty
                      value
                      customer_group_id
                      percentage_value
                      value
                    }
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
            }
          }
        }`
        })
      });
      const data = await response.json();
      itemResult = data.data.products.items;
    }

    return itemResult;
  } catch (e) {
    return [];
  }
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
                special_price
                special_from_date
                special_to_date
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
                      special_price
                      special_from_date
                      special_to_date
                      tier_prices {
                        qty
                        value
                        customer_group_id
                        percentage_value
                        value
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
                    special_price
                    special_from_date
                    special_to_date
                     tier_prices {
                      qty
                      value
                      customer_group_id
                      percentage_value
                      value
                    }
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
 * @returns array
 */
export function* getProductByCategoryService({ categoryId, currentPage = 1 }) {
  const offlineMode = yield getOfflineMode();

  // Update to current command
  yield updateCurrentPosCommand(
    QUERY_GET_PRODUCT_BY_CATEGORY,
    categoryId,
    '',
    currentPage
  );

  if (offlineMode === 1) {
    const data = yield call(getProductsByCategoryLocal, {
      categoryId,
      currentPage
    });
    return data;
  }
  const data = yield call(getProductsByCategory, { categoryId, currentPage });
  return data.items;
}

/**
 * @returns array
 */
async function getProductsByCategory(payload) {
  const { categoryId, currentPage } = payload;
  try {
    const response = await fetch(getGraphqlPath(), {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.liveToken}`
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify({
        query: `{
  products(
    filter: { category_id: { eq: "${categoryId}" } }
    pageSize: ${defaultPageSize}
    currentPage: ${currentPage}
  ) {
    total_count
    items {
      id
      attribute_set_id
      name
      sku
      type_id
      special_price
      special_from_date
      special_to_date
      media_gallery_entries {
        file
      }
      tier_prices {
        qty
        value
        customer_group_id
        percentage_value
        value
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
            special_price
            special_from_date
            special_to_date
            tier_prices {
              qty
              value
              customer_group_id
              percentage_value
              value
            }
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
              special_price
              special_from_date
              special_to_date
              tier_prices {
                qty
                value
                customer_group_id
                percentage_value
                value
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
            special_price
            special_from_date
            special_to_date
            tier_prices {
              qty
              value
              customer_group_id
              percentage_value
              value
            }
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
    return {
      items: data.data.products.items,
      totalCount: data.data.products.total_count
    };
  } catch (e) {
    return {
      items: []
    };
  }
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
  const productsResult = await getProductsByCategory({
    categoryId,
    currentPage
  });
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
      const productsResult = await getProductsByCategory({
        categoryId,
        currentPage: i
      });
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

export async function syncCustomProductAPI(payload) {
  console.log(payload);
}
export async function syncCustomProductService() {
  const data = await getAllTbl();
  console.log('sync custom product');
  console.log(data);
  for (let i = 0; i < data.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const status = await syncCustomProductAPI(data[i]);
    if (status) {
      // delete db
      // eslint-disable-next-line no-await-in-loop
      await deleteByKey({ name: data[i].name });
    }
  }
}
