// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authenAction';
import { setToken, bootstrapApplication } from '../../actions/homeAction';
import styles from './pagelogin.scss';
import commonStyles from '../styles/common.scss';
import Loading from '../commons/Loading';

type Props = {
  login: (payload: Object) => void,
  bootstrapApplication: () => void,
  message: string,
  token: string,
  loading: boolean
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
          <div className="col-sm-12 col-md-4 col-lg-3 ">
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
    setToken: payload => dispatch(setToken(payload)),
    bootstrapApplication: () => dispatch(bootstrapApplication())
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
