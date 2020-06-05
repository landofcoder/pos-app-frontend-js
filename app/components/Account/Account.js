import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import DetailDataSync from './SyncManager/DetailDataSync/DetailDataSync';
import OrderHistory from './OrderHistory/OrderHistory';
import CashierInfo from './CashierInfo/CashierInfo';
import ConnectDevices from './ConnectDevices/ConnectDevices';
import SyncManager from './SyncManager/SyncManager';
import CashDrawer from './CashDrawer/CashDrawer';
import { POS } from '../../constants/routes.json';
import Back from '../commons/back';

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
      case 'cashDrawer':
        return <CashDrawer />;
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
        <DetailDataSync />
        <div>
          <div className="row pt-4">
            <div className="col-3">
              <div className="col-12 mb-2 pl-0">
                <Link className="btn btn-light btn-sm" to={POS}>
                  <Back />
                </Link>
              </div>
              <div className="list-group list-group-flush">
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
                  Sync Data
                </button>
                <button
                  type="button"
                  onClick={() => this.switchingComponent('cashDrawer')}
                  className={`list-group-item list-group-item-action ${
                    viewSelected === 'cashDrawer' ? 'active' : ''
                  }`}
                >
                  Cash drawer
                </button>
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

function mapDispatchToProps() {
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
