import db from './db';

const table = 'sync_customers';

export async function signUpCustomer(customers) {
  const { payload } = customers;
  const data = {
    email: payload.customer.email,
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
