import db from './db';

const table = 'sync_orders';

export async function getAllOrders() {
  const tbl = db.table(table);
  const data = tbl.toArray();
  return data;
}

export async function createOrders(orders) {
  const tbl = db.table(table);
  const data = await tbl.add(orders);
  return data;
}

export async function deteleAllOrders() {
  const tbl = db.table(table);
  await tbl.clear();
}

export async function deleteOrderById(id) {
  const tbl = db.table(table);
  await tbl.delete(id);
}

export async function getOrderById(id) {
  const tbl = db.table(table);
  let data = [];
  try {
    data = await tbl.where({ id }).toArray();
  } catch (e) {
    console.log('Cannot get order by id');
  }
  return data;
}

export async function updateOrderById(order, notChangeTime) {
  // eslint-disable-next-line no-param-reassign
  if (!notChangeTime) order.update_at = Date.now();
  const tbl = db.table(table);
  await tbl.update(order.id, order);
}
