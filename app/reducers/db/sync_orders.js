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
