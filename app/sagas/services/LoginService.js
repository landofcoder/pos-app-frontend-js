import { baseUrl } from '../../params';
import { createKey, getByKey } from '../../reducers/db/settings';

const loggedInfoKey = 'logged_info';

export async function createLoggedDb(payload) {
  await createKey(loggedInfoKey, payload);
}

export async function getLoggedDb() {
  const data = await getByKey(loggedInfoKey);
  if (data.length > 0) {
    return data[0];
  }
  return false;
}

export async function loginService(payload) {
  let response;
  try {
    response = await fetch(
      `${baseUrl}index.php/rest/V1/integration/admin/token`,
      {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
          username: payload.payload.username, // roni_cost@example.com
          password: payload.payload.password // roni_cost3@example.com
        }) // body data type must match "Content-Type" header
      }
    );
  } catch (e) {
    response = '';
  }
  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return '';
}

export async function getInfoCashierService() {
  const response = await fetch(`${baseUrl}index.php/rest/V1/lof-cashier`, {
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
  });
  const data = await response.json(); // parses JSON response into native JavaScript objects
  return data;
}