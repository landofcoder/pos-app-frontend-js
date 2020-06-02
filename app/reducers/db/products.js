import _ from 'lodash';
import db from './db';
import { defaultPageSize } from '../../common/settings';
import { injectInventory } from './inventory_index';

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
          // const smallImage = itemRemake.small_image.url;
          // itemRemake.base64Image = await convertImageToBase64(smallImage);
          await productTbl.add(itemRemake);
        }
      }
    });
  }
}

// async function convertImageToBase64(imagePath) {
//   const sharpStream = sharp({
//     failOnError: false
//   });
//
//   const promises = [];
//   promises.push(
//     sharpStream
//       .clone()
//       .resize({ width: 500 })
//       .png()
//       .toBuffer()
//   );
//
//   got.stream(imagePath).pipe(sharpStream);
//
//   return Promise.all(promises)
//     .then(res => {
//       return res.toString('base64');
//     })
//     .catch(err => {
//       console.error("Error processing files, let's clean it up", err);
//     });
// }

export async function counterProduct() {
  // Count products
  const data = await db.table(table).count();
  return data;
}

async function makeCategoriesArraySimple(product) {
  const productAssign = Object.assign({}, product);
  const categoryIds = 'categoryIds';
  // eslint-disable-next-line no-prototype-builtins
  if (!productAssign.hasOwnProperty(categoryIds)) {
    const categoryIds = [];
    productAssign.categories.forEach(item => {
      categoryIds.push(item.id);
    });
    productAssign.categoryIds = categoryIds;
    productAssign.productIds = await getAllVariantsProduct(product);
  }
  return productAssign;
}

async function getAllVariantsProduct(product) {
  const listVariants = product.variants;
  if (listVariants && listVariants.length > 0) {
    const listProductIds = [];
    listVariants.forEach(item => {
      const objProduct = item.product;
      const productId = objProduct.id;
      listProductIds.push(productId);
    });
    return listProductIds;
  }
  return [];
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
  const page = currentPage - 1;
  if (page >= 1) {
    offset = page * defaultPageSize;
  }
  try {
    // Get all products
    if (categoryId === 0) {
      data = await db
        .table(table)
        .offset(offset)
        .limit(defaultPageSize)
        .toArray();
    } else {
      data = await db
        .table(table)
        .where('categoryIds')
        .anyOf(categoryId)
        .offset(offset)
        .limit(defaultPageSize)
        .toArray();
    }
  } catch (e) {
    console.log('error:', e);
    data = [];
  }
  const dataWithInventory = await injectInventory(data);
  return dataWithInventory;
}

export async function getProductsByProductIdLocal(productId) {
  let data;
  try {
    // Search product id from parent object first
    data = await db.table(table).get({ id: Number(productId) });
    // If not found then search in productIds
    if (!data) {
      data = await db
        .table(table)
        .where('productIds')
        .anyOf(Number(productId))
        .offset(0)
        .limit(defaultPageSize)
        .first();
    }
  } catch (e) {
    console.log('error:', e);
  }
  return data;
}

export async function getAllTblProductByPaginate(step, stepAt) {
  const tbl = db.table(table);
  const data = await tbl
    .reverse()
    .offset(stepAt * step)
    .limit(step)
    .toArray();
  return data;
}
