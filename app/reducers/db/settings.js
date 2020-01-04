import db from './db';

const table = 'settings';

export async function getByKey(key) {
  const tbl = db.table(table);
  return await tbl.where({ key }).toArray();
}

export async function createKey(key, value) {
  const tbl = db.table(table);
  await tbl.add({ key, value, created_at: new Date() });
}

export async function updateById(id, value) {
  const tbl = db.table(table);
  await tbl.update(id, { value, update_at: new Date() });
}
