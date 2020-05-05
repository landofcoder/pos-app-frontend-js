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

export async function deleteOrder(id) {
  const tbl = db.table(table);
  await tbl.delete(id);
}

export async function getOrderById(id) {
  const tbl =  db.table(table);
  const result = await tbl.where({ id }).toArray();
  if (result) {
    console.log(result);
    return result[0];
  }
  return null;
}

export async function updateOrder(order) {
  console.log('update order');
  console.log(order);
  const updateOrder = order;
  updateOrder.update_at = new Date();
  const tbl = db.table(table);
  await tbl.update(order.id, updateOrder);
}
