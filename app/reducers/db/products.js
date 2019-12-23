import db from './db';


const productTable = 'products';

export function syncProduct(productList) {
  if (productList.length > 0) {
    // Insert to database
    const productTbl = db.table(productTable);

    productList.forEach(async (item) => {
      const product = await productTbl.get(item.id);
      // Check exists
      if (product) {
        // Update
        productTbl.update(item.id, item);
      } else {
        // Add new
        productTbl.add(item);
      }
    });
  }
}

export async function getDefaultProductLocal() {
  return await db.table(productTable).offset(50).toArray();
}
