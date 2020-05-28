import { createOrders } from '../../reducers/db/sync_orders';
import { apiGatewayPath } from '../../../configs/env/config.main';
import { updateCustomerOrderListById } from '../../reducers/db/sync_customers';

/**
 * Get discount and info for new quote
 * @param payload list products to add to cart
 * @returns void
 */
export async function getDiscountForQuoteService(payload) {
  const formDataCart = new FormData();
  formDataCart.append('param', JSON.stringify([]));
  let data;
  const { cart, discountCode, listGiftCard, customerId } = payload;
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer-checkout/get-discount-quote`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          platform: window.platform,
          token: window.liveToken,
          url: window.mainUrl
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({
          params: JSON.stringify({
            cart,
            customerId,
            discountCode,
            listGiftCard
          })
        })
      }
    );
    data = await response.json();
    // eslint-disable-next-line no-throw-literal
    if (!data.cartId || !data.cartTotals || data.message)
      // eslint-disable-next-line no-throw-literal
      throw { message: data.message || 'Can not create Cart', data: {} };
    return data;
  } catch (e) {
    // eslint-disable-next-line no-throw-literal
    throw { message: e.message || 'Unable to connect server', data: {} };
  }
}

/**
 * Get order from local
 * @param payload
 * @returns void
 */
export async function createOrderLocal(payload) {
  const { cartCurrentResult, orderPreparingCheckoutResult } = payload;
  const orderId = Date.now();
  const customer = Object.assign({}, cartCurrentResult.customer);
  // truong hop la customer va customer do chua duoc dong bo
  if (!cartCurrentResult.isGuestCustomer && !customer.status) {
    // luu order id vao customer do
    await updateCustomerOrderListById(customer, orderId);
  }
  const newOrder = {
    id: orderId,
    grand_total: orderPreparingCheckoutResult.totals.grand_total,
    items: payload,
    local: true,
    created_at: Date.now()
  };
  const res = await createOrders(newOrder);
  console.log('response:', res);
}

export async function syncOrderService(params) {
  console.log('sync order');

  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer-checkout/sync-order`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          platform: window.platform,
          token: window.liveToken,
          url: window.mainUrl,
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({ params })
      }
    );
    const data = await response.json();
    if (data.message || data.errors || !data.status) {
      console.log(data.message || 'Can not create order');

      // eslint-disable-next-line no-throw-literal
      throw {
        message: data.message || 'Can not create order',
        data: data.data || data.errors
      };
    }
    return data;
  } catch (error) {
    return {
      message: error.message || 'Unable to connect server',
      data: error.data
    };
  }
}

export async function noteOrderActionService(payload) {
  const params = {
    statusHistory: {
      comment: payload.message,
      created_at: Date.now()
    }
  };
  try {
    const response = await fetch(
      `${window.mainUrl}index.php/rest/V1/orders/${payload.id}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.liveToken}`
        },
        body: JSON.stringify(params)
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
  return { errors: true };
}

export async function getRewardPointService({ customerId }) {
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer-checkout/reward-points-info?customerId=${customerId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          platform: window.platform,
          token: window.liveToken,
          url: window.mainUrl
        }
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
  return null;
}
