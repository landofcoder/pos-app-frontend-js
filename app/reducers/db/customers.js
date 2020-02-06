import db from './db';

export function syncCustomers(customers) {
  if (customers.length > 0) {
    // Insert to database
    const customerTbl = db.table('customers');

    customers.forEach(async item => {
      const customer = await customerTbl.get(item.id);
      // Check exists
      if (customer) {
        // Update
        await customerTbl.update(item.id, item);
      } else {
        // Add new
        await customerTbl.add(item);
      }
    });
  }
}
