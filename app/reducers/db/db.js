import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
const version = 12;
db.version(version).stores({
  products: '++id, *categoryIds, *productIds, *sku, *name',
  categories: '++id',
  customers: '++id',
  sync_customers: '++id,*email,first_name',
  sync_orders: '++id',
  sync_custom_product: '++id, name',
  sync_data_manager: '++id, *name',
  settings: '++id, *key, created_at, updated_at'
});

db.version(14).stores({
  barcode_index: '++id, *product_id, *barcode'
});

db.version(14).stores({
  inventory_index: '++id, *product_id'
});

db.version(15).stores({
  categories: '++id, *parent_id, *level'
});
export default db;
