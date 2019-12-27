import { getByKey, createKey, updateById } from '../../reducers/db/settings';

const syncAllDataLabel = 'sync_all_data';
const systemConfigLabel = 'system_config';

export async function haveToSyncAllData() {
  return await getByKey(syncAllDataLabel);
}

export async function createSyncAllDataFlag() {
  await createKey(syncAllDataLabel, { time: Date.now(), timeFormat: new Date() });
}

export async function updateSyncAllDataFlag(id) {
  await updateById(id, { time: Date.now(), timeFormat: new Date() });
}

export async function systemConfigSync(systemConfig) {
  const systemConfigInDb = await getByKey(systemConfigLabel);
  if(systemConfigInDb.length === 0) {
    await createKey(systemConfigLabel, systemConfig);
  } else {
    // Update
    const id = systemConfigInDb[0].id;
    const value = systemConfigInDb[0].value;
    await updateById(id, value);
  }
}

export async function getSystemConfigLocal() {
  return await getByKey(systemConfigLabel);
}
