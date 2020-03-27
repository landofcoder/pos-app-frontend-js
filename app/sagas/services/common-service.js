import { put } from 'redux-saga/effects';
import {
  systemConfigSync,
  getSystemConfigLocal,
  shopInfoSync,
  getShopInfoLocal,
  receiptInfoSync,
  getReceiptInfoLocal,
  getDetailOutLetLocal,
  outLetConfigSync
} from './settings-service';
import { getCategories } from '../../reducers/db/categories';
import { deleteOrder } from '../../reducers/db/sync_orders';
import { UPDATE_CURRENT_POS_COMMAND } from '../../constants/root';
import { getOfflineMode } from '../../common/settings';

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
      // `${window.mainUrl}index.php/rest/V1/pos/getSystemConfig`,
      `${window.mainUrl}/users/system-config`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          platform: window.platform,
          'Content-Type': 'application/json',
          Authorization: `Bearer ${window.liveToken}`
        },
        redirect: 'follow',
        referrer: 'no-referrer'
      }
    );
    data = await response.json();
  } catch (e) {
    getError = true;
  }

  console.log('config error:', getError);

  // Check data result is ok, then save to local db
  if (getError) {
    // Query to local
    data = await getSystemConfigLocal();
    data = data.value;
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
      `${window.mainUrl}index.php/rest/V1/pos/getShopInfo`,
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
 * @returns array
 */
export async function getCustomReceiptService(outletId) {
  let data;
  let error = false;
  try {
    const response = await fetch(
      `${window.mainUrl}index.php/rest/V1/lof-posreceipt/pos/${outletId}`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          platform: window.platform,
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
    const data = await getReceiptInfoLocal();
    return data.value;
  }
  // Sync now
  await receiptInfoSync(data);

  return data;
}

/**
 * Get detail outlet
 * @param payload
 * @returns object
 */
export async function getDetailOutletService(payload) {
  const outletId = payload;
  let data = [];
  let error = false;
  try {
    const response = await fetch(
      `${window.mainUrl}index.php/rest/V1/lof-outlet/get-detail-outlet?id=${outletId}`,
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
    data = await getDetailOutLetLocal();
    if (data.length > 0) {
      data = data[0].value;
    }
  } else {
    console.log(data);
    await outLetConfigSync(data);
  }
  return data;
}

/**
 * Get all categories service
 * @returns void
 */
export async function getAllCategoriesService() {
  let data;
  let error = false;
  let response = {};
  try {
    response = await fetch(`${window.mainUrl}index.php/rest/V1/categories`, {
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
    });
    data = await response.json();
  } catch (e) {
    data = [];
    error = true;
  }
  if (error || response.status === 401) {
    if (getOfflineMode() === 1) {
      // Get from local
      data = await getCategories();
      // eslint-disable-next-line prefer-destructuring
      data = data[0];
    }
  }
  return data;
}

/**
 * Get order history service
 * @returns void
 */
export async function getOrderHistoryService() {
  try {
    const response = await fetch(
      `${window.mainUrl}/rest/V1/pos/order_history/search?searchCriteria[sortOrders][0][field]=pos_order_id`,
      {
        method: 'GET',
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
    const data = await response.json();
    return data;
  } catch (e) {
    return { items: [] };
  }
}

export async function getOrderHistoryServiceDetails(index) {
  const response = await fetch(`${window.mainUrl}rest/V1/orders/${index}`, {
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
  });
  const data = await response.json();
  return data;
}

export async function cancelOrderService(index) {
  await deleteOrder(index);
}

/**
 * Update current pos command
 * @param type
 * @param categoryId
 * @param searchValue
 * @param currentPage
 * @returns void
 */
export function* updateCurrentPosCommand(
  type = '',
  categoryId = 0,
  searchValue = '',
  currentPage = 0
) {
  yield put({
    type: UPDATE_CURRENT_POS_COMMAND,
    payload: { type, categoryId, searchValue, currentPage }
  });
}
