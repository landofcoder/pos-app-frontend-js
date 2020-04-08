/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
import { getByKey, signUpCustomer } from '../../reducers/db/sync_customers';
import { apiGatewayPath } from '../../../configs/env/config.main';

export async function searchCustomer(payload) {
  const searchValue = payload.payload;
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer/search-customer`,
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
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.liveToken}`
      },
      redirect: 'follow',
      referrer: 'no-referrer'
    }
  );
  const data = await response.json();
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
        method: 'POST',
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
        })
      }
    );
    data = await response.json();
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
