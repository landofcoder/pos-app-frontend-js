import { baseUrl } from '../../params';
import {
  systemConfigSync,
  getSystemConfigLocal,
  shopInfoSync,
  getShopInfoLocal
} from './SettingsService';
import { getCategories } from '../../reducers/db/categories';

/**
 * Data from systemConfig will always get latest settings from api,
 * if have no internet connect, data from local db will be returned
 * @returns array
 */
export async function getSystemConfigService() {
  let data = null;
  let getError = false;
  try {
    const response = await fetch(
      `${baseUrl}index.php/rest/V1/pos/getSystemConfig`,
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
    data = await response.json();
  } catch (e) {
    getError = true;
  }

  // Check data result is ok, then save to local db
  if (getError) {
    // Query to local
    data = await getSystemConfigLocal();
    data = data[0].value;
  } else {
    // Sync it now
    await systemConfigSync(data);
  }

  return data;
}

/**
 * Get ship info
 * @returns array
 */
export async function getShopInfoService() {
  let data;
  let error = false;
  try {
    const response = await fetch(
      `${baseUrl}index.php/rest/V1/pos/getShopInfo`,
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
    data = await response.json();
  } catch (e) {
    data = [];
    error = true;
  }

  if (error) {
    // Query to local
    data = await getShopInfoLocal();
    if (data.length > 0) {
      data = data[0].value;
    }
  } else {
    // Sync now
    await shopInfoSync(data);
  }
  return data;
}

/**
 * Get custom receipt
 * @returns void
 */
export async function getCustomReceiptService() {
  let data;
  try {
    const response = await fetch(
      `${baseUrl}index.php/rest/V1/lof-posreceipt/pos/${1}`,
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
    data = await response.json();
  } catch (e) {
    data = [];
  }
  return data;
}

export async function getDetailOutletService(payload) {
  const outletId = payload;
  const response = await fetch(
    `${baseUrl}index.php/rest/V1/lof-outlet/get-detail-outlet?id=${outletId}`,
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

/**
 * Get all categories service
 * @returns {Promise<any>}
 */
export async function getAllCategoriesService() {
  let data;
  let error = false;
  let response = {};
  try {
    response = await fetch(`${baseUrl}index.php/rest/V1/categories`, {
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
    });
    data = await response.json();
  } catch (e) {
    data = [];
    error = true;
  }
  if (error || response.status === 401) {
    // Get from local
    data = await getCategories();
    // eslint-disable-next-line prefer-destructuring
    data = data[0];

    console.log('res data categories:', data);
  }
  return data;
}

/**
 * Get order history service
 * @returns void
 */
export async function getOrderHistoryService() {
  const response = await fetch(
    `${baseUrl}/rest/V1/pos/order_history/search?searchCriteria[sortOrders][0][field]=pos_order_id`,
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

export async function getOrderHistoryServiceDetails(index) {
  const response = await fetch(`${baseUrl}rest/V1/orders/${index}`, {
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
  });
  const data = await response.json();
  return data;
}
