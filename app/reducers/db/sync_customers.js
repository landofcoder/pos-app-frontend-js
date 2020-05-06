import db from './db';

const table = 'sync_customers';

export async function signUpCustomerDb(customers) {
  const { payload } = customers;
  const data = {
    email: payload.customer.email,
    first_name: payload.customer.firstname,
    synced: false,
    payload
  };
  const signUpCustomerTbl = db.table(table);
  const customer = await signUpCustomerTbl.get({
    email: payload.customer.email
  });
  if (customer) {
    await signUpCustomerTbl.update(customer.id, data);
  } else {
    await signUpCustomerTbl.add(data);
  }
}

export async function getAllTbl() {
  const tbl = db.table(table);
  const data = await tbl.toArray();
  return data;
}

export async function deleteByKey(key) {
  const tbl = db.table(table);
  const data = await tbl.get(key);
  if (data) {
    await tbl.delete(data.id);
  }
}

export async function getByKey(name) {
  const productTbl = db.table(table);
  const result = [];
  const resultName = await productTbl.where({ first_name: name }).toArray();
  const resultEmail = await productTbl.where({ email: name }).toArray();
  return result.concat(resultName, resultEmail);
}
