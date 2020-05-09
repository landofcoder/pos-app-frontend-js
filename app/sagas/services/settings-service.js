import {
  createKey,
  getByKey,
  getByKeyV2,
  updateById,
  deleteByKeyV2
} from '../../reducers/db/settings';

const shopInfoKey = 'shop_info_config';
const cashierInfoLabel = 'cashier_info';
const connectedScannerDeviceLabel = 'connected_scanner_device';
const generalConfig = 'general_config';

export async function writeShopInfoToLocal(shopInfo) {
  const shopInfoDb = await getByKey(shopInfoKey);
  if (shopInfoDb.length === 0) {
    // Create key
    await createKey(shopInfoKey, shopInfo);
  } else {
    // Update shopInfo
    await updateById(shopInfoDb[0].id, shopInfo);
  }
}

export async function getShopInfoLocal() {
  const data = await getByKey(shopInfoKey);
  return data;
}

/**
 * Sync cashier info
 * @param data
 * @returns void
 */
export async function cashierInfoSync(data) {
  const cashierInfo = await getByKey(cashierInfoLabel);
  if (cashierInfo.length === 0) {
    // Create new
    await createKey(cashierInfoLabel, data);
  } else {
    // Update
    await updateById(cashierInfo[0].id, data);
  }
  return data;
}

export async function getCashierInfoLocal() {
  const cashierInfo = await getByKey(cashierInfoLabel);
  return cashierInfo;
}

export async function createConnectedDeviceSettings(payload) {
  const connectedDevice = await getByKeyV2(connectedScannerDeviceLabel);
  if (!connectedDevice) {
    // Create new
    await createKey(connectedScannerDeviceLabel, payload);
  } else {
    // Update
    // Update by key
    await updateById(connectedDevice.id, payload);
  }
}

export async function getConnectedDeviceSettings() {
  const data = await getByKeyV2(connectedScannerDeviceLabel);
  return data ? data.value : '';
}

export async function removeScannerDeviceConnected() {
  await deleteByKeyV2(connectedScannerDeviceLabel);
}

export async function getGeneralConfigFromLocal() {
  return getByKey(generalConfig);
}
