import { all, call } from 'redux-saga/effects';
import { format } from 'date-fns';
import db from './db';

const table = 'barcode_index';
const barCodeIndexTbl = db.table(table);

export function* syncBarCodeIndexToLocal(listProductBarCode) {
  if (listProductBarCode.length > 0) {
    yield all(
      listProductBarCode.map(item => {
        return call(syncBarCodeHandle, { item });
      })
    );
  }
}

function* syncBarCodeHandle(payload) {
  const { item } = payload;
  const existsItem = yield barCodeIndexTbl
    .where({ barcode: item.barcode })
    .first();
  if (existsItem) {
    // Update
    item.updated_at = format(new Date(), 'yyyy-MM-dd hh:m:s');
    yield barCodeIndexTbl.update(existsItem, item);
  } else {
    // Create new
    item.created_at = format(new Date(), 'yyyy-MM-dd hh:m:s');
    yield barCodeIndexTbl.add(item);
  }
}
