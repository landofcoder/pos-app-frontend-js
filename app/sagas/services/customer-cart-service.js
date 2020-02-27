/**
 * Create guest cart service
 * @returns {Promise<any>}
 */
export async function createCustomerCartService(customerToken) {
  const response = await fetch(
    `${window.mainUrl}index.php/rest/V1/carts/mine`,
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
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
