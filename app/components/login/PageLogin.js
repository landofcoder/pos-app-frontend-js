// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { login } from '../../actions/authenAction';
import styles from './pagelogin.scss';
import commonStyles from '../styles/common.scss';
import Loading from '../wait/Loading';
import * as routes from '../../constants/routes';

type Props = {
  login: () => void,
  message: string,
  token: string
};
class PageLogin extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      valueUser: '',
      valuePass: ''
    };
    console.log(this.state);
  }

  handleChangeUser = event => {
    this.setState({ valueUser: event.target.value });
  };

  handleChangePass = event => {
    this.setState({ valuePass: event.target.value });
  };

  loginAction = () => {
    const { login } = this.props;
    const { valueUser, valuePass } = this.state;
    console.log(`user name :${valueUser}`);
    console.log(`pass name :${valuePass}`);
    const payload = {
      username: valueUser,
      password: valuePass
    };
    login(payload);
  };

  render() {
    const { token, message } = this.props;
    const { valueUser, valuePass } = this.state;
    if (token !== '') {
      return <Redirect to={routes.HOME} />;
    }
    return (
      <>
        <Loading />
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
              </label>
              <input
                value={valueUser}
                onChange={this.handleChangeUser}
                type="email"
                id="inputEmail"
                className="form-control"
                placeholder="Email address"
                required
              />
              <label htmlFor="inputPassword" className="sr-only">
                Password
              </label>
              <input
                value={valuePass}
                onChange={this.handleChangePass}
                type="password"
                id="inputPassword"
                className="form-control"
                placeholder="Password"
                required
              />
              <div className="checkbox mb-3"></div>
              {message !== '' ? (
                <div class="alert alert-danger" role="alert">
                  {message}
                </div>
              ) : (
                <></>
              )}
              <button
                onClick={this.loginAction}
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

function mapDispatchToProps(dispatch) {
  return {
    login: payload => dispatch(login(payload))
  };
}
function mapStateToProps(state) {
  return {
    message: state.authenRd.message,
    token: state.authenRd.token
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageLogin);
