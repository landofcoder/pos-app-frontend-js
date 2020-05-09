import db from './db';

const table = 'settings';

export async function getByKey(key) {
  const tbl = db.table(table);
  const data = await tbl.where({ key }).toArray();
  return data;
}

export async function getByKeyV2(key) {
  const tbl = db.table(table);
  const data = await tbl.get({ key });
  return data;
}

export async function createKey(key, value) {
  const tbl = db.table(table);
  await tbl.add({ key, value, created_at: Date.now() });
}

export async function updateById(id, value) {
  const tbl = db.table(table);
  await tbl.update(id, { value, update_at: Date.now() });
}
export async function deleteByKey(key) {
  const tbl = db.table(table);
  const data = await tbl.get({ key });
  if (data) {
    await tbl.delete(data.id);
  }
}

export async function updateLoggedToken(payload) {
  const { id } = payload;
  const tbl = db.table(table);
  await tbl.update(id, { value: payload.value, update_at: Date.now() });
}

export async function deleteByKeyV2(key) {
  const tbl = db.table(table);
  await tbl
    .where('key')
    .equals(key)
    .delete();
}
