import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
const version = 11;
db.version(version).stores({
  products: '++id, *categoryIds, *sku, *name',
  categories: '++id',
  customers: '++id',
  sign_up_customers: '++id,*email',
  settings: '++id, *key, created_at, updated_at'
});

export default db;
