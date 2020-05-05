import { format } from 'date-fns';
import db from './db';

const table = 'module_sync_history';

export async function getByKeyV2(key) {
  const tbl = db.table(table);
  try {
    const data = await tbl.get({ key });
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function writeToLocal(key) {
  // Insert to database
  let result = null;
  let statusResult;

  const tbl = db.table(table);
  console.log('find by key:', key);
  try {
    result = await tbl.get({ key });
  } catch (e) {
    console.log(e);
  }

  console.log('result:', result);

  if (result) {
    // Update
    // const obj = { lastTimeSync: format(new Date(), 'yyyy-MM-dd hh:m:s') };
    // statusResult = await tbl.update(result.id, obj);
  } else {
    // Add new
    // const obj = { key, lastTimeSync: format(new Date(), 'yyyy-MM-dd hh:m:s') };
    // statusResult = await tbl.add(obj);
  }
  return statusResult;
}
