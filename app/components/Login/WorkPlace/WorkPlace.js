import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import styles from './workplace.scss';
import {
  getMainUrlWorkPlace,
  changeWorkPlaceInput,
  setDefaultProtocolWorkplace,
  getAppByToken,
  getPlatformWorkPlace
} from '../../../actions/authenAction';

type Props = {
  loading: boolean,
  message: string,
  getAppByToken: (payload: string) => void
};

class WorkPlace extends Component {
  props: Props;

  state = {
    token: ''
  };

  componentDidMount() {
    // Get app info and show old token here
  }

  handleChangeToken = e => {
    const { value } = e.target;
    this.setState({ token: value });
  };

  loginFormSubmit = e => {
    e.preventDefault();
    const { getAppByToken } = this.props;
    const { token } = this.state;
    getAppByToken(token);
  };

  render() {
    const { token } = this.state;
    const { loading, message } = this.props;
    return (
      <>
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapWorkPlacePage}`}
        >
          <div className="container">
            <div className="row">
              <div className="col-sm-12 col-md-6 offset-3">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Access POS system</h3>
                    <div className="mt-4">
                      <form
                        onSubmit={this.loginFormSubmit}
                        className={`${styles.contentColumn} needs-validation`}
                      >
                        <div className="form-group">
                          <label htmlFor="input-token">Enter your token</label>
                          <input
                            value={token}
                            onChange={this.handleChangeToken}
                            type="text"
                            id="input-token"
                            placeholder="access token"
                            className="form-control"
                            required
                          />
                          {message !== '' ? (
                            <>
                              <div className="invalid-feedback">{message}</div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="form-group text-right">
                          <button
                            disabled={loading}
                            className="btn btn-primary"
                            type="submit"
                          >
                            {loading ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              <></>
                            )}
                            Next
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.authenRd.loadingWorkPlace,
    message: state.authenRd.messageErrorWorkPlace,
    tokenWorkPlace: state.authenRd.tokenWorkPlace,
    isValidToken: state.authenRd.isValidToken,
    urlTokenService: state.authenRd.urlTokenService,
    platformTokenService: state.authenRd.platformTokenService
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMainUrlWorkPlace: () => dispatch(getMainUrlWorkPlace()),
    changeWorkPlaceInput: payload => dispatch(changeWorkPlaceInput(payload)),
    setDefaultProtocol: payload =>
      dispatch(setDefaultProtocolWorkplace(payload)),
    getAppByToken: payload => dispatch(getAppByToken(payload)),
    getPlatformWorkPlace: () => dispatch(getPlatformWorkPlace())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPlace);
