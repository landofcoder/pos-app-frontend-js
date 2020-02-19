import db from './db';

const table = 'sync_custom_product';

export async function getByKey(name) {
  const productTbl = db.table(table);
  const result = await productTbl.where({ name }).toArray();
  return result;
}

export async function deleteByKey(key) {
  const tbl = db.table(table);
  const data = await tbl.get({ key });
  if (data) {
    await tbl.delete(data.id);
  }
}

export async function getAllTbl() {
  const tbl = db.table(table);
  const data = await tbl.toArray();
  return data;
}

export async function createProduct(product) {
  const data = await getByKey(product.name);
  if (data.length === 0) {
    const tbl = db.table(table);
    const data = await tbl.add(product);
    return true;
  }
  return false;
}