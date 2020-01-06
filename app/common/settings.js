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
