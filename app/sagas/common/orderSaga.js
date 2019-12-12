import { select } from 'redux-saga/effects';

const posSystemConfigRd = state => state.mainRd.posSystemConfig;

/**
 * Get default shipping method
 * @returns {Generator<<"SELECT", SelectEffectDescriptor>, *, ?>}
 */
export function* getDefaultShippingMethod() {
  const posSystemConfig = yield select(posSystemConfigRd);
  const shippingConfig = posSystemConfig.shipping_method;
  return shippingConfig.default_shipping_method;
}

/**
 * Get default payment method
 * @returns {Generator<<"SELECT", SelectEffectDescriptor>, *, ?>}
 */
export function* getDefaultPaymentMethod() {
  const posSystemConfig = yield select(posSystemConfigRd);
  const config = posSystemConfig.payment_for_pos;
  return config.default_payment_method;
}
