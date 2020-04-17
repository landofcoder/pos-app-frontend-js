import { call } from 'redux-saga/effects';
import {
  counterProduct,
  getProductBySku,
  getProductsByCategoryLocal,
  searchProductsLocal,
  syncProducts
} from '../../reducers/db/products';
import { getCategoriesFromLocal } from '../../reducers/db/categories';
import {
  deleteByKey,
  getAllTblCustomProduct
} from '../../reducers/db/sync_custom_product';
import { defaultPageSize, getOfflineMode } from '../../common/settings';
import {
  QUERY_GET_PRODUCT_BY_CATEGORY,
  QUERY_SEARCH_PRODUCT
} from '../../constants/product-query';
import { updateCurrentPosCommand } from './common-service';
import { apiGatewayPath } from '../../../configs/env/config.main';

/**
 * Search product service
 * @returns array
 */
export function* searchProductService(payload) {
  const { searchValue, currentPage } = payload;
  // Update to current command
  yield updateCurrentPosCommand(
    QUERY_SEARCH_PRODUCT,
    0,
    searchValue,
    currentPage
  );

  return yield searchProductsLocal(searchValue, currentPage);
}

/**
 * Get product by sku for scanner
 * @param payload
 * @returns void
 */
export function* getProductBySkuFromScanner(payload) {
  const offlineMode = yield getOfflineMode();
  const sku = payload;
  if (offlineMode === 1) {
    return yield getProductBySku(sku);
  }
  // Call filter by sku
  const result = yield querySearchProduct(sku, 1);
  if (result && result.length > 0) {
    return result[0];
  }
}

/**
 * Search product
 * @param searchValue
 * @param currentPage
 * @returns void
 */
export async function querySearchProduct(searchValue, currentPage) {
  try {
    // Full text search by product name
    const response = await fetch(`${apiGatewayPath}/graphql/gateway`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `{
                      getQuerySearchProduct(
                      appInfo: {token: "${window.liveToken}", url: "${window.mainUrl}", platform: "${window.platform}" },
                      searchValue: "${searchValue}",
                      currentPage: ${currentPage}
                    )
                }`
      })
    });
    const data = await response.json();
    return JSON.parse(data.data.getQuerySearchProduct);
  } catch (e) {
    return [];
  }
}

/**
 * Get products
 * @returns array
 */
export function* getProductByCategoryService({ categoryId, currentPage = 1 }) {
  // Update to current command
  yield updateCurrentPosCommand(
    QUERY_GET_PRODUCT_BY_CATEGORY,
    categoryId,
    '',
    currentPage
  );
  return yield call(getProductsByCategoryLocal, {
    categoryId,
    currentPage
  });
}

/**
 * @returns array
 */
async function getProductsByCategory(payload) {
  const { categoryId, currentPage } = payload;
  try {
    const response = await fetch(`${apiGatewayPath}/graphql/gateway`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify({
        query: `{
                    getProductsByCategory(
                      appInfo: {token: "${window.liveToken}", url: "${window.mainUrl}", platform: "${window.platform}" },
                      categoryId: ${categoryId},
                      currentPage: ${currentPage}
                    )
                }`
      })
    });
    const data = await response.json();
    const { products } = JSON.parse(data.data.getProductsByCategory);

    return {
      items: products.items,
      totalCount: products.total_count
    };
  } catch (e) {
    return {
      items: []
    };
  }
}

/**
 * Sync all products
 * @param listCategories
 */
export async function writeProductsToLocal(listCategories) {
  const childCategories = listCategories.children_data;

  if (childCategories.length > 0) {
    // eslint-disable-next-line no-restricted-syntax
    for (const cate of childCategories) {
      // Show counter product
      // eslint-disable-next-line no-await-in-loop
      const productQty = await counterProduct();
      console.log('qty:', productQty);
      // Call api to get large products
      // eslint-disable-next-line no-await-in-loop
      await syncAllProductsByCategory(cate.id);

      // Check children and recall this syncAllProducts
      if (cate.children_data.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await writeProductsToLocal(cate);
      }
    }
  }
}

/**
 * Get product with paging by category
 * @param categoryId
 */
async function syncAllProductsByCategory(categoryId) {
  const currentPage = 1;
  // Get products as first page
  const productsResult = await getProductsByCategory({
    categoryId,
    currentPage
  });
  // Let all parents categories of this category
  const defaultCategory = await getCategoriesFromLocal();
  const allParentIds = await findAllParentCategories(
    defaultCategory.children_data,
    categoryId
  );

  // Sync products
  const { totalCount } = productsResult;
  await syncProducts(productsResult.items, allParentIds);
  const page = totalCount / defaultPageSize;

  if (page > 1) {
    // Get by next page, rounding increases
    const numberPage = Math.ceil(page);
    const array = new Array(numberPage).fill(0);

    array.forEach(async (item, index) => {
      // Sync products
      const productsResult = await getProductsByCategory({
        categoryId,
        currentPage: index
      });
      await syncProducts(productsResult.items, allParentIds);
    });
  }
}

// Find parents
export async function findAllParentCategories(
  defaultCategory,
  parentId,
  parentIds = []
) {
  let foundParent = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of defaultCategory) {
    // Đã tìm thấy id cha
    if (item.id === parentId) {
      parentIds.push(item.id);
      foundParent = true;
      const newParentId = item.parent_id;
      // Đã tìm thấy parent, sẽ tìm lại từ đầu dựa trên mảng danh mục từ đầu
      // eslint-disable-next-line no-await-in-loop
      const defaultCategory = await getCategoriesFromLocal();
      // eslint-disable-next-line no-await-in-loop
      await findAllParentCategories(
        defaultCategory.children_data,
        newParentId,
        parentIds
      );
    }

    // Nếu không tìm thấy, tiếp tục tìm trong child_data
    if (foundParent === false) {
      // Next, find it in children_data
      if (item.children_data.length > 0) {
        // eslint-disable-next-line no-await-in-loop
        await findAllParentCategories(item.children_data, parentId, parentIds);
      }
    }
  }

  return parentIds;
}

export async function syncCustomProductAPI(payload) {
  console.log(payload);
}

export async function syncCustomProductService() {
  const data = await getAllTblCustomProduct();
  console.log('sync custom product');
  console.log(data);
  for (let i = 0; i < data.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const status = await syncCustomProductAPI(data[i]);
    if (status) {
      // delete db
      // eslint-disable-next-line no-await-in-loop
      await deleteByKey({ name: data[i].name });
    }
  }
}
