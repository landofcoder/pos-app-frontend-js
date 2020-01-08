import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
const version = 12;
db.version(version).stores({
  products: '++id, *categoryIds, *sku, *name',
  categories: '++id',
  customers: '++id',
  sync_customers: '++id,*email',
  sync_orders: '++id',
  settings: '++id, *key, created_at, updated_at'
});

export default db;
