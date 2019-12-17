// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProductByCategory } from '../../../actions/homeAction';

type Props = {
  allCategories: Object,
  getProductByCategory: () => void
};

class Categories extends Component<Props> {
  props: Props;

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
    console.log('', item);
    return item.children_data && item.children_data.length > 0 ? (
      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
        {item.children_data.map((childItem, indexChild) => {
          console.log('category name:', childItem.name);
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
    const { children_data } = allCategories;
    /* eslint-enable */
    console.log('all categories:', children_data);
    return (
      <div>
        <nav className="navbar navbar-light navbar-expand-lg mainmenu">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="dropdown">
                <a
                  className="dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Default category
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  {children_data.map((value, index) => {
                    return (
                      <li
                        key={index}
                        data-category-id={value.id}
                        className={
                          value.children_data && value.children_data.length > 0
                            ? 'dropdown'
                            : ''
                        }
                      >
                        <a
                          href="#"
                          onClick={() => this.getProductByCategory(value)}
                          className={
                            value.children_data &&
                            value.children_data.length > 0
                              ? 'dropdown-toggle'
                              : ''
                          }
                        >
                          {value.name}
                        </a>
                        {this.renderSubMenu(value, index)}
                      </li>
                    );
                  })}
                  <li className="dropdown">
                    <a
                      className="dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Dropdown2
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <a href="#">Action</a>
                      </li>
                      <li>
                        <a href="#">Another action</a>
                      </li>
                      <li>
                        <a href="#">Something else here</a>
                      </li>
                      <li className="dropdown">
                        <a
                          className="dropdown-toggle"
                          href="#"
                          id="navbarDropdown"
                          role="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Dropdown3
                        </a>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="navbarDropdown"
                        >
                          <li>
                            <a href="#">Action</a>
                          </li>
                          <li>
                            <a href="#">Another action</a>
                          </li>
                          <li>
                            <a href="#">Something else here</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getProductByCategory: payload => dispatch(getProductByCategory(payload))
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
