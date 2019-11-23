import { adminToken, baseUrl } from '../../params';

/**
 * Add product to quote
 * @param cartToken
 * @param sku
 * @param payloadCart
 * @returns {Promise<void>}
 */
export async function addProductToQuote(cartToken, sku, payloadCart) {
  let url = '';
  let token = adminToken;
  if (payloadCart.isGuestCustomer) {
    url = `${baseUrl}index.php/rest/V1/guest-carts/${cartToken}/items`;
  } else {
    // Customer logged
    url = `${baseUrl}index.php/rest/V1/carts/mine/items`;
    token = payloadCart.customerToken;
  }

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
