import db from './db';

export async function signUpCustomer(customers) {
  let checkExist = false;
  const signUpCustomerTbl = db.table('signUpCustomers');
  console.log('adding');
  await signUpCustomerTbl.add(customers);
  await customers.forEach(async item => {
    const customer = await signUpCustomerTbl.get(item.username);
    // Check exists
    if (customers.username === customer) {
      checkExist = true;
    }
  });
  if (!checkExist) {
    console.log('adding');
    await signUpCustomerTbl.add(customers);
  }
}
