import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getProductByCategory } from '../../../actions/homeAction';

type Props = {
  allCategories: Object,
  getProductByCategory: () => void
};

class Categories extends Component<Props> {
  props: Props;

  state = {
    openNavigation: false
  };

  componentDidMount(): void {
    window.addEventListener('resize', this.windowDimensionChange);
  }

  getProductByCategory = item => {
    const categoryId = item.id;
    const { getProductByCategory } = this.props;
    getProductByCategory(categoryId);
  };

  windowDimensionChange = () => {
    // When scaled from window width to pc width openNavigation for mobile default is off
    if (window.innerWidth > 768) {
      this.setState({ openNavigation: false });
    }
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

  navigationClick = () => {
    const { openNavigation } = this.state;
    if (openNavigation) {
      this.setState({ openNavigation: false });
    } else {
      this.setState({ openNavigation: true });
    }
  };

  render() {
    const { allCategories } = this.props;
    const { openNavigation } = this.state;
    /* eslint-disable */
    const children_data = allCategories.children_data ? allCategories.children_data : [];
    /* eslint-enable */
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
            onClick={this.navigationClick}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${
              openNavigation ? 'show' : ''
            }`}
            id="navbarSupportedContent"
          >
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
                <ul
                  className="dropdown-menu"
                  data-naviga-redirect={openNavigation}
                  aria-labelledby="navbarDropdown"
                >
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
