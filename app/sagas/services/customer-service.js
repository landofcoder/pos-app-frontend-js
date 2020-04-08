/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
import { getGraphqlPath } from '../../common/settings';
import { getByKey, signUpCustomer } from '../../reducers/db/sync_customers';
import { apiGatewayPath } from '../../../configs/env/config.main';

export async function searchCustomer(payload) {
  const searchValue = payload.payload;
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer/search-customer`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          platform: window.platform,
          token: window.liveToken,
          url: window.mainUrl,
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
          searchValue
        })
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    return { items: [] };
  }
}

export async function searchCustomerByName(payload) {
  const searchValue = payload.payload;
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer/search-customer-by-name`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          platform: window.platform,
          token: window.liveToken,
          url: window.mainUrl,
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
          searchValue
        })
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    return { items: [] };
  }
}

export async function searchCustomerDbService(payload) {
  const searchValue = payload.payload;
  try {
    const result = getByKey(searchValue);
    return result;
  } catch (e) {
    return [];
  }
}
/**
 * Create customer cart service
 * @returns {Promise<any>}
 */
export async function getCustomerCartTokenService(customerId) {
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/pos/${customerId}/customer/token`,
    {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.liveToken}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *clien
    }
  );
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}

/**
 * Sign up customer
 * @param payload
 * @returns void
 */
export async function signUpCustomerService(payload) {
  let data;
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer/create-customer`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          platform: window.platform,
          token: window.liveToken,
          url: window.mainUrl,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: payload.payload.customer.firstname,
          lastName: payload.payload.customer.lastname,
          email: payload.payload.customer.email,
          password: payload.payload.password
        }) // body data type must match "Content-Type" header
      }
    );
    data = await response.json(); // parses JSON response into native JavaScript objects
    if (!data.message && !data.errors) {
      return { data, success: true };
    }
  } catch (e) {
    console.log(e);
  }
  return { data, success: false };
}

export async function signUpCustomerServiceDb(payload) {
  try {
    const result = signUpCustomer(payload);
    return { data: result, success: true };
  } catch (err) {
    console.log(err);
    return { message: 'Something was wrong when signup', success: false };
  }
}
