import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import styles from './workplace.scss';
import { checkValidateUrlLink } from '../../../common/settings';
import {
  setMainUrlWorkPlace,
  getMainUrlWorkPlace,
  errorSignInWorkPlaceMessage,
  changeUrlInputWorkplace,
  setDefaultProtocolWorkplace
} from '../../../actions/authenAction';

type Props = {
  loading: boolean,
  setMainUrlWorkPlace: payload => void,
  getMainUrlWorkPlace: payload => void,
  errorSignIn: payload => void,
  changeUrlInput: payload => void,
  setDefaultProtocol: payload => void,
  message: string,
  defaultProtocol: string,
  mainUrl: string,
  didDo: boolean
};

class WorkPlace extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      showSelectProtocol: '',
      isValidUrl: false
    };
  }

  componentWillMount() {
    const { mainUrl } = this.props;
    this.setState({
      isValidUrl: this.checkValidateUrlLink(mainUrl)
    });
  }

  componentDidMount() {
    const { getMainUrlWorkPlace } = this.props;
    getMainUrlWorkPlace();
  }

  changeShowSelectProtocol = () => {
    const { showSelectProtocol } = this.state;
    if (showSelectProtocol) this.setState({ showSelectProtocol: '' });
    else this.setState({ showSelectProtocol: 'show' });
  };

  setDefaultProtocol = protocol => {
    const { setDefaultProtocol } = this.props;
    setDefaultProtocol(protocol);
    this.changeShowSelectProtocol();
  };

  handleChangeUrl = event => {
    const { changeUrlInput } = this.props;
    let mainUrl = event.target.value;
    if (mainUrl.indexOf('http://') !== -1) {
      mainUrl = mainUrl.slice(
        mainUrl.indexOf('http://') + 7,
        mainUrl.length - 1
      );
    } else if (mainUrl.indexOf('https://') !== -1) {
      mainUrl = mainUrl.slice(
        mainUrl.indexOf('https://') + 8,
        mainUrl.length - 1
      );
    }
    changeUrlInput(mainUrl);
    this.setState({
      isValidUrl: this.checkValidateUrlLink(mainUrl)
    });
  };

  checkValidateUrlLink = mainUrl => {
    const { defaultProtocol } = this.props;
    return checkValidateUrlLink(defaultProtocol, mainUrl, '/');
  };
  loginFormSubmit = e => {
    e.preventDefault();
    const { setMainUrlWorkPlace, errorSignIn, defaultProtocol } = this.props;
    const { isValidUrl } = this.state;
    let { mainUrl } = this.props;
    if (mainUrl[mainUrl.length - 1] === '/') {
      mainUrl = mainUrl.slice(0, mainUrl.length - 1);
    }
    if (isValidUrl) setMainUrlWorkPlace(defaultProtocol + mainUrl + '/');
    else {
      errorSignIn('Invalid URL, please try again!');
    }
  };

  render() {
    const { showSelectProtocol, isValidUrl } = this.state;
    const { loading, message, mainUrl, defaultProtocol, didDo } = this.props;
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
              <h1 className="h3 mb-5 text-center">Sign in to POS system</h1>
              <div className="form-group">
                <label>Enter your magento website url</label>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <button
                      className="btn btn-outline-secondary dropdown-toggle"
                      onClick={() => {
                        this.changeShowSelectProtocol();
                      }}
                      type="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      {defaultProtocol}
                    </button>
                    <div className={`dropdown-menu ${showSelectProtocol}`}>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          this.setDefaultProtocol('http://');
                        }}
                        href="#"
                      >
                        http://
                      </a>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          this.setDefaultProtocol('https://');
                        }}
                        href="#"
                      >
                        https://
                      </a>
                    </div>
                  </div>
                  <input
                    value={mainUrl}
                    onChange={this.handleChangeUrl}
                    type="text"
                    className={`form-control ${
                      didDo ? (isValidUrl ? 'is-valid' : 'is-invalid') : ''
                    }`}
                    aria-label="Text input with dropdown button"
                    placeholder="magentowebsite.com"
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
    mainUrl: state.authenRd.urlInput,
    defaultProtocol: state.authenRd.defaultProtocol,
    didDo: state.authenRd.changeInput
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setMainUrlWorkPlace: payload => dispatch(setMainUrlWorkPlace(payload)),
    getMainUrlWorkPlace: () => dispatch(getMainUrlWorkPlace()),
    errorSignIn: payload => dispatch(errorSignInWorkPlaceMessage(payload)),
    changeUrlInput: payload => dispatch(changeUrlInputWorkplace(payload)),
    setDefaultProtocol: payload =>
      dispatch(setDefaultProtocolWorkplace(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPlace);
