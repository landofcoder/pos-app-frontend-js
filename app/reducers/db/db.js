import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
db.version(6).stores({ products: '++id, *categoryIds', categories: '++id', customers: '++id' });

export default db;
