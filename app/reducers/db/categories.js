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
  // eslint-disable-next-line no-restricted-syntax
  for (const item of rawCategories) {
    // Write all children cate except root category. In case we assume every shop just have one root category
    if (item.level !== 1) {
      // eslint-disable-next-line no-await-in-loop
      const categoryItem = await categoryTbl.get({ id: item.id });
      if (categoryItem) {
        // Update
        // eslint-disable-next-line no-await-in-loop
        await categoryTbl.update(item.id, item);
      } else {
        // Add new
        // eslint-disable-next-line no-await-in-loop
        await categoryTbl.add(item);
      }
    }
  }
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
