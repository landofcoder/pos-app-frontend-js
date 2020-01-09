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
  if (url.indexOf('.') === -1) return false;
  if (url.lastIndexOf('http')) return false;
  if (url[url.length - 2] === '/') return false;
  if (url.indexOf(" ") !== -1) return false;
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
