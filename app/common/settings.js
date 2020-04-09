import LocaleCurrency from 'locale-currency';

/**
 * Get offline mode
 * @returns number
 */
export function getOfflineMode() {
  // const posSystemConfigResult = window.config;
  // return Number(
  //   posSystemConfigResult.general_configuration.enable_offline_mode
  // );
  return 1;
}

export function getGraphqlPath() {
  return `${window.mainUrl}graphql`;
}

/**
 * Limit loop using requestAnimationFrame if timeOut have param, interval will by timeOut config
 * @param fn
 * @param fps : number = 30 fps
 * @param timeOut
 */
export function limitLoop(fn, fps = 30, timeOut = null) {
  // Use var then = Date.now(); if you
  // don't care about targeting < IE9
  let then = new Date().getTime();
  const interval = timeOut || 1000 / fps;

  return (function loop() {
    window.requestAnimationFrame(loop);
    // again, Date.now() if it's available
    const now = new Date().getTime();
    const delta = now - then;
    if (delta > interval) {
      // Update time
      // now - (delta % interval) is an improvement over just
      // using then = now, which can end up lowering overall fps
      then = now - (delta % interval);
      // call the fn
      fn();
    }
  })(0);
}

export function formatCurrencyCode(value: number) {
  // if (Number.isNaN(+value)) return value;
  // const locale = LocaleCurrency.getLocales(window.currency)[0];
  // const formatter = new Intl.NumberFormat(locale, {
  //   style: 'currency',
  //   currency: window.currency
  // });
  // return formatter.format(value);
  return value;
}

/**
 * Default page number per page for product
 * @type {number}
 */
export const defaultPageSize = 20;

export function getShippingMethodCode(methodShipping) {
  console.log(methodShipping);
  switch (methodShipping) {
    case 'flatrate':
      return 'flatrate_flatrate';
    case 'freeshipping':
      return 'freeshipping_freeshipping';
    default:
      return methodShipping;
  }
}

/**
 * Keeping token when logged, not token to get appInfo
 */
export function setTokenGlobal(token) {
  window.liveToken = token;
}

export function setAppInfoToGlobal(payload) {
  window.mainUrl = payload.destination_url;
  window.platform = payload.platform;
}
