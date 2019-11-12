// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authenAction';
import styles from './pagelogin.scss';
import commonStyles from '../styles/common.scss';

type Props = {
  login: () => void
};
class PageLogin extends Component {
  props: Props;

  render() {
    const { login } = this.props;
    return (
      <>
        <div
          className={`${commonStyles.wrapStaticPageContent} ${styles.wrapFullCenter} ${commonStyles.contentColumn}`}
        >
          <div className="col-5">
            <div className={styles.contentColumn}>
              <img
                className="mb-4"
                src="/docs/4.3/assets/brand/bootstrap-solid.svg"
                alt=""
                width="72"
                height="72"
              />
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <label htmlFor="inputEmail" className="sr-only">
                Email address
                <input
                  refs={user => {
                    this.user = user;
                  }}
                  type="email"
                  id="inputEmail"
                  className="form-control"
                  placeholder="Email address"
                  required
                />
              </label>
              <label htmlFor="inputPassword" className="sr-only">
                Password
                <input
                  refs={pass => {
                    this.pass = pass;
                  }}
                  type="password"
                  id="inputPassword"
                  className="form-control"
                  placeholder="Password"
                  required
                />
              </label>
              <div className="checkbox mb-3"></div>
              <button
                onClick={login}
                className="btn btn-lg btn-primary btn-block"
                type="submit"
              >
                Sign in
              </button>
              <p className="mt-5 mb-3 text-muted">&copy; 2017-2019</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder,
    orderPreparingCheckout: state.mainRd.orderPreparingCheckout
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: payload => dispatch(login(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageLogin);
