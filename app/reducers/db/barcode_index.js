import { all, call } from 'redux-saga/effects';
import db from './db';

const table = 'barcode_index';

export function* syncBarCodeIndexToLocal(listProductBarCode) {
  if (listProductBarCode.length > 0) {
    const barCodeIndexTbl = db.table(table);
    yield all(
      listProductBarCode.map(item => {
        console.log('item:', item);
        return call(syncBarCodeHandle, { item, barCodeIndexTbl });
      })
    );
  }
}

function* syncBarCodeHandle(payload) {
  const { item } = payload;
  const table = payload.barCodeIndexTbl;
  yield;
  const listItem = yield table.where({ barcode: item.barcode }).first();
  if (listItem) {
    // Update
    console.log('update');
  } else {
    // Create new
    console.log('add new');
  }
}
