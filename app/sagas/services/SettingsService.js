import { getByKey, createKey, updateById } from '../../reducers/db/settings';

const syncAllDataLabel = 'sync_all_data';

export async function haveToSyncAllData() {
  return await getByKey(syncAllDataLabel);
}

export async function createSyncAllDataFlag() {
  await createKey(syncAllDataLabel, { time: Date.now(), timeFormat: new Date() });
}

export async function updateSyncAllDataFlag(id) {
  await updateById(id, { time: Date.now(), timeFormat: new Date() });
}
