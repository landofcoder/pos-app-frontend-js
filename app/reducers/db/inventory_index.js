import { call } from 'redux-saga/effects';
import { format } from 'date-fns';
import db from './db';

const table = 'inventory_index';
const inventoryIndexTbl = db.table(table);

export function* syncProductInventoryToLocal(listProductInventory) {
  for (let i = 0; i < listProductInventory.length; i += 1) {
    yield call(synProductInventoryHandle, listProductInventory[i]);
  }
}

function* synProductInventoryHandle(item) {
  const itemAssign = Object.assign({}, item);
  const existsItem = yield inventoryIndexTbl.get({ sku: item.sku });
  if (existsItem) {
    // Update
    itemAssign.updated_at = format(new Date(), 'yyyy-MM-dd hh:m:s');
    yield inventoryIndexTbl.update({ id: existsItem.id }, itemAssign);
  } else {
    // Create new
    itemAssign.created_at = format(new Date(), 'yyyy-MM-dd hh:m:s');
    yield inventoryIndexTbl.add(itemAssign);
  }
}

export async function injectInventory(listProduct) {
  const listProductAssign = [...listProduct];
  for (let i = 0; i < listProduct.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const { stock, variants } = await findBySku(listProduct[i]);
    listProductAssign[i].stock = stock;
    listProductAssign[i].variants = variants;
  }
  return listProductAssign;
}

async function findBySku(item) {
  const { variants } = item;
  const newListVariantsToReturn = [];
  const stock = await inventoryIndexTbl.where({ sku: item.sku }).first();
  if (variants && variants.length > 0) {
    const listVariants = [...variants];
    for (let i = 0; i < listVariants.length; i += 1) {
      const singleProduct = listVariants[i].product;
      // eslint-disable-next-line no-await-in-loop
      const variantStock = await inventoryIndexTbl
        .where({ sku: singleProduct.sku })
        .first();
      // Update stock for each variant
      singleProduct.stock = variantStock;
      newListVariantsToReturn.push(singleProduct);
    }
  }
  return {
    stock,
    variants: newListVariantsToReturn
  };
}
