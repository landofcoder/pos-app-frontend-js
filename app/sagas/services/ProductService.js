import { adminToken, baseUrl } from '../../params';

const graphqlPath = `${baseUrl}graphql`;

/**
 * Search product service
 * @returns {any}
 */
export async function searchProductService(payload) {
  const response = await fetch(graphqlPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      query: `{
      products(filter: { sku: { like: "%${payload.payload}%" } }) {
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
  return data;
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
export async function getProductByCategoryService(categoryId) {
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
      products(filter: {category_id: {eq: "${categoryId}"}}) {
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
  return data;
}
