import { cashierInfoSync, getCashierInfoLocal } from './settings-service';
import {
  getByKeyV2,
  createKey,
  updateById,
  deleteByKey
} from '../../reducers/db/settings';
import { apiGatewayPath } from '../../../configs/env/config.main';

const loggedInfoKey = 'logged_info';
const mainUrlKey = 'main_url';
const platformKey = 'platform';

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
    response = await fetch(`${apiGatewayPath}/users/cashier-login`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        platform: 'magento'
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify({
        username: payload.payload.username,
        password: payload.payload.password
      })
    });
  } catch (e) {
    response = '';
  }

  if (!(response.status === 200 || response.status === 201)) {
    return '';
  }

  if (response.ok) {
    const data = await response.json();
    return data;
  }
  return 'error';
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
    const { status } = response;
    if (status === 401) {
      error = true;
    } else {
      data = await response.json();
    }
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
    console.log('update');
    await updateById(url.id, data);
  } else {
    console.log('create by key');
    await createKey(mainUrlKey, data);
  }
  return data.url;
}

export async function getMainUrlKey() {
  const payload = await getByKeyV2(mainUrlKey);
  if (payload) {
    return { status: true, payload };
  }
  return { status: false };
}

export async function setPlatformKey(payload) {
  const data = {
    key: platformKey,
    value: payload
  };
  const platform = await getByKeyV2(platformKey);
  if (platform) {
    console.log('update');
    await updateById(platform.id, data);
  } else {
    console.log('create by key');
    await createKey(platformKey, data);
  }
  return platform;
}

export async function getPlatformKey() {
  const payload = await getByKeyV2(platformKey);
  if (payload) {
    return { status: true, payload };
  }
  return { status: false };
}

/**
 * Get module installed
 * @returns void
 */
export async function getModuleInstalledService(urlCheck) {
  let data;
  let error = false;
  try {
    const response = await fetch(`${urlCheck}/users/get-all-module-installed`, {
      method: 'GET',
      headers: {
        platform: 'magento'
      }
    });
    data = await response.json();
    if (data.length === 0) {
      data = [
        {
          'module-all': false,
          'module-pos': false
        }
      ];
    }
  } catch (e) {
    data = {};
    error = true;
  }
  return { data, error };
}

export async function workPlaceService(payload) {
  let response;
  try {
    response = await fetch(`${apiGatewayPath}/graphql/graphql`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        platform: 'magento'
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify({
        query: `{
          appsConnected(token: "${payload}") {
            _id,
            platform,
            destinationUrl
          }
        }`
      })
    });
    const data = response.json();
    return data;
  } catch (e) {
    return { data: { appConnected: null } };
  }
}
