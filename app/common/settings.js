import LocaleCurrency from 'locale-currency';

export function getGraphqlPath() {
  return `${window.mainUrl}graphql`;
}

/**
 * Limit loop using requestAnimationFrame if timeOut have param, interval will by timeOut config
 * @param fn
 * @param delay mini second unit
 */
export function startLoop(fn, delay = null) {
  const requestAnimFrame = (() => {
    return (
      window.requestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();
  let start = new Date().getTime();
  const handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    const current = new Date().getTime();
    const delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
}

export function stopLoop(frameId) {
  try {
    window.cancelAnimationFrame(frameId.value);
  } catch (e) {
    console.log(e);
  }
}

export function formatCurrencyCode(value: number) {
  if (Number.isNaN(+value)) return value;
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

export function getShippingMethodCode(methodShipping) {
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
