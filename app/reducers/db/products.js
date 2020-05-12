import _ from 'lodash';
import db from './db';
import { defaultPageSize } from '../../common/settings';

const table = 'products';

export async function getProductById(id) {
  console.log('product id:', id);
  const productTbl = db.table(table);
  const result = await productTbl.get({ id });
  return result;
}

/**
 * Sync products to local database
 * @param productList
 * @param allParentIds
 */
export function syncProducts(productList, allParentIds = []) {
  if (productList.length > 0) {
    const productTbl = db.table(table);

    productList.forEach(async item => {
      // Check null item
      if (item) {
        // Convert categories to categoryIds first
        const itemRemake = await makeCategoriesArraySimple(item);

        // Merged all parentIds to item
        const listDifference = _.difference(
          allParentIds,
          itemRemake.categoryIds
        );

        // Push parentIds with regular categoryIds
        itemRemake.categoryIds = _.concat(
          itemRemake.categoryIds,
          listDifference
        );

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

export async function getProductBySkuLocal(payload) {
  console.log(payload);
  const data = await db.table(table).where({ sku: payload });
  return data.toArray();
}

/**
 * Search product by sku or by name
 * @param payload
 * @param currentPage
 * @returns array
 */
export async function searchProductsLocal(payload, currentPage = 1) {
  const searchValue = payload;
  let offset = 0;
  // If current page == 0 offer must be 0: eg 0 -> 20(defaultPageSize)
  if (currentPage > 1) {
    offset = currentPage * defaultPageSize;
  }
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
      .offset(offset)
      .limit(defaultPageSize)
      .toArray();
    return data;
  } catch (e) {
    return [];
  }
}

export async function getProductsByCategoryLocal({ categoryId, currentPage }) {
  let data;
  let offset = 0;
  if (currentPage > 1) {
    offset = currentPage * defaultPageSize;
  }
  try {
    data = await db
      .table(table)
      .where('categoryIds')
      .anyOf(categoryId)
      .offset(offset)
      .limit(defaultPageSize)
      .toArray();
  } catch (e) {
    console.log('error:', e);
    data = [];
  }
  return data;
}
