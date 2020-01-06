// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authenAction';
import { setToken } from '../../actions/homeAction';
import styles from './pagelogin.scss';
import commonStyles from '../styles/common.scss';
import Loading from '../commons/Loading';

type Props = {
  login: (payload: Object) => void,
  message: string,
  loading: boolean
};

type State = {
  valueUser: string,
  valuePass: string
};

class Login extends Component<Props, State> {
  props: Props;

  state = {
    valueUser: '',
    valuePass: ''
  };

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
    const { message, loading } = this.props;
    const { valueUser, valuePass } = this.state;
    return (
      <>
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapLoginPage}`}
        >
          <div className="col-sm-12 col-md-4 col-lg-4">
            <form
              onSubmit={this.loginFormSubmit}
              className={`${styles.contentColumn}`}
            >
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
                  <div className="text-danger">
                    {message}
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <div className="form-group">
                <button
                  className="btn btn-lg btn-primary btn-block mt-1"
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
    loading: state.authenRd.loading
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
