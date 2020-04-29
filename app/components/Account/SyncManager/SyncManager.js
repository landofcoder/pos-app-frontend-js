import React, { Component } from 'react';
import { connect } from 'react-redux';
import SyncCustomProductManager from './SyncCustomProductManager/SyncCustomProductManager';
import SyncCustomerManager from './SyncCustomerManager/SyncCustomerManager';
import SyncOrderManager from './SyncOrderManager/SyncOrderManager';
import { syncDataClient } from '../../../actions/homeAction';
import {
  getListSyncOrder,
  getSyncDataFromLocal
} from '../../../actions/accountAction';

import {
  ALL_PRODUCT_SYNC,
  CUSTOM_PRODUCT_SYNC,
  CUSTOMERS_SYNC,
  GENERAL_CONFIG_SYNC
} from '../../../constants/authen.json';

type Props = {
  syncDataClient: payload => void,
  getListSyncOrder: () => void,
  syncManager: Object,
  getDataSync: () => void
};
class SyncManager extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      viewSelected: 'syncOrder'
    };
  }

  componentDidMount(): void {
    const { getListSyncOrder, getDataSync } = this.props;
    getDataSync();
    // getListSyncOrder();
  }

  renderSwitchShowUpSync = () => {
    const { viewSelected } = this.state;
    switch (viewSelected) {
      case 'syncCustomProduct':
        return <SyncCustomProductManager />;
      case 'syncCustomer':
        return <SyncCustomerManager />;
      case 'syncOrder':
        return <SyncOrderManager />;
      default:
        return null;
    }
  };

  syncStartAction = e => {
    const { syncDataClient, getListSyncOrder } = this.props;
    e.preventDefault();
    syncDataClient(true);
    getListSyncOrder();
  };

  syncDataClientAction = type => {
    const { syncDataClient } = this.props;
    syncDataClient(type);
  };

  viewSelectedAction = payload => {
    this.setState({ viewSelected: payload });
  };

  renderLastTime = manager => {
    if (manager.update_at) {
      return manager.update_at.toLocaleDateString();
    }
    console.log(manager);
    return 'never synced';
  };

  renderStatusSync = manager => {
    if (!manager.update_at) {
      return (
        <span className="badge badge-pill badge-secondary">not synced</span>
      );
    }
    if (manager.errors) {
      return (
        <span className="badge badge-danger badge-pill">
          {manager.errors} errors
        </span>
      );
    }
    return <span className="badge badge-success badge-pill">success</span>;
  };

  render() {
    const { syncManager } = this.props;
    console.log(syncManager);
    const {
      syncOrder,
      syncCustomer,
      syncCustomProduct,
      syncConfig,
      syncAllProduct
    } = syncManager;
    console.log(
      syncCustomer,
      syncOrder,
      syncConfig,
      syncAllProduct,
      syncCustomProduct
    );
    return (
      <div className="row">
        <div className="col-md-12">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Service name</th>
                <th scope="col">Last time sync</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>All products sync</td>
                <td>{this.renderLastTime(syncAllProduct)}</td>
                <td>{this.renderStatusSync(syncAllProduct)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      this.syncDataClientAction(ALL_PRODUCT_SYNC);
                    }}
                  >
                    Sync now
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Custom products sync</td>
                <td>{this.renderLastTime(syncCustomProduct)}</td>
                <td>{this.renderStatusSync(syncCustomProduct)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      this.syncDataClientAction(CUSTOM_PRODUCT_SYNC);
                    }}
                  >
                    Sync now
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>Customers sync</td>
                <td>{this.renderLastTime(syncCustomer)}</td>
                <td>{this.renderStatusSync(syncCustomer)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      this.syncDataClientAction(CUSTOMERS_SYNC);
                    }}
                  >
                    Sync now
                  </button>
                </td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>General config sync</td>
                <td>{this.renderLastTime(syncConfig)}</td>
                <td>{this.renderStatusSync(syncConfig)}</td>

                <td>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      this.syncDataClientAction(GENERAL_CONFIG_SYNC);
                    }}
                  >
                    Sync now
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    syncDataClient: payload => dispatch(syncDataClient({ type: payload })),
    getListSyncOrder: () => dispatch(getListSyncOrder()),
    getDataSync: () => dispatch(getSyncDataFromLocal())
  };
}
function mapStateToProps(state) {
  return {
    syncManager: state.authenRd.syncManager
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncManager);
