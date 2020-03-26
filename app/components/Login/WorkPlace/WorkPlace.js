import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import ModuleInstalled from '../ModuleInstalled';
import styles from './workplace.scss';
import {
  getMainUrlWorkPlace,
  errorSignInWorkPlaceMessage,
  changeWorkPlaceInput,
  setDefaultProtocolWorkplace,
  changeToModuleInstalled,
  changeSenseUrl,
  actionGetInfoWorkPlace,
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
  toModuleInstalled: false,
  changeToModuleInstalled: payload => void,
  changeSenseUrl: payload => void,
  actionGetInfoWorkPlace: payload => void
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
    const { tokenWorkPlace, actionGetInfoWorkPlace } = this.props;
    actionGetInfoWorkPlace(tokenWorkPlace);
  };

  render() {
    const { loading, message, tokenWorkPlace, toModuleInstalled } = this.props;
    if (toModuleInstalled) {
      return <ModuleInstalled />;
    }
    return (
      <>
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapWorkPlacePage}`}
        >
          <div className="col-sm-12 col-md-5 col-lg-4">
            <form
              onSubmit={this.loginFormSubmit}
              className={`${styles.contentColumn} needs-validation`}
            >
              <h1 className="h3 mb-5 text-center">Access POS system</h1>
              <div className="form-group">
                <label>Enter your token</label>
                <div className="input-group mb-3">
                  <input
                    value={tokenWorkPlace}
                    onChange={this.handleChangeToken}
                    type="text"
                    className={`form-control ${this.checkValidateToken()}`}
                    aria-label="Text input with dropdown button"
                    required
                  />
                </div>

                {message !== '' ? (
                  <>
                    <span className="error text-danger">{message}</span>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="form-group">
                <button
                  className="btn btn-lg btn-primary btn-block"
                  type="submit"
                >
                  {loading ? (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <>Next</>
                  )}
                </button>
              </div>
            </form>
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
    toModuleInstalled: state.authenRd.toModuleInstalled,
    isValidToken: state.authenRd.isValidToken
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getMainUrlWorkPlace: () => dispatch(getMainUrlWorkPlace()),
    errorSignIn: payload => dispatch(errorSignInWorkPlaceMessage(payload)),
    changeWorkPlaceInput: payload => dispatch(changeWorkPlaceInput(payload)),
    setDefaultProtocol: payload =>
      dispatch(setDefaultProtocolWorkplace(payload)),
    changeToModuleInstalled: payload =>
      dispatch(changeToModuleInstalled(payload)),
    changeSenseUrl: payload => dispatch(changeSenseUrl(payload)),
    actionGetInfoWorkPlace: payload =>
      dispatch(actionGetInfoWorkPlace(payload)),
    getPlatformWorkPlace: () => dispatch(getPlatformWorkPlace())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPlace);
