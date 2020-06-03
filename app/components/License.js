import React, { Component } from 'react';
import { connect } from 'react-redux';
import { validateLicense } from '../actions/authenAction';
import { startLoop, stopLoop } from '../common/settings';

class License extends Component {
  props: Props;

  state = {
    frameId: null
  };

  componentDidMount() {
    const { validateLicense } = this.props;
    const frameId = startLoop(validateLicense, 900000);
    this.setState({ frameId });
  }

  componentWillUnmount() {
    const { frameId } = this.state;
    stopLoop(frameId);
  }

  openLandOfCodePage = () => {
    // eslint-disable-next-line global-require
    const { shell } = require('electron');
    shell.openExternal('https://pos.landofcoder.com/');
  };

  render() {
    const { appLicense } = this.props;
    const { daysLeft, plan } = appLicense;
    return (
      <>
        {daysLeft && daysLeft >= 0 && plan === 'TRIAL' ? (
          <span className="badge badge-warning">
            {daysLeft} days trial left
          </span>
        ) : (
          <></>
        )}
        {daysLeft && daysLeft < 0 && plan === 'TRIAL' ? (
          <span className="badge badge-warning">
            You have expired the trial, please{' '}
            <a
              className="text-primary"
              href="#"
              onClick={this.openLandOfCodePage}
            >
              Upgrade plan
            </a>
          </span>
        ) : (
          <></>
        )}
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    validateLicense: dispatch(validateLicense())
  };
}

function mapStateToProps(state) {
  return {
    appLicense: state.authenRd.appLicense
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(License);
