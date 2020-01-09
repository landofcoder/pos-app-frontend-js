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

export function checkValidateUrlLink(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export function getGraphqlPath() {
  return `${window.mainUrl}graphql`;
}
