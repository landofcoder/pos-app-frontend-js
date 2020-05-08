import db from './db';

const table = 'sync_custom_product';

export async function getByName(name) {
  const productTbl = db.table(table);
  const result = await productTbl.where({ name }).toArray();
  return result;
}

export async function deleteByIdCustomProduct(id) {
  const tbl = db.table(table);
  const data = await tbl.get({ id });
  if (data) {
    await tbl.delete(data.id);
  }
}

export async function getAllTblCustomProduct() {
  const tbl = db.table(table);
  const data = await tbl.toArray();
  return data;
}

export async function createProductDb(product) {
  console.log('create product');
  const tbl = db.table(table);
  console.log(product);
  const data = await getByName(product.name);
  if (!data || data.length === 0) {
    const tbl = db.table(table);
    await tbl.add(product);
  }
  else {
    await tbl.update(product.id, product);
  }
}
