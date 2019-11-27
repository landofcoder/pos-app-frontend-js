import { adminToken, baseUrl } from '../../params';

/**
 * Add product to quote
 * @param cartId
 * @param sku
 * @param payloadCart
 * @returns {Promise<void>}
 */
export async function addProductToQuote(cartId, sku, payloadCart) {
  let url = '';
  let token = adminToken;
  if (payloadCart.isGuestCustomer) {
    url = `${baseUrl}index.php/rest/V1/guest-carts/${cartId}/items`;
  } else {
    // Customer logged
    url = `${baseUrl}index.php/rest/V1/carts/mine/items`;
    token = payloadCart.customerToken;
  }

  const cartItem = {
    cartItem: {
      quote_id: cartId,
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
      Authorization: `Bearer ${token}`
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
 * Place cash order
 * @returns {Promise<void>}
 * @param cartToken
 * @param payloadCart
 */
export async function placeCashOrderService(cartToken, payloadCart) {
  let url = '';
  let token = adminToken;
  const cartId = payloadCart.cartIdResult;
  let method = 'PUT';

  if (payloadCart.isGuestCustomer) {
    url = `${baseUrl}index.php/rest/V1/guest-carts/${cartId}/order`;
  } else {
    // Customer logged
    url = `${baseUrl}index.php/rest/V1/carts/mine/payment-information`;
    token = payloadCart.customerToken;
    method = 'POST';
  }

  const response = await fetch(url, {
    method,
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
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
        shipping_method_code: 'pos_shipping_store_pickup',
        shipping_carrier_code: 'pos_shipping_store_pickup'
      }
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
export async function createGuestCartService() {
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
 * Add shipping information service
 * @param cartToken
 * @param payloadCart
 * @returns {Promise<any>}
 */
export async function addShippingInformationService(cartToken, payloadCart) {
  let url = '';
  let token = adminToken;
  if (payloadCart.isGuestCustomer) {
    url = `${baseUrl}index.php/rest/V1/guest-carts/${cartToken}/shipping-information`;
  } else {
    // Customer logged
    url = `${baseUrl}index.php/rest/V1/carts/mine/shipping-information`;
    token = payloadCart.customerToken;
  }

  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
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
        shipping_method_code: 'pos_shipping_store_pickup',
        shipping_carrier_code: 'pos_shipping_store_pickup'
      }
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Create receipt service
 * @param adminToken
 * @param orderId
 * @returns {Promise<any>}
 */
export async function createInvoiceService(adminToken, orderId) {
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/order/${orderId}/invoice`,
    {
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
        capture: true,
        notify: true
      }) // body data type must match "Content-Type" header
    }
  );
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}

export async function createShipmentService(adminToken, orderId) {
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/order/${orderId}/ship`,
    {
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
    }
  );
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}
