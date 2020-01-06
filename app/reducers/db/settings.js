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

export async function setMainUrlKey(payload) {
  const data = {
    key: 'main_url',
    url: payload.payload
  };
  const settingsTbl = db.table(table);
  const url = await settingsTbl.get({ key: 'main_url' });
  if (url) {
    await settingsTbl.update(url.id, data);
  } else await settingsTbl.add(data);
  return data.url;
}

export async function getMainUrlKey() {
  const settingsTbl = db.table(table);
  const payload = await settingsTbl.get({ key: 'main_url' });
  if (payload) {
    return { status: true, payload };
  }
  return { status: false };
}
