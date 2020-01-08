import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import styles from './workplace.scss';
import {
  setMainUrlWorkPlace,
  getMainUrlWorkPlace
} from '../../../actions/authenAction';

type Props = {
  loading: boolean,
  setMainUrlWorkPlace: payload => void,
  getMainUrlWorkPlace: payload => void,
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

    const { setMainUrlWorkPlace } = this.props;
    const { mainUrl, defaultProtocol } = this.state;

    setMainUrlWorkPlace(defaultProtocol + mainUrl);
  };

  render() {
    const { mainUrl } = this.state;
    const { loading, message } = this.props;
    return (
      <>
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapWorkPlacePage}`}
        >
          <div className="col-sm-12 col-md-5 col-lg-4">
            <form
              onSubmit={this.loginFormSubmit}
              className={`${styles.contentColumn} text-center`}
            >
              <h1 className="h3 mb-3 font-weight-normal">
                Sign in to POS system
              </h1>
              <div className="form-group">
                <span className="text-center">
                  Enter your magneto website url
                </span>
              </div>
              <div className="form-group">
                <input
                  value={mainUrl}
                  onChange={this.handleChangeUrl}
                  type="text"
                  className="form-control"
                  placeholder="http://magentowebsite.com"
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
