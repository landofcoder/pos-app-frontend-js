import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
const version = 9;
db.version(version).stores({
  products: '++id, *categoryIds',
  categories: '++id',
  customers: '++id',
  signUpCustomers: '++id',
  settings: '++id, *key, created_at, updated_at'
});

export default db;
