import { adminToken, baseUrl } from '../../params';

/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
export async function searchCustomer() {
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/products/?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=fchienvuhoang@gmail.com&searchCriteria[filter_groups][0][filters][0][condition_type]=like`,
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
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}
