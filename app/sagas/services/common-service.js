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
  let data = {};
  try {
    const response = await fetch(
      `${apiGatewayPath}/cashier/customer-checkout/get-list-order-history`,
      {
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
      }
    );
    data = await response.json();
    if (data.message || data.errors) {
      // eslint-disable-next-line no-throw-literal
      throw { message: data.message };
    }
  } catch (e) {
    data = { items: [] };
  }
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
