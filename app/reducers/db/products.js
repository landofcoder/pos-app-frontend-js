import _ from 'lodash';
import db from './db';

const table = 'products';

/**
 * Sync products to local database
 * @param productList
 * @param allParentIds
 */
export function syncProducts(productList, allParentIds = []) {
  if (productList.length > 0) {
    const productTbl = db.table(table);

    productList.forEach(async item => {
      // Convert categories to categoryIds first
      const itemRemake = await makeCategoriesArraySimple(item);

      // Merged all parentIds to item
      const listDifference = _.difference(allParentIds, itemRemake.categoryIds);

      // Push parentIds with regular categoryIds
      itemRemake.categoryIds = _.concat(itemRemake.categoryIds, listDifference);

      const product = await productTbl.get(itemRemake.id);
      // Check exists
      if (product) {
        // Update with pos_sync_updated_at
        itemRemake.pos_sync_updated_at = new Date();
        await productTbl.update(itemRemake.id, itemRemake);
      } else {
        // Add new
        itemRemake.pos_sync_create_at = new Date();
        await productTbl.add(itemRemake);
      }
    });
  }
}

export async function counterProduct() {
  // Count products
  const data = await db.table(table).count();
  return data;
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
 * @returns array
 */
export async function getDefaultProductLocal() {
  // If use offset(), eg: offer(50) make sure we have more than 50 records or equal
  let data;
  try {
    data = await db
      .table(table)
      .limit(50)
      .toArray();
  } catch (e) {
    data = [];
  }
  return data;
}

/**
 * Search product by sku or by name
 * @param payload
 * @returns array
 */
export async function searchProductsLocal(payload) {
  const searchValue = payload.payload;
  try {
    const data = await db
      .table(table)
      .filter(x => {
        const isMatchSku = new RegExp(searchValue.toLowerCase()).test(
          x.sku.toLowerCase()
        );
        if (!isMatchSku) {
          return new RegExp(searchValue).test(x.name.toLowerCase());
        }
        return isMatchSku;
      })
      .limit(20)
      .toArray();
    return data;
  } catch (e) {
    return [];
  }
}

export async function getProductsByCategoryLocal(categoryId) {
  let data;
  try {
    data = await db
      .table(table)
      .where('categoryIds')
      .anyOf(categoryId)
      .toArray();
  } catch (e) {
    data = [];
  }
  return data;
}
