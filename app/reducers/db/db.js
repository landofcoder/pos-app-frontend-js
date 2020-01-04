import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
const version = 10;
db.version(version).stores({
  products: '++id, *categoryIds',
  categories: '++id',
  customers: '++id',
  signUpCustomers: '++id,*username',
  settings: '++id, *key, created_at, updated_at'
});

export default db;
