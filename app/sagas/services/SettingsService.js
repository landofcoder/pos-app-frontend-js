import { getByKey, createKey, updateById } from '../../reducers/db/settings';

const syncAllDataLabel = 'sync_all_data';
const systemConfigLabel = 'system_config';
const shopInfoKey = 'shop_info_config';

export async function haveToSyncAllData() {
  const data = await getByKey(syncAllDataLabel);
  return data;
}

export async function createSyncAllDataFlag() {
  // Check exists for create new or update
  const data = await getByKey(syncAllDataLabel);
  if (data.length > 0) {
    const config = data[0];
    await updateById(config, syncAllDataLabel);
  } else {
    await createKey(syncAllDataLabel);
  }
}

export async function updateSyncAllDataFlag(id) {
  await updateById(id, { time: Date.now(), timeFormat: new Date() });
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
  const data = await getByKey(systemConfigLabel);
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

export async function getShopInfoLocal() {
  return await getByKey(shopInfoKey);
}
