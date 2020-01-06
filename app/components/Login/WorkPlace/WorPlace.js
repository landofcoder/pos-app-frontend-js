import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import styles from './workplace.scss';
import Loading from '../../commons/Loading';
import {
  setMainUrlWorkPlace,
  getMainUrlWorkPlace
} from '../../../actions/authenAction';
type Props = {
  loading: boolean,
  setMainUrlKey: payload => void,
  message: string
};
class WorkPlace extends Component {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      mainUrl: '',
      defaultProtocol: 'http://'
    };
  }
  componentDidMount() {
    const { getMainUrlWorkPlace } = this.props;
    getMainUrlWorkPlace();
  }
  handleChangeUrl = event => {
    this.setState({ mainUrl: event.target.value });
  };

  loginFormSubmit = e => {
    e.preventDefault();
    const { setMainUrlKey } = this.props;
    const { mainUrl, defaultProtocol } = this.state;
    setMainUrlKey(defaultProtocol + mainUrl);
  };

  render() {
    const { mainUrl } = this.state;
    const { loading, message } = this.props;
    return (
      <>
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapWorkPlacePage}`}
        >
          <div className="col-sm-12 col-md-5 col-lg-3">
            <form
              onSubmit={this.loginFormSubmit}
              className={`${styles.contentColumn} text-center`}
            >
              <h1 className="h3 mb-3 font-weight-normal">
                Sign in to your workspace
              </h1>
              <div className="form-group">
                <span className="text-center">
                  Enter your workspace’s POS URL.
                </span>
              </div>
              <div className="form-group">
                <input
                  value={mainUrl}
                  onChange={this.handleChangeUrl}
                  type="text"
                  className="form-control"
                  placeholder="Your WorkPlace"
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
                  {loading ? (
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <>Sign In</>
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
    message: state.authenRd.messageErrorWorkPlace
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setMainUrlWorkPlace: payload => dispatch(setMainUrlWorkPlace(payload)),
    getMainUrlWorkPlace: () => dispatch(getMainUrlWorkPlace())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPlace);
