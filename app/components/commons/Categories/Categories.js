import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getProductByCategory,
  toggleModelCategories,
  findChildCategoryByParentId,
  updateCategoriesParentsSession
} from '../../../actions/homeAction';
import ChevronRight from '../chevron-right';
import X from '../x';
import Left from '../left';
import Styles from './categories.scss';

type Props = {
  allCategories: Object,
  categoriesParentsSession: Array,
  getProductByCategory: (payload: string) => void,
  toggleModelCategories: (payload: boolean) => void,
  findChildCategoryByParentId: (payload: number) => void,
  updateCategoriesParentsSession: (payload: Array) => void
};

class Categories extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { toggleModelCategories } = this.props;
      // Hide any modal
      toggleModelCategories(false);
    }
  };

  getProductByCategory = item => {
    const categoryId = item.id;
    const { getProductByCategory } = this.props;
    getProductByCategory(categoryId);
  };

  /**
   * Render sub menu
   * @param item
   * @param index
   * @returns {*}
   */
  renderSubMenu = (item, index) => {
    return item.children_data && item.children_data.length > 0 ? (
      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
        {item.children_data.map((childItem, indexChild) => {
          return (
            <li key={`${index}${indexChild}`}>
              <a href="#" onClick={() => this.getProductByCategory(childItem)}>
                {childItem.name}
              </a>
              {childItem.children_data && childItem.children_data.length > 0 ? (
                this.renderSubMenu(childItem, indexChild)
              ) : (
                <></>
              )}
            </li>
          );
        })}
      </ul>
    ) : (
      <></>
    );
  };

  gotoChildrenCategory = item => {
    const cateId = item.id;
    const childParent = item.children_data;
    const { getProductByCategory, categoriesParentsSession } = this.props;
    if (childParent && childParent.length > 0) {
      const {
        findChildCategoryByParentId,
        updateCategoriesParentsSession
      } = this.props;
      // Set parent category to state
      findChildCategoryByParentId(cateId);

      const listParentAssign = [...categoriesParentsSession];
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const listParent = listParentAssign.concat(item);

      // Update categoriesParentsSession
      updateCategoriesParentsSession(listParent);
    } else {
      getProductByCategory(cateId);
    }
  };

  backToParent = () => {
    const isRootCate = this.isRootCategory();
    if (isRootCate === 1 || isRootCate === 2) {
      const { getProductByCategory } = this.props;
      // Get all products and paging
      getProductByCategory(0);
    } else {
      const {
        categoriesParentsSession,
        updateCategoriesParentsSession
      } = this.props;
      // Get parent from current allCategories
      const { findChildCategoryByParentId } = this.props;

      const listParentAssign = [...categoriesParentsSession];

      // Get last item of listParent
      const lastIndex = listParentAssign.length - 1;
      const lastItem = listParentAssign[lastIndex];
      const lastItemParentId = lastItem.parent_id;

      // const parentCateId = 1;
      findChildCategoryByParentId(lastItemParentId);
      // Remove last item
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      listParentAssign.splice(lastIndex, 1);

      // Update categoriesParentsSession
      updateCategoriesParentsSession(listParentAssign);
    }
  };

  isRootCategory = () => {
    const { allCategories } = this.props;
    if (allCategories && allCategories.length > 0) {
      return allCategories[0].level;
    }
    return allCategories.level;
  };

  render() {
    const { toggleModelCategories, allCategories } = this.props;
    let childrenData;
    const rootLevel = this.isRootCategory();
    // If root object category
    if (allCategories.level === 1 || allCategories.level === 2) {
      childrenData =
        allCategories && allCategories.children_data
          ? allCategories.children_data
          : [];
    } else {
      childrenData = allCategories;
    }
    return (
      <div
        className={`${Styles.wrapCategoryBox}`}
        id="wrap-categories-component"
      >
        <div className={Styles.wrapInsideBox}>
          <div className={`col-12 ${Styles.wrapTitleCategory}`}>
            <h4 className={Styles.title}>Categories</h4>
          </div>
          <ul className="list-group list-group-flush">
            <li
              role="presentation"
              onClick={this.backToParent}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {rootLevel === 1 || rootLevel === 2 ? (
                'All products'
              ) : (
                <span>
                  <Left />
                  <span className="ml-2 pt-1">Back</span>
                </span>
              )}
            </li>
            {childrenData.map((item, index) => {
              return (
                <li
                  role="presentation"
                  key={index}
                  onClick={() => this.gotoChildrenCategory(item)}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.name}
                  {item.children_data && item.children_data.length > 0 ? (
                    <span style={{ marginLeft: '10px' }}>
                      <ChevronRight />
                    </span>
                  ) : (
                    <></>
                  )}
                </li>
              );
            })}
          </ul>
          <div className={Styles.wrapCloseIcon}>
            <div
              role="presentation"
              className={Styles.closeIcon}
              onClick={() => toggleModelCategories(false)}
            >
              <X />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getProductByCategory: payload => dispatch(getProductByCategory(payload)),
    toggleModelCategories: payload => dispatch(toggleModelCategories(payload)),
    findChildCategoryByParentId: payload =>
      dispatch(findChildCategoryByParentId(payload)),
    updateCategoriesParentsSession: payload =>
      dispatch(updateCategoriesParentsSession(payload))
  };
}

function mapStateToProps(state) {
  return {
    allCategories: state.mainRd.allCategories,
    categoriesParentsSession: state.mainRd.categoriesParentsSession
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
