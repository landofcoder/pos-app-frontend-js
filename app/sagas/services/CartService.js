import { adminToken, baseUrl } from '../../params';
import { BUNDLE } from '../../constants/product-types';
import { getBundleOption } from '../../common/product';

/**
 * Add product to quote
 * @param cartId
 * @param item
 * @param payloadCart
 * @returns void
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
  if (item.type_id === BUNDLE) {
    const bundleOption = getBundleOption(item);
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
  return await response.json(); // parses JSON response into native JavaScript objects
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
  const { defaultPaymentMethod, cashierInfo } = payloadCart;
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
      cashier_name: cashierInfo.first_name,
      cashier_email: cashierInfo.email,
      cashier_phone: cashierInfo.phone
    })
  });
  return await response.json();
}

/**
 * Create guest cart service
 * @returns void
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
  return await response.json(); // parses JSON response into native JavaScript objects
}

/**
 * Add shipping information service
 * @param cartToken
 * @param payloadCart
 * @returns void
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
  return await response.json();
}

/**
 * Render shipping address
 * @param customerConfig
 * @returns void
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
 * @returns void
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
  return await response.json();
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
  return await response.json();
}

/**
 * Get discount and info for new quote
 * @param payload list products to add to cart
 * @returns void
 */
export async function getDiscountForQuoteService(payload) {
  const formDataCart = new FormData();
  formDataCart.append('param', JSON.stringify([]));
  let data;
  const { cart } = payload;
  const { config } = payload;
  try {
    const response = await fetch(
      `${baseUrl}index.php/rest/V1/pos/get-discount-quote`,
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
        body: JSON.stringify({ param: JSON.stringify({ cart, config }) }) // body data type must match "Content-Type" header
      }
    );
    data = await response.json();
  } catch (e) {
    return 'error';
  }
  return data;
}
