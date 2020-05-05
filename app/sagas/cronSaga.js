import { takeEvery } from 'redux-saga/effects';
import { RUN_CRON } from '../constants/root.json';
import {
  getGeneralFromLocal,
  readLoggedDbFromLocal
} from './services/login-service';
import {
  readGeneralConfigHistoryFromLocal,
  writeGeneralConfigHistoryToLocal
} from './services/local-sync-service';
import { setupFetchingGeneralConfig } from './rootSaga';

function* getTimeSyncConfig() {
  // Read sync module config in local
  const generalConfig = yield getGeneralFromLocal();
  return generalConfig.common_config.time_synchronized_for_modules;
}

function* checkingGeneralConfigSync() {
  // eslint-disable-next-line camelcase
  const { general_config_sync } = yield getTimeSyncConfig();
  const generalSyncConfig = yield readGeneralConfigHistoryFromLocal();
  if (generalSyncConfig) {
    console.log('general config sync:', general_config_sync);
  } else {
    // Sync now
    // yield setupFetchingGeneralConfig();
    const resultWrite = yield writeGeneralConfigHistoryToLocal();
    console.log('result write:', resultWrite);
  }
}

function* checkingModuleSync() {
  // If logged
  const loggedDb = yield readLoggedDbFromLocal();
  if (loggedDb) {
    // General config sync checking
    yield checkingGeneralConfigSync();
  }
}

/**
 * Register all cron here
 * @returns void
 */
function* runCronSg() {
  yield checkingModuleSync();
}

function* cronSaga() {
  yield takeEvery(RUN_CRON, runCronSg);
}

export default cronSaga;
