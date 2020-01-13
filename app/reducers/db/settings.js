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
  await tbl.add({ key, value, created_at: new Date() });
}

export async function updateById(id, value) {
  const tbl = db.table(table);
  await tbl.update(id, { value, update_at: new Date() });
}

export async function deleteByKey(key){
  const tbl = db.table(table);
  const data = await tbl.get({ key });
  if(data){
    console.log(data);
    await tbl.delete(data.id);
  }
}
