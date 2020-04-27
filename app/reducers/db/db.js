import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
const version = 12;
db.version(version).stores({
  products: '++id, *categoryIds, *sku, *name',
  categories: '++id',
  customers: '++id',
  sync_customers: '++id,*email,*first_name',
  sync_orders: '++id',
  sync_custom_product: '++id, *name',
  sync_data_manager: '++id, name',
  settings: '++id, *key, created_at, updated_at'
});

export default db;
