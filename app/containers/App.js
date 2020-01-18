import * as React from 'react';
import { connect } from 'react-redux';
import { updateIsInternetConnected } from '../actions/homeAction';
import { checkLoginBackground } from '../actions/authenAction';
import Login from '../components/Login/Login';
import RequireStep from '../components/Login/RequireStep';
import {
  CHILDREN,
  LOGIN_FORM,
  LOADING,
  SYNC_SCREEN,
  LINK_CASHIER_TO_ADMIN_REQUIRE
} from '../constants/main-panel-types';
import SyncFirstScreen from '../components/Login/SyncFirstScreen';

type Props = {
  children: React.Node,
  updateIsInternetConnected: (payload: any) => void,
  checkLoginBackground: () => void,
  switchingMode: string,
  flagSwitchModeCounter: number
};

class App extends React.Component<Props> {
  props: Props;

  state = {
    counterMode: 0
  };

  componentDidMount() {
    const { updateIsInternetConnected } = this.props;
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
      switchingMode,
      checkLoginBackground,
      flagSwitchModeCounter
    } = this.props;
    const { counterMode } = this.state;

    // Make sure checkLoginBackground just run when flagSwitchModeCounter count up
    if (counterMode !== flagSwitchModeCounter) {
      this.setState({ counterMode: flagSwitchModeCounter });
      checkLoginBackground();
    }

    return (
      <React.Fragment>
        {(() => {
          switch (switchingMode) {
            case LOADING:
              return (
                <div className="d-flex justify-content-center mt-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              );
            case LOGIN_FORM:
              return <Login />;
            case CHILDREN:
              return <div className="container-fluid">{children}</div>;
            case SYNC_SCREEN:
              return <SyncFirstScreen />;
            case LINK_CASHIER_TO_ADMIN_REQUIRE:
              return <RequireStep />;
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
    switchingMode: state.mainRd.switchingMode,
    flagSwitchModeCounter: state.mainRd.flagSwitchModeCounter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsInternetConnected: payload =>
      dispatch(updateIsInternetConnected(payload)),
    checkLoginBackground: () => dispatch(checkLoginBackground())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
