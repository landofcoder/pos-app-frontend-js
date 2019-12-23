import db from './db';


const productTable = 'products';

export function syncProduct(productList) {
  if (productList.length > 0) {
    // Insert to database
    const productTbl = db.table(productTable);

    productList.forEach(async (item) => {
      // Convert categories to categoryIds first
      const itemRemake = await makeCategoriesArraySimple(item);
      const product = await productTbl.get(itemRemake.id);
      // Check exists
      if (product) {
        // Update
        productTbl.update(itemRemake.id, itemRemake);
      } else {
        // Add new
        productTbl.add(itemRemake);
      }
    });
  }
}

async function makeCategoriesArraySimple(product) {
  const productAssign = Object.assign({}, product);
  const categoryIds = 'categoryIds';
  if (!productAssign.hasOwnProperty(categoryIds)) {
    const categoryIds = [];
    productAssign.categories.forEach(item => {
      categoryIds.push(item.id);
    });
    productAssign.categoryIds = categoryIds;
  }
  return productAssign;
}

/**
 * Get default product without any condition
 * @returns {Promise<Array<any>>}
 */
export async function getDefaultProductLocal() {
  // If use offset(), eg: offer(50) make sure we have more than 50 records or equal
  return await db.table(productTable).limit(50).toArray();
}

export async function getProductsByCategoryLocal(categoryId) {
  return await db.table(productTable).where('categoryIds').anyOf(categoryId).toArray();
}
