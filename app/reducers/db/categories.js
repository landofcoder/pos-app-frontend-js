import db from './db';

const table = 'categories';

/**
 * Sync categories
 * @param mainCategory
 * @returns {Promise<void>}
 */
export async function syncCategories(mainCategory) {
  // Insert to database
  const categoryTbl = db.table(table);
  const category = await categoryTbl.get(mainCategory.id);
  if (category) {
    // Update
    await categoryTbl.update(mainCategory.id, mainCategory);
  } else {
    // Add new
    await categoryTbl.add(mainCategory);
  }
}

export async function getCategories() {
  return await db.table(table).toArray();
}
