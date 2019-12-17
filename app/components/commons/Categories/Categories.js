// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../../actions/authenAction';

type Props = {
  allCategories: () => void
};

class Categories extends Component<Props> {
  props: Props;

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
                        className={value.children_data ? 'dropdown' : ''}
                      >
                        <a
                          href="#"
                          className={
                            value.children_data ? 'dropdown-toggle' : ''
                          }
                        >
                          {value.name}
                        </a>
                        {value.children_data ? (
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="navbarDropdown"
                          >
                            {value.children_data.map(
                              (childItem, indexChild) => {
                                return (
                                  <li key={`${index}${indexChild}`}>
                                    <a href="#">{childItem.name}</a>
                                  </li>
                                );
                              }
                            )}
                          </ul>
                        ) : (
                          <></>
                        )}
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
    login: payload => dispatch(login(payload))
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
