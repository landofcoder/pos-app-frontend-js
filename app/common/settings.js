import LocaleCurrency from 'locale-currency';

/**
 * Get offline mode
 * @returns number
 */
export function getOfflineMode() {
  const posSystemConfigResult = window.config;
  return Number(
    posSystemConfigResult.general_configuration.enable_offline_mode
  );
}

export function checkValidateUrlLink(
  defaultProtocol,
  mainUrl,
  lastUrlRequired
) {
  const url = defaultProtocol + mainUrl + lastUrlRequired;
  if (mainUrl.length < 3) return false;
  //if (url.indexOf('.') === -1) return false;
  if (url.lastIndexOf('http')) return false;
  if (url.indexOf(' ') !== -1) return false;
  if (url[url.length - 2] === '.') return false;
  try {
    new URL(url);
  } catch (_) {
    return false;
  }
  return true;
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
  const locale = LocaleCurrency.getLocales(window.currency)[0];
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: window.currency
  });
  return formatter.format(value);
}

/**
 * Default page number per page for product
 * @type {number}
 */
export const defaultPageSize = 20;

export function shippingMethodDefault(methodShipping) {
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
