import db from './db';

export async function signUpCustomer(customers) {
  const { payload } = customers;
  const data = {
    username: payload.customer.email,
    payload
  };
  const signUpCustomerTbl = db.table('signUpCustomers');
  console.log(payload.customer.email);
  const customer = await signUpCustomerTbl.get({
    username: payload.customer.email
  });
  if (customer) {
    await signUpCustomerTbl.update(customer.id, data);
  }
  else {
    await signUpCustomerTbl.add(data);
  }
}
