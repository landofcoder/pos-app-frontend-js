import { baseUrl } from '../../params';

async function posData(payload) {
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/integration/admin/token`,
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // Authorization: `Bearer ${adminToken}`
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify({
        username: payload.payload.username, // roni_cost@example.com
        password: payload.payload.password // roni_cost3@example.com
      }) // body data type must match "Content-Type" header
    }
  );
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}
export async function AuthenService(payload) {
  try {
    const data = await posData(payload);
    return data;
  } catch (error) {
    throw error;
  }
}
export async function getInfoCashierService(adminToken) {
  const response = await fetch(`${baseUrl}index.php/rest/V1/lof-cashier`, {
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
  });
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}
