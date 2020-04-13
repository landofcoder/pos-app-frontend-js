import { put } from 'redux-saga/effects';
import { getCategoriesFromLocal } from '../../reducers/db/categories';
import { deleteOrder } from '../../reducers/db/sync_orders';
import { UPDATE_CURRENT_POS_COMMAND } from '../../constants/root';
import { getOfflineMode } from '../../common/settings';
import { apiGatewayPath } from '../../../configs/env/config.main';

/**
 * Get shop info
 * @returns array
 */
export async function getShopInfoService() {
  try {
    const response = await fetch(`${apiGatewayPath}/cashier/shop-info`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        token: window.liveToken,
        platform: window.platform,
        url: window.mainUrl
      },
      redirect: 'follow',
      referrer: 'no-referrer'
    });
    return await response.json();
  } catch (e) {
    console.log(e);
  }
  return null;
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
    response = await fetch(`${apiGatewayPath}/category/get-all`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        url: window.mainUrl,
        platform: window.platform,
        token: window.liveToken
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
      data = await getCategoriesFromLocal();
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
