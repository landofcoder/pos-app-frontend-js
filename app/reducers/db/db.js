import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
db.version(8).stores({
  products: '++id, *categoryIds',
  categories: '++id',
  customers: '++id',
  settings: '++id, *key'
});

export default db;
