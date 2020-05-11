import db from './db';

const table = 'barcode_index';

export async function syncBarCodeIndexToLocal(listProductBarCode) {
  if (listProductBarCode.length > 0) {
    const barCodeIndexTbl = db.table(table);
    listProductBarCode.forEach(async item => {
      const barcodeObj = await barCodeIndexTbl.where({ barcode: item.barcode });
      if (!barcodeObj) {
        // Create new
        console.log('create new:', item);
      } else {
        console.log('update barcode');
      }
    });
  }
}
