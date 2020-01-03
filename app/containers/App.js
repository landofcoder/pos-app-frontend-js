import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateIsInternetConnected,
  bootstrapApplication
} from '../actions/homeAction';
import {
  updateSwitchingMode,
  checkLoginBackground
} from '../actions/authenAction';
import Login from '../components/login/Login';

type Props = {
  children: React.Node,
  updateIsInternetConnected: (payload: any) => void,
  updateSwitchingMode: (payload: any) => void,
  checkLoginBackground: () => void,
  bootstrapApplication: () => void,
  token: string,
  switchingMode: string
};

class App extends React.Component<Props> {
  props: Props;

  componentDidMount() {
    const { updateIsInternetConnected, checkLoginBackground } = this.props;

    checkLoginBackground();

    // Listen online and offline mode
    window.addEventListener('online', this.alertOnlineStatus);
    window.addEventListener('offline', this.alertOnlineStatus);

    // Get current online mode
    updateIsInternetConnected(navigator.onLine);
  }

  alertOnlineStatus = event => {
    const { updateIsInternetConnected } = this.props;
    let isConnected = false;
    if (event.type === 'online') {
      isConnected = true;
    }
    updateIsInternetConnected(isConnected);
  };

  render() {
    const {
      children,
      token,
      switchingMode,
      updateSwitchingMode,
      checkLoginBackground
    } = this.props;

    // Always check login as background
    checkLoginBackground();

    // const loginPos = localStorage.getItem(POS_LOGIN_STORAGE);
    // if (!token) {
    //   if (loginPos && switchingMode !== 'Children') {
    //     // Logged and get all config
    //     bootstrapApplication();
    //   }
    //
    //   if (!loginPos) {
    //     updateSwitchingMode('LoginForm');
    //   }
    // }

    return (
      <React.Fragment>
        {(() => {
          switch (switchingMode) {
            case 'Loading':
              return (
                <div className="d-flex justify-content-center mt-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              );
            case 'LoginForm':
              return <Login />;
            case 'Children':
              return <div className="container-fluid">{children}</div>;
            default:
              return <></>;
          }
        })()}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoadingSystemConfig: state.mainRd.isLoadingSystemConfig,
    token: state.authenRd.token,
    switchingMode: state.mainRd.switchingMode
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsInternetConnected: payload =>
      dispatch(updateIsInternetConnected(payload)),
    updateSwitchingMode: payload => dispatch(updateSwitchingMode(payload)),
    bootstrapApplication: () => dispatch(bootstrapApplication()),
    checkLoginBackground: () => dispatch(checkLoginBackground())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
