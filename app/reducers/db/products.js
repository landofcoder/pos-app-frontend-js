import db from './db';

const table = 'products';

export function syncProducts(productList) {
  if (productList.length > 0) {
    // Insert to database
    const productTbl = db.table(table);

    productList.forEach(async item => {
      // Convert categories to categoryIds first
      const itemRemake = await makeCategoriesArraySimple(item);
      const product = await productTbl.get(itemRemake.id);
      // Check exists
      if (product) {
        // Update
        await productTbl.update(itemRemake.id, itemRemake);
      } else {
        // Add new
        await productTbl.add(itemRemake);
      }
    });
  }
}

export async function counterProduct() {
  // Count products
  return await db.table(table).count();
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
  return await db.table(table).limit(50).toArray();
}

export async function getProductsByCategoryLocal(categoryId) {
  return await db.table(table).where('categoryIds').anyOf(categoryId).toArray();
}
