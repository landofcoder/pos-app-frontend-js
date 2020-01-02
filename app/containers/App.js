// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { updateIsInternetConnected } from '../actions/homeAction';

type Props = {
  children: React.Node,
  updateIsInternetConnected: (payload: any) => void
};

class App extends React.Component<Props> {
  props: Props;

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
    const { children } = this.props;
    return (
      <React.Fragment>
        <div className="container-fluid">{children}</div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoadingSystemConfig: state.mainRd.isLoadingSystemConfig,
    token: state.authenRd.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsInternetConnected: payload =>
      dispatch(updateIsInternetConnected(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
