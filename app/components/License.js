import React, { Component } from 'react';
import { connect } from 'react-redux';
import { differenceInDays, addDays } from 'date-fns';
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

  render() {
    const { appLicense } = this.props;
    const dateCreated = appLicense.data.created_at;
    const { plan } = appLicense.data;
    let isTrial = false;
    let days = 0;
    // If have no plan field or plan equal true value
    if (!plan || plan === 'TRIAL') {
      // Cal time left
      isTrial = true;
      const dayEndTrial = addDays(new Date(dateCreated), 30);
      days = differenceInDays(dayEndTrial, new Date());
      if (days > 30) {
        // Lock checkout function
        console.log('lock checkout function');
      }
    }
    return (
      <>
        {isTrial && Number.isInteger(days) ? (
          <span className="badge badge-warning">{days} days trial left</span>
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
