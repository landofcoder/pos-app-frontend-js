import db from './db';

const table = 'categories';

/**
 * Sync categories
 * @param mainCategory
 * @returns {Promise<void>}
 */
export async function writeCategoriesToLocal(mainCategory) {
  const mainCate = mainCategory.main;
  const categoryTbl = db.table(table);

  // sync MAIN category
  const category = await categoryTbl.get(mainCate.id);
  if (category) {
    // Update
    await categoryTbl.update(mainCate.id, mainCate);
  } else {
    // Add new
    await categoryTbl.add(mainCate);
  }

  // Sync all RAW categories
  const rawCategories = mainCategory.raw;
  rawCategories.forEach(async item => {
    // Write all children cate except root category. In case we assume every shop just have one root category
    if (item.level !== 1) {
      const categoryItem = await categoryTbl.get(item.id);
      if (categoryItem) {
        // Update
        await categoryTbl.update(categoryItem.id, item);
      } else {
        // Add new
        await categoryTbl.add(item);
      }
    }
  });
}

export async function getRootCategoriesFromLocal() {
  const data = await db
    .table(table)
    .where({ level: 1 })
    .first();
  // Because by default table categories just have one record
  return data;
}

export async function getAllCategoriesByParentIdFromLocal(cateId) {
  const data = await db
    .table(table)
    .where({ parent_id: cateId })
    .toArray();
  return data;
}
