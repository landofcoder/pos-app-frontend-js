import db from './db';

const table = 'sync_customers';

export async function signUpCustomerDb(customers) {
  const id = Date.now();
  const { payload } = customers;
  payload.customer.id = id;
  const data = {
    id,
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

/**
 * use update customer id for sync
 * @param {*} customer
 */
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

/**
 * use for sync to become real customer in server
 * @param {*} customer
 * @param {*} newCustomerId
 */
export async function replaceCustomerById(customer, newCustomerId) {
  const { id } = customer;
  const customerCopy = customer;
  if (newCustomerId) {
    customerCopy.payload.customer.id = newCustomerId;
  }
  const tbl = db.table(table);
  try {
    console.log('param to update', customerCopy);
    await tbl.update(id, customerCopy);
    return true;
  } catch (e) {
    return false;
  }
}

export async function updateCustomerOrderListById(customer, orderId) {
  // eslint-disable-next-line no-param-reassign
  const tbl = db.table(table);
  try {
    const customerResult = await tbl.get({ id: customer.id });
    if (customerResult) {
      if (!orderId) {
        customerResult.orderList = null;
      } else if (customerResult.orderList) {
        customerResult.orderList.push({ orderId });
      } else {
        customerResult.orderList = [{ orderId }];
      }
      await tbl.update(customer.id, customerResult);
      return true;
    }
    console.log('customer da duoc dong bo');

    return false;
  } catch (e) {
    return false;
  }
}

export async function getCustomerByName(name) {
  const customerTbl = db.table(table);
  const result = [];
  const resultName = await customerTbl.where({ first_name: name }).toArray();
  const resultEmail = await customerTbl.where({ email: name }).toArray();
  return result.concat(resultName, resultEmail);
}

export async function getCustomerById(customerId) {
  const customerTbl = db.table(table);
  return customerTbl.get({ id: customerId });
}
