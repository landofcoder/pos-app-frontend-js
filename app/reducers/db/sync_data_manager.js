import db from './db';

const table = 'sync_data_manager';

function initService(serviceName) {
  return {
    type: serviceName,
    error: 0,
    actionErrors: []
  };
}

export async function getByKey(service) {
  const productTbl = db.table(table);
  const result = await productTbl.where({ service }).toArray();
  return result;
}

export async function getServiceByName(name) {
  const productTbl = db.table(table);
  const result = await productTbl.get({ name });
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
  const data = await getByKey(service.name);
  if (data.length === 0) {
    const tbl = db.table(table);
    await tbl.add(service);
    return true;
  }
  return false;
}

export async function updateService(id, service) {
  const newService = service;
  newService.update_at = new Date();

  const tbl = db.table(table);
  await tbl.update(id, newService);
}

export async function successLoadService(serviceName) {
  const serviceData = await getServiceByName(serviceName);
  if (serviceData) {
    updateService(serviceData.id);
  } else {
    createService(initService(serviceName));
  }
}
