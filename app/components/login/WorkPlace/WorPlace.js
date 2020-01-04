import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import styles from './workplace.scss';
import Loading from '../../commons/Loading';
type Props = {
  loading: boolean
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
  handleChangeUrl = event => {
    this.setState({ mainUrl: event.target.value });
  };

  loginFormSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { mainUrl } = this.state;
    const { loading } = this.props;
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
                  Enter your workspace’s Slack URL.
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
                {/* {message !== '' ? (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                ) : (
                  <></>
                )} */}
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
    loading: state.authenRd.loadingWorkPlace
  };
}
function mapDispatchToProps(dispatch) {
  return {

  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkPlace);
