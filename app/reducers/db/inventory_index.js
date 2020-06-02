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
