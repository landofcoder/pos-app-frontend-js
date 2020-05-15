import db from './db';

const table = 'sync_customers';

export async function signUpCustomerDb(customers) {
  const { payload } = customers;
  const data = {
    id: Date.now(),
    email: payload.customer.email,
    first_name: payload.customer.firstname,
    synced: false,
    payload
  };
  const signUpCustomerTbl = db.table(table);
  const customer = await signUpCustomerTbl.get({
    email: payload.customer.email
  });
  if (!customer || !customer.length()) {
    await signUpCustomerTbl.add(data);
    return true;
  }
  return false;
}

export async function getAllTblCustomer() {
  const tbl = db.table(table);
  const data = await tbl.toArray();
  return data;
}
export async function deleteCustomerById(id) {
  const tbl = db.table(table);
  try {
    await tbl.delete(id);
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateCustomerById(customer) {
  // eslint-disable-next-line no-param-reassign
  customer.udpate_at = Date.now();
  const tbl = db.table(table);
  try {
    await tbl.update(customer.id, customer);
    return true;
  } catch (e) {
    return false;
  }
}
export async function getCustomerByName(name) {
  const productTbl = db.table(table);
  const result = [];
  const resultName = await productTbl.where({ first_name: name }).toArray();
  const resultEmail = await productTbl.where({ email: name }).toArray();
  return result.concat(resultName, resultEmail);
}
