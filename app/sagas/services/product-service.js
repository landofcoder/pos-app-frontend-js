import { call } from 'redux-saga/effects';
import {
  counterProduct,
  getProductsByCategoryLocal,
  searchProductsLocal,
  syncProducts,
  getProductsByProductIdLocal,
  getAllTblProductByPaginate
} from '../../reducers/db/products';
import { getRootCategoriesFromLocal } from '../../reducers/db/categories';
import {
  syncBarCodeIndexToLocal,
  getProductByBarcode
} from '../../reducers/db/barcode_index';
import { syncProductInventoryToLocal } from '../../reducers/db/inventory_index';
import { defaultPageSize } from '../../common/settings';
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
export function* getProductByBarcodeFromScanner(payload) {
  const barcode = payload;
  const productResult = yield getProductByBarcode(barcode);
  // Get product by id
  if (productResult) {
    const { qty } = productResult;
    const productId = productResult.product_id;
    const product = yield getProductsByProductIdLocal(productId);
    return {
      product,
      qty
    };
  }
  // Show error not found product by barcode
  console.error('not fond product by barcode');
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
    // thong bao loi khi sync product khong the lay duoc product
    // eslint-disable-next-line no-throw-literal
    throw { message: e.message || 'Products cannot get from server', data: {} };
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
  const defaultCategory = await getRootCategoriesFromLocal();
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
      const defaultCategory = await getRootCategoriesFromLocal();
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

export async function getAllProductFromLocal(step, stepAt) {
  return getAllTblProductByPaginate(step, stepAt);
}

export async function syncCustomProductAPI(payload) {
  try {
    const response = await fetch(
      `${apiGatewayPath}/product/create-custom-product`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          platform: `${window.platform}`,
          url: window.mainUrl,
          token: window.liveToken
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({ payload })
      }
    );
    const data = await response.json();
    if (data.message || data.errors) {
      // eslint-disable-next-line no-throw-literal
      throw { message: data.message, data: {} };
    }
    return {
      status: true
    };
  } catch (e) {
    // eslint-disable-next-line no-throw-literal
    throw { message: e.message || 'Unable to connect server', data: e.data };
  }
}

export function* fetchingAndWriteProductBarCodeInventory() {
  const currentPage = 1;
  const productBarCode = yield getProductBarCodeInventoryByPage(
    currentPage,
    false
  );

  // eslint-disable-next-line no-unused-vars,camelcase
  if (productBarCode) {
    // eslint-disable-next-line camelcase
    const { total_page, list } = productBarCode;
    // Sync product barcode inventory
    yield syncBarCodeIndexToLocal(list);
    // Init page array
    const arrayPageListPaging = new Array(total_page).fill(0);

    // eslint-disable-next-line camelcase
    if (total_page > 1) {
      for (let i = 0; i < arrayPageListPaging.length; i += 1) {
        yield call(fetchingNextPageBarCodeInventory, { index: i + 1 });
      }
    }
  }
}

function* fetchingNextPageBarCodeInventory({ index }) {
  const productBarCode = yield getProductBarCodeInventoryByPage(
    index + 1,
    true
  );
  if (productBarCode) {
    const { list } = productBarCode;
    // Sync product barcode inventory
    yield syncBarCodeIndexToLocal(list);
  }
}

export function* fetchingAndWriteProductInventory() {
  const currentPage = 1;
  const numberOfPage = 100;
  const productInventory = yield getProductInventoryByPage(
    currentPage,
    numberOfPage,
    false
  );

  const inventoryItems = productInventory.items;
  if (inventoryItems) {
    // Sync product inventory to local
    yield syncProductInventoryToLocal(inventoryItems);

    // Init page array
    const totalPage = Math.ceil(productInventory.total_count / numberOfPage);
    const arrayByPageNumber = new Array(totalPage).fill(0);
    if (totalPage > 1) {
      // Sync all pages left
      for (let i = 0; i < arrayByPageNumber.length; i += 1) {
        yield call(fetchingNextPageProductInventory, { index: i + 1 });
      }
    }
  }
}

function* fetchingNextPageProductInventory({ index }) {
  const numberOfPage = 100;
  const productInventory = yield getProductInventoryByPage(
    index + 1,
    numberOfPage,
    true
  );
  if (productInventory) {
    const { items } = productInventory;
    // Sync product barcode inventory
    yield syncProductInventoryToLocal(items);
  }
}

export async function getProductBarCodeInventoryByPage(
  currentPage,
  skipFirstPage = false
) {
  if (skipFirstPage && currentPage === 1) {
    return;
  }
  let data;
  let response = {};
  try {
    response = await fetch(
      `${apiGatewayPath}/product/sync-bar-code/100/${currentPage}`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          url: window.mainUrl,
          platform: window.platform,
          token: window.liveToken
        },
        redirect: 'follow',
        referrer: 'no-referrer'
      }
    );
    data = await response.json();
    if (data.message || data.error) {
      // eslint-disable-next-line no-throw-literal
      throw { message: data.message, data };
    }
    if (data.length > 0) {
      return data[0];
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function getProductInventoryByPage(
  currentPage,
  numberOfPage,
  skipFirstPage = false
) {
  if (skipFirstPage && currentPage === 1) {
    return;
  }
  let response = {};
  try {
    response = await fetch(
      `${apiGatewayPath}/product/sync-inventory/${numberOfPage}/${currentPage}`,
      {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          url: window.mainUrl,
          platform: window.platform,
          token: window.liveToken
        },
        redirect: 'follow',
        referrer: 'no-referrer'
      }
    );
    return await response.json();
  } catch (e) {
    return null;
  }
}
