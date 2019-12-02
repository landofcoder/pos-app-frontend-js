/**
 * Find option item by id
 * @param props
 * @returns {*}
 */
export function findOptionById(props) {
  const { item } = props;
  const selectedId = item.option_selected[0];
  let foundItem;
  for (let i = 0; i < item.options.length; i += 1) {
    const itemOption = item.options[i];
    if (itemOption.id === selectedId) {
      foundItem = itemOption;
    }
  }
  return foundItem;
}
