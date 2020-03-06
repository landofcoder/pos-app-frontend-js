/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
import { getGraphqlPath } from '../../common/settings';

export async function searchCustomerByName(payload) {
  const searchValue = payload.payload;
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/customers/search?searchCriteria[filter_groups][0][filters][0][field]=firstname&searchCriteria[filter_groups][0][filters][0][value]=${searchValue}&searchCriteria[filter_groups][0][filters][0][condition_type]=like`,
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
      referrer: 'no-referrer' // no-referrer, *client
    }
  );
  const data = await response.json();
  return data;
}

export async function searchCustomer(payload) {
  const searchValue = payload.payload;
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/customers/search?searchCriteria[filterGroups][0][filters][0][field]=entity_id&searchCriteria[filterGroups][0][filters][0][value]=${searchValue}&searchCriteria[filterGroups][0][filters][0][condition_type]=like&searchCriteria[filterGroups][0][filters][1][field]=email&searchCriteria[filterGroups][0][filters][1][value]=${searchValue}&searchCriteria[filterGroups][0][filters][1][condition_type]=like`,
    {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.liveToken}`
        // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *client
    }
  );
  const data = await response.json();
  return data;
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
  try {
    const response = await fetch(getGraphqlPath(), {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        query: `mutation {
        createCustomer(
          input: {
            firstname: "${payload.payload.customer.firstname}"
            lastname: "${payload.payload.customer.lastname}"
            email: "${payload.payload.customer.email}"
            password: "${payload.payload.password}"
            is_subscribed: true
          }
        ) {
          customer {
            id
            firstname
            lastname
            email
            is_subscribed
          }
        }
      }`
      }) // body data type must match "Content-Type" header
    });
    const data = await response.json(); // parses JSON response into native JavaScript objects
    if (!data.message && !data.errors) {
      return { data, ok: true };
    }
  } catch (e) {
    return { ok: false };
  }
}
