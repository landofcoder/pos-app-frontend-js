import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import styles from './workplace.scss';
import {
  getMainUrlWorkPlace,
  changeWorkPlaceInput,
  setDefaultProtocolWorkplace,
  actionSetInfoWorkPlace,
  getPlatformWorkPlace
} from '../../../actions/authenAction';

type Props = {
  loading: boolean,
  getMainUrlWorkPlace: payload => void,
  getPlatformWorkPlace: () => void,
  changeWorkPlaceInput: payload => void,
  message: string,
  tokenWorkPlace: string,
  isValidToken: boolean,
  actionSetInfoWorkPlace: payload => void
};

class WorkPlace extends Component {
  props: Props;

  componentDidMount() {
    const { getMainUrlWorkPlace, getPlatformWorkPlace } = this.props;
    getMainUrlWorkPlace();
    getPlatformWorkPlace();
  }

  handleChangeToken = e => {
    const { value } = e.target;
    const { changeWorkPlaceInput } = this.props;
    changeWorkPlaceInput(value);
  };

  // eslint-disable-next-line class-methods-use-this
  checkValidateToken() {
    const { isValidToken, tokenWorkPlace } = this.props;
    if (tokenWorkPlace.length === 0) return null;
    if (isValidToken) return 'is-valid';
    return 'is-invalid';
  }

  loginFormSubmit = e => {
    e.preventDefault();
    const { tokenWorkPlace, actionSetInfoWorkPlace } = this.props;
    actionSetInfoWorkPlace(tokenWorkPlace);
  };

  render() {
    const { loading, message, tokenWorkPlace } = this.props;

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
                          <label>Enter your token</label>
                          <div className="input-group mb-3">
                            <input
                              value={tokenWorkPlace}
                              onChange={this.handleChangeToken}
                              type="text"
                              placeholder="access token"
                              className="form-control"
                              aria-label="Text input with dropdown button"
                              required
                            />
                          </div>

                          {message !== '' ? (
                            <>
                              <span className="error text-danger">
                                {message}
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="form-group text-right">
                          <button className="btn btn-primary" type="submit">
                            {loading ? (
                              <div
                                className="btn btn-primary"
                                type="button"
                                disabled
                              >
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                <span className="sr-only">Next</span>
                              </div>
                            ) : (
                              <>Next</>
                            )}
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
    actionSetInfoWorkPlace: payload =>
      dispatch(actionSetInfoWorkPlace(payload)),
    getPlatformWorkPlace: () => dispatch(getPlatformWorkPlace())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPlace);
