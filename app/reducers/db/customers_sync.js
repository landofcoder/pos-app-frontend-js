import db from './db';

export default function syncCustomers(customers) {
  if (customers.length > 0) {
    // Insert to database
    const customerTbl = db.table('customers');

    customers.forEach(async (item) => {
      const product = await customerTbl.get(item.id);
      // Check exists
      if (product) {
        // Update
        customerTbl.update(item.id, item);
      } else {
        // Add new
        customerTbl.add(item);
      }
    });
  }
}
