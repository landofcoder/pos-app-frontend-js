import db from './db';

const table = 'sync_data_manager';

// khoi tao sync data
function initService(
  serviceName
  // eslint-disable-next-line flowtype/no-primitive-constructor-types
): { name: String, error: Number, actionErrors: Array } {
  return {
    name: serviceName,
    errors: 0,
    actionErrors: []
  };
}

export async function getServiceByName(name) {
  const productTbl = db.table(table);
  let result = await productTbl.get({ name });
  if (!result) {
    await createService(initService(name));
    result = await productTbl.get({ name });
  }
  return result;
}

export async function deleteByKey(key) {
  const tbl = db.table(table);
  const data = await tbl.get({ key });
  if (data) {
    await tbl.delete(data.id);
  }
}

export async function getAllService() {
  const tbl = db.table(table);
  const data = await tbl.toArray();
  return data;
}

export async function createService(service) {
  const tbl = db.table(table);
  await tbl.add(service);
  return true;
}

export async function updateService(service) {
  const newService = service;
  newService.update_at = new Date();
  const tbl = db.table(table);
  await tbl.update(newService.id, newService);
}

export async function failedLoadService(service) {
  let serviceData = await getServiceByName(service.name);

  if (serviceData) {
    serviceData.errors += service.errors;
    serviceData.actionErrors.push(service.actionErrors);
    await updateService(serviceData);
  } else {
    serviceData = initService(service.name);
    serviceData.errors = service.errors;
    serviceData.actionErrors = service.actionErrors;
    await createService(serviceData);
  }
}

export async function successLoadService(serviceName) {
  const serviceData = await getServiceByName(serviceName);
  if (serviceData) {
    await updateService(serviceData);
  } else {
    await createService(initService(serviceName));
  }
}

export async function getLastUpdateTime(serviceName) {
  const serviceData = await getServiceByName(serviceName);
  if (serviceData) {
    if (serviceData.update_at) return serviceData.update_at;
    return serviceData.create_at;
  }
}
