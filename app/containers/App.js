// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { getPostGeneralConfig, getCustomReceipt, updateIsInternetConnected } from '../actions/homeAction';

type Props = {
  children: React.Node,
  getPostGeneralConfig: () => void,
  getCustomReceipt: () => void,
  isLoadingSystemConfig: boolean,
  updateIsInternetConnected: () => void
};

class App extends React.Component<Props> {
  props: Props;

  componentDidMount() {
    const { getPostGeneralConfig, getCustomReceipt, updateIsInternetConnected } = this.props;
    getPostGeneralConfig();
    getCustomReceipt();

    // Listen online and offline mode
    window.addEventListener('online', this.alertOnlineStatus);
    window.addEventListener('offline', this.alertOnlineStatus);

    // Get current online mode
    updateIsInternetConnected(navigator.onLine);
  }

  alertOnlineStatus = (event) => {
    const { updateIsInternetConnected } = this.props;
    let isConnected = false;
    if (event.type === 'online') {
      isConnected = true;
    }
    updateIsInternetConnected(isConnected);
  };

  render() {
    const { children, isLoadingSystemConfig } = this.props;
    return (
      <React.Fragment>
        {isLoadingSystemConfig ? (
          <>
            <div className="mt-5">
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="container-fluid">{children}</div>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoadingSystemConfig: state.mainRd.isLoadingSystemConfig
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPostGeneralConfig: () => dispatch(getPostGeneralConfig()),
    getCustomReceipt: () => dispatch(getCustomReceipt()),
    updateIsInternetConnected: payload => dispatch(updateIsInternetConnected(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
