import { format } from 'date-fns';
import { BUNDLE } from '../../constants/product-types';
import { getBundleOption } from '../../common/product';
import { createOrders } from '../../reducers/db/sync_orders';

/**
 * Add product to quote
 * @param cartId
 * @param item
 * @param payloadCart
 * @returns void
 */
export async function addProductToQuote(cartId, item, payloadCart) {
  let url = '';
  let token = window.liveToken;
  const { sku } = item;
  const posQty = item.pos_qty;
  if (payloadCart.isGuestCustomer) {
    url = `${window.mainUrl}index.php/rest/V1/guest-carts/${cartId}/items`;
  } else {
    // Customer logged
    url = `${window.mainUrl}index.php/rest/V1/carts/mine/items`;
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
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(cartItem)
  });
  const data = await response.json();
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
  let token = window.liveToken;
  const cartId = payloadCart.cartIdResult;
  const { defaultPaymentMethod, cashierInfo } = payloadCart;
  let method = 'PUT';

  if (payloadCart.isGuestCustomer) {
    url = `${window.mainUrl}index.php/rest/V1/guest-carts/${cartId}/order`;
  } else {
    // Customer logged
    url = `${window.mainUrl}index.php/rest/V1/carts/mine/payment-information`;
    token = payloadCart.customerToken;
    method = 'POST';
  }

  const response = await fetch(url, {
    method,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify({
      paymentMethod: { method: defaultPaymentMethod },
      app: 'LOF_POS',
      cashier_name: cashierInfo.first_name,
      cashier_email: cashierInfo.email,
      cashier_phone: cashierInfo.phone
    })
  });
  const data = await response.json();
  return data;
}

/**
 * Create guest cart service
 * @returns void
 */
export async function createGuestCartService() {
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/guest-carts/`,
    {
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
      body: JSON.stringify({})
    }
  );
  const data = await response.json();
  return data;
}

/**
 * Add shipping information service
 * @param cartToken
 * @param payloadCart
 * @returns void
 */
export async function addShippingInformationService(cartToken, payloadCart) {
  console.log('payload cart:', payloadCart);
  let url = '';
  let token = window.liveToken;
  const {
    defaultShippingMethod,
    posSystemConfigCustomer,
    defaultGuestCheckout
  } = payloadCart;
  if (payloadCart.isGuestCustomer) {
    url = `${window.mainUrl}index.php/rest/V1/guest-carts/${cartToken}/shipping-information`;
  } else {
    // Customer logged
    url = `${window.mainUrl}index.php/rest/V1/carts/mine/shipping-information`;
    token = payloadCart.customerToken;
  }

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify({
      addressInformation: {
        shippingAddress: renderShippingAddress(
          posSystemConfigCustomer,
          defaultGuestCheckout
        ),
        billingAddress: renderShippingAddress(
          posSystemConfigCustomer,
          defaultGuestCheckout
        ),
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
 * @param defaultGuestCheckout
 * @returns void
 */
function renderShippingAddress(customerConfig, defaultGuestCheckout) {
  console.log('dd1:', customerConfig);
  console.log('dd2:', defaultGuestCheckout);

  let city;
  let country;
  let email;
  let firstName;
  let lastName;
  let street;
  let telephone;
  let postcode = '';
  let regionId = 1;

  // If customer selected
  if (customerConfig) {
    city = customerConfig ? customerConfig.city : '';
    country = customerConfig ? customerConfig.country : '';
    email = customerConfig ? customerConfig.email : '';
    firstName = customerConfig ? customerConfig.first_name : '';
    lastName = customerConfig ? customerConfig.last_name : '';
    street = customerConfig ? customerConfig.street : [''];
    telephone = customerConfig ? customerConfig.telephone : '';
  } else {
    // Get from customer guest checkout
    // eslint-disable-next-line prefer-destructuring
    city = defaultGuestCheckout.city;
    // eslint-disable-next-line prefer-destructuring
    country = defaultGuestCheckout.country;
    // eslint-disable-next-line prefer-destructuring
    email = defaultGuestCheckout.email;
    firstName = defaultGuestCheckout.first_name;
    lastName = defaultGuestCheckout.last_name;
    // eslint-disable-next-line prefer-destructuring
    street = [defaultGuestCheckout.street];
    // eslint-disable-next-line prefer-destructuring
    telephone = defaultGuestCheckout.telephone;
    // eslint-disable-next-line prefer-destructuring
    regionId = defaultGuestCheckout.region_id;
    postcode = defaultGuestCheckout.zip_code;
  }
  return {
    country_id: country,
    street,
    company: '',
    telephone,
    postcode,
    regionId,
    city,
    firstname: firstName,
    lastname: lastName,
    email,
    sameAsBilling: 1
  };
}

/**
 * Create Receipt service
 * @param orderId
 * @returns void
 */
export async function createInvoiceService(orderId) {
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/order/${orderId}/invoice`,
    {
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
        capture: true,
        notify: true
      })
    }
  );
  const data = await response.json();
  return data;
}

export async function createShipmentService(orderId) {
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/order/${orderId}/ship`,
    {
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
      body: JSON.stringify({})
    }
  );
  const data = await response.json();
  return data;
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
      `${window.mainUrl}index.php/rest/V1/pos/get-discount-quote`,
      {
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
        body: JSON.stringify({ param: JSON.stringify({ cart, config }) })
      }
    );
    data = await response.json();
  } catch (e) {
    return 'error';
  }
  return data;
}

/**
 * Get order from local
 * @param payload
 * @returns void
 */
export async function createOrderLocal(payload) {
  const { cartCurrentResult, orderPreparingCheckoutResult } = payload;
  console.log('dd1:', cartCurrentResult);
  console.log('dd2:', orderPreparingCheckoutResult);
  console.log('dd3-date:', format(new Date(), 'yyyy-MM-dd hh:m:s'));
  const newOrder = {
    id: Date.now(),
    grand_total: orderPreparingCheckoutResult.totals.grand_total,
    items: payload,
    local: true,
    created_at: format(new Date(), 'yyyy-MM-dd hh:m:s')
  };
  const res = await createOrders(newOrder);
  console.log('response:', res);
}

export async function syncOrderService(payload) {
  console.log('payload in sync order service ');
  console.log(payload);
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/lof-sync-orders/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.liveToken}`
      },
      body: JSON.stringify(payload)
    }
  );
  const data = await response.json();
  return data;
}
