import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getProductByCategory,
  toggleModelCategories
} from '../../../actions/homeAction';
import ChevronRight from '../chevron-right';
import Styles from './categories.scss';

type Props = {
  allCategories: Object,
  getProductByCategory: (payload: string) => void,
  toggleModelCategories: (payload: boolean) => void
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

  render() {
    const { allCategories } = this.props;
    /* eslint-disable */
    const children_data = (allCategories && allCategories.children_data) ? allCategories.children_data : [];
    /* eslint-enable */
    return (
      <div className={`${Styles.wrapCategoryBox}`}>
        <div className={`col-12 ${Styles.wrapTitleCategory}`}>
          <h4 className={Styles.title}>Categories</h4>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            All products
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Cras justo odio
            <span style={{ marginLeft: '10px' }}>
              <ChevronRight />
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Dapibus ac facilisis in
            <span style={{ marginLeft: '10px' }}>
              <ChevronRight />
            </span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Morbi leo risus
            <span style={{ marginLeft: '10px' }}>
              <ChevronRight />
            </span>
          </li>
        </ul>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getProductByCategory: payload => dispatch(getProductByCategory(payload)),
    toggleModelCategories: payload => dispatch(toggleModelCategories(payload))
  };
}

function mapStateToProps(state) {
  return {
    allCategories: state.mainRd.allCategories
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
