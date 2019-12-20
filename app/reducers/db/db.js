import Dexie from 'dexie';

const db = new Dexie('Lof_Pos');
db.version(3).stores({ products: '++id', categories: '++id', customers: '++id' });

export default db;
