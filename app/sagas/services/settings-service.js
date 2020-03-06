import {
  createKey,
  getByKey,
  getByKeyV2,
  updateById,
  deleteByKeyV2
} from '../../reducers/db/settings';

const syncAllDataLabel = 'sync_all_data';
const systemConfigLabel = 'system_config';
const shopInfoKey = 'shop_info_config';
const cashierInfoLabel = 'cashier_info';
const receiptInfoLabel = 'receipt_info';
const timeSyncConstant = 'time_sync_constant';
const connectedScannerDeviceLabel = 'connected_scanner_device';
const detailOutlet = 'outlet_config';
export async function haveToSyncAllData() {
  const data = await getByKey(syncAllDataLabel);
  return data;
}

export async function createSyncAllDataFlag() {
  // Check exists for create new or update
  const data = await getByKeyV2(syncAllDataLabel);
  if (data) {
    await updateById(data, syncAllDataLabel);
  } else {
    await createKey(syncAllDataLabel);
  }
}

export async function systemConfigSync(systemConfig) {
  const systemConfigInDb = await getByKey(systemConfigLabel);
  if (systemConfigInDb.length === 0) {
    await createKey(systemConfigLabel, systemConfig);
  } else {
    // Update
    const { id } = systemConfigInDb[0];
    await updateById(id, systemConfig);
  }
}

export async function getSystemConfigLocal() {
  const data = await getByKeyV2(systemConfigLabel);
  return data;
}

export async function shopInfoSync(shopInfo) {
  const shopInfoDb = await getByKey(shopInfoKey);
  if (shopInfoDb.length === 0) {
    // Create key
    await createKey(shopInfoKey, shopInfo);
  } else {
    // Update shopInfo
    await updateById(shopInfoDb[0].id, shopInfo);
  }
}

export async function outLetConfigSync(outletInfo) {
  const outletInfoDb = await getByKeyV2(detailOutlet);
  if (outletInfoDb.length === 0) {
    // Create key
    await createKey(detailOutlet, outletInfo);
  } else {
    // Update shopInfo
    await updateById(outletInfoDb[0].id, outletInfo);
  }
}

export async function receiptInfoSync(receipt) {
  const receiptInfo = await getByKeyV2(receiptInfoLabel);
  if (!receiptInfo) {
    // Create new
    await createKey(receiptInfoLabel, receipt);
  } else {
    // Update by key
    await updateById(receiptInfo.id, receipt);
  }
}

export async function getShopInfoLocal() {
  const data = await getByKey(shopInfoKey);
  return data;
}

export async function getDetailOutLetLocal() {
  const data = await getByKey(detailOutlet);
  return data;
}
export async function getReceiptInfoLocal() {
  const data = await getByKeyV2(cashierInfoLabel);
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

export async function getTimeSyncConstant() {
  const timeConstantValue = await getByKey(timeSyncConstant);
  if (timeConstantValue.length === 0) {
    const value = Date.now();
    await createKey(timeSyncConstant, value);
    return value;
  }
  return timeConstantValue[0].value;
}

export async function resetTimeSyncConstant() {
  const timeConstantValue = await getByKey(timeSyncConstant);
  await updateById(timeConstantValue[0].id, Date.now());
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
