import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
const version = 10;
db.version(version).stores({
  products: '++id, *categoryIds',
  categories: '++id',
  customers: '++id',
  sign_up_customers: '++id,*email',
  settings: '++id, *key, created_at, updated_at'
});

export default db;
