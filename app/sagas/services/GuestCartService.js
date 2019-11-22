import { adminToken, baseUrl } from '../../params';

const graphqlPath = `${baseUrl}graphql`;

/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
export async function createGuestCartService() {
  console.log('run to create guest cart');
  const response = await fetch(`${baseUrl}index.php/rest/V1/guest-carts/`, {
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
    body: JSON.stringify({}) // body data type must match "Content-Type" header
  });
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}

/**
 * Add product to quote
 * @param cartToken
 * @param sku
 * @returns {Promise<void>}
 */
export async function addProductToQuote(cartToken, sku) {
  const url = `${baseUrl}index.php/rest/V1/guest-carts/${cartToken}/items`;
  const cartItem = {
    cartItem: {
      quote_id: cartToken,
      sku,
      qty: 1
    }
  };
  const response = await fetch(url, {
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
    body: JSON.stringify(cartItem) // body data type must match "Content-Type" header
  });
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}

/**
 *
 * @param cartToken
 * @returns {Promise<void>}
 */
export async function getGuestCartDetail(cartToken) {
  const url = `${baseUrl}index.php/rest/V1/guest-carts/${cartToken}`;
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer' // no-referrer, *client
  });
  const data = await response.json();
  return data;
}

/**
 * Add shipping information service
 * @param cartToken
 * @returns {Promise<any>}
 */
export async function addShippingInformationService(cartToken) {
  const url = `${baseUrl}index.php/rest/V1/guest-carts/${cartToken}/shipping-information`;
  const response = await fetch(url, {
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
      addressInformation: {
        shippingAddress: {
          country_id: 'US',
          street: ['Street Address'],
          company: 'Company',
          telephone: '2313131312',
          postcode: 'A1B2C3',
          regionId: '1',
          city: 'California',
          firstname: 'chien',
          lastname: 'vu',
          email: 'fchienvuhoang@gmail.com',
          sameAsBilling: 1
        },
        billingAddress: {
          country_id: 'US',
          street: ['Street Address'],
          company: 'Company',
          telephone: '2313131312',
          postcode: 'A1B2C3',
          regionId: '1',
          city: 'California',
          firstname: 'chien',
          lastname: 'vu',
          email: 'fchienvuhoang@gmail.com'
        },
        shipping_method_code: 'flatrate',
        shipping_carrier_code: 'flatrate'
      }
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
export async function getProductsService() {
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
            {sku: {in: ["24-WG085_Group", "24-MB01", "MT07", "24-WG080"]}}
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
 * Place cash order
 * @returns {Promise<void>}
 * @param cartToken
 */
export async function placeCashOrderService(cartToken) {
  const url = `${baseUrl}index.php/rest/V1/guest-carts/${cartToken}/order`;
  const response = await fetch(url, {
    method: 'PUT',
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
      paymentMethod: { method: 'checkmo' },
      app: 'LOF_POS',
      addressInformation: {
        shippingAddress: {
          country_id: 'US',
          street: ['Street Address'],
          company: 'Company',
          telephone: '2313131312',
          postcode: 'A1B2C3',
          regionId: '1',
          city: 'California',
          firstname: 'john',
          lastname: 'harrison',
          email: 'guestuser@gmail.com',
          sameAsBilling: 1
        },
        billingAddress: {
          country_id: 'US',
          street: ['Street Address'],
          company: 'Company',
          telephone: '2313131312',
          postcode: 'A1B2C3',
          regionId: '1',
          city: 'California',
          firstname: 'john',
          lastname: 'harrison',
          email: 'guestuser@gmail.com'
        },
        shipping_method_code: 'flatrate',
        shipping_carrier_code: 'flatrate'
      }
    })
  });
  const data = await response.json();
  return data;
}
