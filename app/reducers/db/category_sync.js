import db from './db';

/**
 * Sync categories
 * @param mainCategory
 * @returns {Promise<void>}
 */
export default async function syncCategories(mainCategory) {
  // Insert to database
  const categoryTbl = db.table('categories');
  const category = await categoryTbl.get(mainCategory.id);
  if (category) {
    // Update
    categoryTbl.update(mainCategory.id, mainCategory);
  } else {
    // Add new
    categoryTbl.add(mainCategory);
  }
}
