import { adminToken, baseUrl } from '../../params';

/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
export async function searchCustomer(payload) {
  const searchValue = payload.payload;
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/customers/search?searchCriteria[filterGroups][0][filters][0][field]=entity_id&searchCriteria[filterGroups][0][filters][0][value]=${searchValue}&searchCriteria[filterGroups][0][filters][0][condition_type]=like&searchCriteria[filterGroups][0][filters][1][field]=email&searchCriteria[filterGroups][0][filters][1][value]=${searchValue}&searchCriteria[filterGroups][0][filters][1][condition_type]=like`,
    {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *client
    }
  );
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}

/**
 * Create customer cart service
 * @returns {Promise<any>}
 */
export async function getCustomerCartTokenService(customerId) {
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/pos/${customerId}/customer/token`,
    {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *clien
    }
  );
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}