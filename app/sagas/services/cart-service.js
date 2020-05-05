import { format } from 'date-fns';
import { createOrders } from '../../reducers/db/sync_orders';
import { apiGatewayPath } from '../../../configs/env/config.main';

/**
 * Get discount and info for new quote
 * @param payload list products to add to cart
 * @returns void
 */
export async function getDiscountForQuoteService(payload) {
  const formDataCart = new FormData();
  formDataCart.append('param', JSON.stringify([]));
  let data;
  const { cart, config, discountCode } = payload;
  const customerId = config.default_guest_checkout.customer_id || null;
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
            discountCode
          })
        })
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

export async function syncOrderService(params) {
  console.log('payload in sync order service ');
  console.log(params);
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
    return data;
  } catch (err) {
    return { errors: true };
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
