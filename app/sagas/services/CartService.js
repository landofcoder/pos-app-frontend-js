import { adminToken, baseUrl } from '../../params';
import { BUNDLE } from '../../constants/product-types';
import { getBundleOption } from '../../common/product';

/**
 * Add product to quote
 * @param cartId
 * @param item
 * @param payloadCart
 * @returns {Promise<void>}
 */
export async function addProductToQuote(cartId, item, payloadCart) {
  let url = '';
  let token = adminToken;
  const { sku } = item;
  const posQty = item.pos_qty;
  if (payloadCart.isGuestCustomer) {
    url = `${baseUrl}index.php/rest/V1/guest-carts/${cartId}/items`;
  } else {
    // Customer logged
    url = `${baseUrl}index.php/rest/V1/carts/mine/items`;
    token = payloadCart.customerToken;
  }

  let productOption = {};
  const bundleOption = getBundleOption(item);
  if (item.type_id === BUNDLE) {
    productOption = { extension_attributes: { bundle_options: bundleOption } };
  }

  const cartItem = {
    cartItem: {
      quote_id: cartId,
      sku,
      qty: posQty,
      product_option: productOption
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
  const { defaultPaymentMethod } = payloadCart;
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
      paymentMethod: { method: defaultPaymentMethod },
      app: 'LOF_POS',
      cashier_name: 'nguyen tuan',
      cashier_email: 'nhtuan@gmail.com',
      cashier_phone: '0123456789',
      cashier_address: 'ha noi'
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
  const { defaultShippingMethod, posSystemConfigCustomer } = payloadCart;
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
        shippingAddress: renderShippingAddress(posSystemConfigCustomer),
        billingAddress: renderShippingAddress(posSystemConfigCustomer),
        shipping_method_code: defaultShippingMethod,
        shipping_carrier_code: defaultShippingMethod
      }
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Render shipping address
 * @param customerConfig
 * @returns {{firstname: *, regionId: string, city: *, street: *, postcode: string, company: string, telephone: string, sameAsBilling: number, country_id: (*|string), email: *, lastname: *}}
 */
function renderShippingAddress(customerConfig) {
  const city = customerConfig ? customerConfig.city : 'California';
  const country = customerConfig ? customerConfig.country : 'US';
  const email = customerConfig ? customerConfig.email : 'guestemail@gmail.com';
  const firstName = customerConfig ? customerConfig.first_name : 'john';
  const lastName = customerConfig ? customerConfig.harrison : 'harrison';
  const street = customerConfig ? customerConfig.street : ['Street Address'];
  const telephone = customerConfig ? customerConfig.telephone : '2313131312';
  return {
    country_id: country,
    street,
    company: '',
    telephone,
    postcode: 'A1B2C3',
    regionId: '1',
    city,
    firstname: firstName || 'john',
    lastname: lastName || 'harrison',
    email,
    sameAsBilling: 1
  };
}

/**
 * Create Receipt service
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
