/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
import { getByName, signUpCustomerDb } from '../../reducers/db/sync_customers';
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
    if (data.message || data.errors) {
      // eslint-disable-next-line no-throw-literal
      throw { message: data.message || data.errors };
    }
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
    const result = getByName(searchValue);
    return result;
  } catch (e) {
    return [];
  }
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
    if (data.message || data.errors) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: data.data.errors[0].debugMessage || 'Customers cannot sync',
        data: data.errors
      };
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-throw-literal
    throw {
      message: e.message || 'Customers cannot sync from server',
      data: e.data
    };
  }
}

export async function signUpCustomerServiceDb(payload) {
  try {
    const result = await signUpCustomerDb(payload);
    return { data: result, success: true };
  } catch (err) {
    console.log(err);
    return { message: 'Something was wrong when signup', success: false };
  }
}
