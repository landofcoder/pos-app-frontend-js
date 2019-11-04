const adminToken = '1x4yqtfxwp3lnozbfam2zkes706336fh';

/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
export async function createGuestCartService() {
  const response = await fetch(
    'http://extension.magento232.localhost/index.php/rest/V1/guest-carts/',
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

/**
 * Add product to quote
 * @param cartToken
 * @param sku
 * @returns {Promise<void>}
 */
export async function addProductToQuote(cartToken, sku) {
  const url = `http://extension.magento232.localhost/index.php/rest/V1/guest-carts/${cartToken}/items`;
  const cartItem = {
    cartItem: {
      quote_id: cartToken,
      sku,
      qty: 2
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
  const url = `http://extension.magento232.localhost/index.php/rest/V1/guest-carts/${cartToken}`;
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
  const url = `http://extension.magento232.localhost/index.php/rest/V1/guest-carts/${cartToken}/shipping-information`;
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
          postcode: '',
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
          postcode: '',
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
