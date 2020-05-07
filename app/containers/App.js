import * as React from 'react';
import { connect } from 'react-redux';
import {
  updateIsInternetConnected,
  syncDataClient
} from '../actions/homeAction';
import { checkLoginBackground } from '../actions/authenAction';
import Login from '../components/Login/Login';
import {
  CHILDREN,
  LOGIN_FORM,
  LOADING,
  SYNC_SCREEN,
  WORK_PLACE_FORM
} from '../constants/main-panel-types';
import SyncFirstScreen from '../components/Login/SyncScreen/SyncScreen';
import WorkPlace from '../components/Login/WorkPlace/WorkPlace';
import { startLoop, stopLoop } from '../common/settings';

type Props = {
  children: React.Node,
  updateIsInternetConnected: (payload: any) => void,
  checkLoginBackground: () => void,
  switchingMode: string,
  flagSwitchModeCounter: number,
  syncDataClient: () => void
};

class App extends React.Component<Props> {
  props: Props;

  state = {
    counterMode: 0,
    frameId: null
  };

  componentDidMount() {
    const { updateIsInternetConnected, syncDataClient } = this.props;
    // Listen online and offline mode
    window.addEventListener('online', this.alertOnlineStatus);
    window.addEventListener('offline', this.alertOnlineStatus);

    // Get current online mode
    updateIsInternetConnected(navigator.onLine);

    const loopStep = 1000;
    // Start cron

    // truong hop chua co duu lieu

    const frameId = startLoop(syncDataClient, loopStep);
    this.setState({ frameId });
  }

  componentWillUnmount(): void {
    const { frameId } = this.state;
    stopLoop(frameId);
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
            case WORK_PLACE_FORM:
              return <WorkPlace />;
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
    token: state.authenRd.token,
    switchingMode: state.mainRd.switchingMode,
    flagSwitchModeCounter: state.mainRd.flagSwitchModeCounter
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsInternetConnected: payload =>
      dispatch(updateIsInternetConnected(payload)),
    checkLoginBackground: () => dispatch(checkLoginBackground()),
    syncDataClient: () => dispatch(syncDataClient())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
