export function serviceTypeGroupManager(serviceName, actionService) {
  return {
    name: serviceName,
    errors: 1,
    actionErrors: actionService
  };
}
