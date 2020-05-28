import { all, call } from 'redux-saga/effects';
import { format } from 'date-fns';
import db from './db';

const table = 'barcode_index';
const barCodeIndexTbl = db.table(table);

export function* syncBarCodeIndexToLocal(listProductBarCode) {
  yield all(
    Object.keys(listProductBarCode).map(key =>
      call(syncBarCodeHandle, listProductBarCode[key])
    )
  );
}

function* syncBarCodeHandle(item) {
  const itemAssign = Object.assign({}, item);
  const existsItem = yield barCodeIndexTbl.get({ barcode: item.barcode });
  if (existsItem) {
    // Update
    itemAssign.updated_at = format(new Date(), 'yyyy-MM-dd hh:m:s');
    yield barCodeIndexTbl.update({ id: existsItem.id }, itemAssign);
  } else {
    // Create new
    itemAssign.created_at = format(new Date(), 'yyyy-MM-dd hh:m:s');
    yield barCodeIndexTbl.add(itemAssign);
  }
}

export async function getProductByBarcode(barcode) {
  const result = await barCodeIndexTbl.get({ barcode });
  return result;
}
