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

export async function getAllTblCustomProductByPaginate(step, stepAt) {
  const tbl = db.table(table);
  const data = await tbl
    .reverse()
    .offset(stepAt * step)
    .limit(step)
    .toArray();
  return data;
}

export async function createProductDb(product) {
  console.log('create product');
  const tbl = db.table(table);
  console.log(product);
  const data = await getCustomProductById(product.id);
  if (!data || data.length === 0) {
    const tbl = db.table(table);
    await tbl.add(product);
  } else {
    await tbl.update(product.id, product);
  }
}
export async function updateCustomProductById(customProduct) {
  // eslint-disable-next-line no-param-reassign
  customProduct.update_at = Date.now();
  const tbl = db.table(table);
  try {
    await tbl.update(customProduct.id, customProduct);
    return true;
  } catch (e) {
    return false;
  }
}
export async function getCustomProductById(customProductId) {
  // eslint-disable-next-line no-param-reassign
  const tbl = db.table(table);
  let data = [];
  try {
    data = await tbl.where({ id: customProductId }).toArray();
    return data;
  } catch (e) {
    console.log('get product by id error');
    return data;
  }
}
