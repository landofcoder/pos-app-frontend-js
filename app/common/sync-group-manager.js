import {
  ALL_PRODUCT_SYNC,
  CUSTOM_PRODUCT_SYNC,
  CUSTOMERS_SYNC,
  GENERAL_CONFIG_SYNC,
  SYNC_ORDER_LIST,
  SYNC_BARCODE_INDEX
} from '../constants/authen.json';

export function serviceTypeGroupManager(serviceName, actionService) {
  // actionService is be object not an array
  return {
    name: serviceName,
    errors: actionService.errors || 1,
    message: actionService.message
  };
}

export function initService(
  serviceName
  // eslint-disable-next-line flowtype/no-primitive-constructor-types
): { name: String, error: Number } {
  return {
    displayName: getDisplayNameForSyncService(serviceName),
    name: serviceName,
    errors: 0,
    message: null,
    update_at: null,
    create_at: Date.now()
  };
}

export function getDisplayNameForSyncService(serviceName) {
  switch (serviceName) {
    case ALL_PRODUCT_SYNC:
      return 'All products sync';
    case CUSTOM_PRODUCT_SYNC:
      return 'Custom products sync';
    case CUSTOMERS_SYNC:
      return 'Customers sync';
    case GENERAL_CONFIG_SYNC:
      return 'General config sync';
    case SYNC_ORDER_LIST:
      return 'All orders sync';
    case SYNC_BARCODE_INDEX:
      return 'Barcode sync';
    default:
      return null;
  }
}

/**
 * check condition check sync aceept
 * @param lastTimeService
 * @param timeCondition
 * @param loadingService
 * @returns {boolean|boolean}
 */
export function conditionForSyncing(
  lastTimeService,
  timeCondition,
  loadingService
) {
  const nowTime = Date.now();
  return nowTime - lastTimeService > timeCondition * 60000 && !loadingService;
}
