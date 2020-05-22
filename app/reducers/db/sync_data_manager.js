import db from './db';
import { initService } from '../../common/sync-group-manager';

const table = 'sync_data_manager';

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
    try {
      await tbl.delete(data.id);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

export async function getAllSyncService() {
  const tbl = db.table(table);
  const data = await tbl.toArray();
  return data;
}

export async function createService(service) {
  const tbl = db.table(table);
  try {
    await tbl.add(service);
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateService(service) {
  const newService = service;
  newService.update_at = Date.now();
  const tbl = db.table(table);
  await tbl.update(newService.id, newService);
}

export async function failedLoadService(service) {
  let serviceData = await getServiceByName(service.name);

  if (serviceData) {
    serviceData.errors = service.errors;
    serviceData.message = service.message;
    await updateService(serviceData);
  } else {
    serviceData = initService(service.name);
    serviceData.errors = service.errors;
    serviceData.message = service.message;
    await createService(serviceData);
  }
}

export async function successLoadService(serviceName) {
  const serviceData = await getServiceByName(serviceName);
  if (serviceData) {
    serviceData.errors = 0;
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
