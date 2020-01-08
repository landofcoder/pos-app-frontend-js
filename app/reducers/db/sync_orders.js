import db from './db';

const table = 'sync_orders';

export async function createOrders(orders) {
  const tbl = db.table(table);
  const data = await tbl.add(orders);
  return data;
}
