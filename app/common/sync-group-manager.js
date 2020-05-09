export function serviceTypeGroupManager(serviceName, actionService) {
  // actionService is be object not an array
  return {
    name: serviceName,
    errors: actionService.errors || 1,
    message: actionService.message
  };
}
