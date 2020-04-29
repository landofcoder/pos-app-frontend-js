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
  console.log('get service name');
  console.log(name);
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
  console.log('failed load service');
  console.log(service);
  let serviceData = await getServiceByName(service.name);

  if (serviceData) {
    // truong hop sync lai cac service bi loi truoc do phai clear cac loi do truoc
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
  console.log('success load service');
  const serviceData = await getServiceByName(serviceName);
  console.log(serviceData);
  if (serviceData) {
    console.log('update');
    await updateService(serviceData);
  } else {
    console.log('tao');
    await createService(initService(serviceName));
  }
}
