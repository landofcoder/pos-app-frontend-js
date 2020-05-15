import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ShowMessagesSync from './SyncManager/ShowMessages/ShowMessages';
import OrderHistory from './OrderHistory/OrderHistory';
import CashierInfo from './CashierInfo/CashierInfo';
import ConnectDevices from './ConnectDevices/ConnectDevices';
import SyncManager from './SyncManager/SyncManager';
import { POS } from '../../constants/routes.json';

class Account extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      viewSelected: 'ordersHistory'
    };
  }

  switchingComponent = payload => {
    this.setState({ viewSelected: payload });
  };

  renderComponent = () => {
    const { viewSelected } = this.state;
    switch (viewSelected) {
      case 'ordersHistory':
        return <OrderHistory />;
      case 'cashierInfo':
        return <CashierInfo />;
      case 'connectDevices':
        return <ConnectDevices />;
      case 'syncManager':
        return <SyncManager />;
      default:
        return null;
    }
  };

  syncManagerAction = e => {
    e.preventDefault();
    this.setState({ viewSelected: 'syncManager' });
  };

  render() {
    const { viewSelected } = this.state;
    return (
      <>
        <ShowMessagesSync />
        <div>
          <div className="row pt-4">
            <div className="col-3">
              <div className="list-group">
                <Link
                  to={POS}
                  className="list-group-item-light list-group-item list-group-item-action"
                >
                  Back
                </Link>
                <button
                  type="button"
                  onClick={() => this.switchingComponent('cashierInfo')}
                  className={`list-group-item list-group-item-action ${
                    viewSelected === 'cashierInfo' ? 'active' : ''
                  }`}
                >
                  Account Setting
                </button>
                <button
                  type="button"
                  onClick={() => this.switchingComponent('ordersHistory')}
                  className={`list-group-item list-group-item-action ${
                    viewSelected === 'ordersHistory' ? 'active' : ''
                  }`}
                >
                  Orders History
                </button>
                <button
                  type="button"
                  onClick={() => this.switchingComponent('syncManager')}
                  className={`list-group-item list-group-item-action ${
                    viewSelected === 'syncManager' ? 'active' : ''
                  }`}
                >
                  Sync data
                </button>
                <button
                  type="button"
                  onClick={() => this.switchingComponent('connectDevices')}
                  className={`list-group-item list-group-item-action ${
                    viewSelected === 'connectDevices' ? 'active' : ''
                  }`}
                >
                  Connect Devices
                </button>
              </div>
            </div>
            <div className="col-9">{this.renderComponent()}</div>
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {};
}
function mapStateToProps(state) {
  return {
    syncStatus: state.authenRd.syncManager.syncStatus
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
