// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { login } from '../../actions/authenAction';
import { setToken } from '../../actions/homeAction';
import styles from './pagelogin.scss';
import commonStyles from '../styles/common.scss';
import Loading from '../commons/Loading';
import * as routes from '../../constants/routes';
import { POS_LOGIN_STORAGE } from '../../constants/authen';

type Props = {
  login: (payload: Object) => void,
  message: string,
  token: string,
  loading: boolean,
  setToken: () => void
};

type State = {
  valueUser: string,
  valuePass: string
};

class PageLogin extends Component<Props, State> {
  props: Props;

  state = {
    valueUser: '',
    valuePass: ''
  };

  componentDidMount(): * {
    console.log('login page did mount');
  }

  handleChangeUser = event => {
    this.setState({ valueUser: event.target.value });
  };

  handleChangePass = event => {
    this.setState({ valuePass: event.target.value });
  };

  loginFormSubmit = e => {
    e.preventDefault();
    const { login } = this.props;
    const { valueUser, valuePass } = this.state;
    const payload = {
      username: valueUser,
      password: valuePass
    };
    login(payload);
  };

  render() {
    const { token, message, loading, setToken } = this.props;
    const { valueUser, valuePass } = this.state;
    if (token !== '') {
      console.log('redirect to pos now');
      return <Redirect push to={'/test'} />;
    }
    if (localStorage.getItem(POS_LOGIN_STORAGE)) {
      // setToken(localStorage.getItem(POS_LOGIN_STORAGE));
      // return <Redirect to={routes.HOME} />;
    }

    return (
      <>
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapLoginPage}`}
        >
          <div className="col-sm-12 col-md-4 col-lg-3 ">
            <form onSubmit={this.loginFormSubmit} className={`${styles.contentColumn}`}>
              <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>
              <div className="form-group">
                <input
                  value={valueUser}
                  onChange={this.handleChangeUser}
                  type="text"
                  id="inputEmail"
                  className="form-control"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  value={valuePass}
                  onChange={this.handleChangePass}
                  type="password"
                  id="inputPassword"
                  className="form-control"
                  placeholder="Password"
                  required
                />
              </div>
              <div className="form-group">
                {message !== '' ? (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                ) : (
                  <></>
                )}
                <button
                  className="btn btn-lg btn-primary btn-block"
                  type="submit"
                >
                  {loading ? <Loading /> : <>Sign In</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: payload => dispatch(login(payload)),
    setToken: payload => dispatch(setToken(payload))
  };
}
function mapStateToProps(state) {
  return {
    message: state.authenRd.message,
    token: state.authenRd.token,
    loading: state.authenRd.loading
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageLogin);
