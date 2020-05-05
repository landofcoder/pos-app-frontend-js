import { getByKeyV2, writeToLocal } from '../../reducers/db/local_sync_history';

const generalConfigSync = 'general_config_sync';

export async function readGeneralConfigHistoryFromLocal() {
  const result = await getByKeyV2(generalConfigSync);
  return result;
}

export async function writeGeneralConfigHistoryToLocal() {
  const result = await writeToLocal(generalConfigSync);
  return result;
}
