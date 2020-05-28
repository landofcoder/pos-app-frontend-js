import { put } from 'redux-saga/effects';
import { deleteOrderById } from '../../reducers/db/sync_orders';
import { getAllCategoriesByParentIdFromLocal } from '../../reducers/db/categories';
import { UPDATE_CURRENT_POS_COMMAND } from '../../constants/root';
import { apiGatewayPath } from '../../../configs/env/config.main';

/**
 * Get shop info
 * @returns array
 */
export async function getShopInfoService() {
  let data;
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
    data = await response.json();
  } catch (data) {
    // eslint-disable-next-line no-throw-literal
    throw { message: 'Unable to connect server', data: {} };
  }

  // eslint-disable-next-line camelcase
  const { cashier_info, common_config, currency_code, receipt } = data;

  // du lieu data tra ve bao gom thong tin cashier_info common config, currency code
  // kiem tra du lieu co hop le khong
  if (
    data.message ||
    cashier_info.message ||
    common_config.message ||
    currency_code.message ||
    receipt.message
  ) {
    const message =
      data.message ||
      cashier_info.message ||
      common_config.message ||
      currency_code.message ||
      receipt.message;
    // eslint-disable-next-line no-throw-literal
    throw { message, data };
  }

  return data;
}

export async function getAllCategoriesByParentIdService(payload) {
  const data = await getAllCategoriesByParentIdFromLocal(payload);
  return data;
}

/**
 * Get all categories service
 * @returns void
 */
export async function getAllCategoriesService() {
  let data;
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
    // eslint-disable-next-line no-throw-literal
    throw { message: 'Unable to connect server', data: {} };
  }
  if (data.message) {
    // eslint-disable-next-line no-throw-literal
    throw { message: data.message, data };
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
  await deleteOrderById(index);
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
