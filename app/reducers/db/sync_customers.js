import db from './db';

export async function signUpCustomer(customers) {
  const { payload } = customers;
  const data = {
    email: payload.customer.email,
    payload
  };
  const signUpCustomerTbl = db.table('sync_customers');
  const customer = await signUpCustomerTbl.get({
    email: payload.customer.email
  });
  if (customer) {
    await signUpCustomerTbl.update(customer.id, data);
  } else {
    await signUpCustomerTbl.add(data);
  }
}
