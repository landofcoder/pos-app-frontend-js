// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { login } from '../../actions/authenAction';
import { setToken } from '../../actions/homeAction';
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
    const payload = {
      username: valueUser,
      password: valuePass
    };
    login(payload);
    console.log(this.props.loading);
  };

  render() {
    const { token, message, loading } = this.props;
    const { valueUser, valuePass } = this.state;
    if (token !== '') {
      return <Redirect to={routes.HOME} />;
    }
    return (
      <>
        <div
          className={`${commonStyles.wrapStaticPageContent} ${styles.wrapFullCenter} ${commonStyles.contentColumn}`}
        >
          <div className="col-sm-12 col-md-4 col-lg-3 ">
            <form className={`${styles.contentColumn}`}>
              <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
              <div className="form-group">
                <input
                  value={valueUser}
                  onChange={this.handleChangeUser}
                  type="email"
                  id="inputEmail"
                  className="form-control"
                  placeholder="Email address"
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
                  onClick={this.loginAction}
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
