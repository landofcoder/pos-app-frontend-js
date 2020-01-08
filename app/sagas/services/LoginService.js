import { cashierInfoSync, getCashierInfoLocal } from './SettingsService';
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
      `${window.mainUrl}index.php/rest/V1/integration/admin/token`,
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

/**
 * Get info cashier
 * @returns void
 */
export async function getInfoCashierService() {
  let data;
  let error = false;
  try {
    const response = await fetch(`${window.mainUrl}index.php/rest/V1/lof-cashier`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.liveToken}`
      },
      redirect: 'follow', // manual, *follow, error
      referrer: 'no-referrer' // no-referrer, *clien
    });
    data = await response.json();
  } catch (e) {
    data = [];
    error = true;
  }

  console.log('cashier:', data);

  if (error) {
    // Query to local
    data = await getCashierInfoLocal();
    if (data.length > 0) {
      return data[0].value;
    }
  } else {
    // Sync now
    await cashierInfoSync(data);
  }
  return data;
}
