import { format } from 'date-fns';
import {
  getByKeyV2,
  createKey,
  updateById,
  deleteByKey
} from '../../reducers/db/settings';
import { apiGatewayPath } from '../../../configs/env/config.main';

const loggedInfoKey = 'logged_info';
const mainUrlKey = 'main_url';
const appInfoKey = 'app_info';
const generalConfigKey = 'general_config';

export async function writeLoggedInfoToLocal(payload) {
  const payloadAssign = payload;
  // Write as last time update
  payloadAssign.last_time = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
  const loggedDb = await getByKeyV2(loggedInfoKey);
  if (loggedDb) {
    await updateById(loggedDb.id, payloadAssign);
  } else {
    await createKey(loggedInfoKey, payloadAssign);
  }
}

export async function deleteLoggedDb() {
  await deleteByKey(loggedInfoKey);
}

export async function readLoggedDbFromLocal() {
  const data = await getByKeyV2(loggedInfoKey);
  if (data) {
    return data.value;
  }
  return false;
}

export async function writeGeneralConfigToLocal(payload) {
  const result = await getByKeyV2(generalConfigKey);
  if (result) {
    await updateById(result.id, payload);
  } else {
    await createKey(generalConfigKey, payload);
  }
}

export async function getGeneralFromLocal() {
  const data = await getByKeyV2(generalConfigKey);
  if (data) {
    return data.value;
  }
  return null;
}

export async function writeAppInfoToLocal(payload) {
  const result = await getByKeyV2(appInfoKey);
  if (result) {
    await updateById(result.id, payload);
  } else {
    await createKey(appInfoKey, payload);
  }
}

export async function getAppInfoFromLocal() {
  const data = await getByKeyV2(appInfoKey);
  if (data) {
    return data.value;
  }
  return false;
}

export async function loginService(payload) {
  try {
    const response = await fetch(`${apiGatewayPath}/cashier/login`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        platform: `${window.platform}`,
        url: window.mainUrl
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify({
        username: payload.payload.username,
        password: payload.payload.password
      })
    });
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
  return null;
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

/**
 * Get module installed
 * @returns void
 */
export async function getModuleInstalledService(urlCheck) {
  let data;
  let error = false;
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/get-all-module-installed`,
      {
        method: 'GET',
        headers: {
          platform: 'magento2',
          destination_url: urlCheck
        }
      }
    );
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

export async function getAppInfoService(payload) {
  let response;
  try {
    response = await fetch(`${apiGatewayPath}/graphql/gateway`, {
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
        query: `{
          getApp(token: "${payload}") {
            _id,
            platform,
            destination_url,
            product_image_base_url,
            token
          }
        }`
      })
    });
    return response.json();
  } catch (e) {
    return { data: { getApp: null } };
  }
}
