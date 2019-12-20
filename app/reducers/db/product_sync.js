import db from './db';

export default function syncProduct(productList) {
  if (productList.length > 0) {
    // Insert to database
    const productTbl = db.table('products');

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
