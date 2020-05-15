import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authenAction';
import { backToWorkPlace } from '../../actions/homeAction';
import styles from './login.scss';
import commonStyles from '../styles/common.scss';
import Loading from '../commons/Loading';

type Props = {
  login: (payload: Object) => void,
  backToWorkPlace: () => void,
  loading: boolean,
  loginStatus: boolean
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

  backToWorkPlace = () => {
    const { backToWorkPlace } = this.props;
    backToWorkPlace();
  };

  render() {
    const { loading, loginStatus, listMessage } = this.props;
    const { valueUser, valuePass } = this.state;
    return (
      <>
        <div className={`${commonStyles.contentColumn} ${styles.wrapPage}`}>
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
                <button
                  className="btn btn-primary btn-block mt-1"
                  type="submit"
                >
                  {loading ? <Loading/> : <>Sign In</>}
                </button>
              </div>
              {loginStatus === false ? (
                <div>
                  <p>Please check the conditions below</p>
                  <div className="card">
                    <div className="card-body">
                      <ul>
                        {listMessage.map((item, index) => {
                          return (
                            <li key={index}>
                              {item.status === true ? (
                                <span className="text-success">{item.mess}</span>
                              ) : (
                                <span className="text-danger">{item.mess}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <div>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={this.backToWorkPlace}
                >
                  <span className="text-muted">Back</span>
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
    backToWorkPlace: () => dispatch(backToWorkPlace())
  };
}

function mapStateToProps(state) {
  return {
    loading: state.authenRd.loading,
    mainUrl: state.authenRd.mainUrl,
    loginStatus: state.authenRd.login.loginResult.status,
    listMessage: state.authenRd.login.loginResult.listMessage
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
