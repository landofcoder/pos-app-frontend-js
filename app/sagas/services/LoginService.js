import { cashierInfoSync, getCashierInfoLocal } from './SettingsService';
import {
  getByKeyV2,
  createKey,
  updateById,
  deleteByKey
} from '../../reducers/db/settings';

const loggedInfoKey = 'logged_info';
const mainUrlKey = 'main_url';

export async function createLoggedDb(payload) {
  const loggedDb = await getByKeyV2(loggedInfoKey);
  if (loggedDb) {
    // Update
    await updateById(loggedDb.id, payload);
  } else {
    // Create new
    await createKey(loggedInfoKey, payload);
  }
}

export async function deleteLoggedDb() {
  await deleteByKey(loggedInfoKey);
}

export async function getLoggedDb() {
  const data = await getByKeyV2(loggedInfoKey);
  if (data) {
    return data;
  }
  return false;
}

export async function loginService(payload) {
  let response;
  try {
    response = await fetch(
      `${window.mainUrl}index.php/rest/V1/integration/admin/token`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({
          username: payload.payload.username,
          password: payload.payload.password
        })
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
    const response = await fetch(
      `${window.mainUrl}index.php/rest/V1/lof-cashier`,
      {
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
      }
    );
    data = await response.json();
  } catch (e) {
    data = [];
    error = true;
  }
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

export async function setMainUrlKey(payload) {
  const data = {
    key: mainUrlKey,
    url: payload.payload
  };
  const url = await getByKeyV2(mainUrlKey);
  if (url) {
    await updateById(url.id, data);
  } else await createKey(mainUrlKey, data);
  return data.url;
}

export async function getMainUrlKey() {
  const payload = await getByKeyV2(mainUrlKey);
  if (payload) {
    return { status: true, payload };
  }
  return { status: false };
}

export async function getModuleInstalledService(url) {
  let data;
  let error = false;
  try {
    const response = await fetch(
      `${url}index.php/rest/V1/pos/check-all-module-installed`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow',
        referrer: 'no-referrer'
      }
    );
    data = await response.json();
  } catch (e) {
    data = [];
    error = true;
  }
  return { data, error };
}
