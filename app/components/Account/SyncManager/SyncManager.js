import React, { Component } from 'react';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import SyncCustomProductManager from './SyncCustomProductManager/SyncCustomProductManager';
import SyncCustomerManager from './SyncCustomerManager/SyncCustomerManager';
import SyncOrderManager from './SyncOrderManager/SyncOrderManager';
import { syncDataClient } from '../../../actions/homeAction';
import {
  getListSyncOrder,
  getSyncDataFromLocal,
  showLogsAction
} from '../../../actions/accountAction';

import {
  ALL_PRODUCT_SYNC,
  CUSTOM_PRODUCT_SYNC,
  CUSTOMERS_SYNC,
  GENERAL_CONFIG_SYNC
} from '../../../constants/authen.json';
import Style from './sync-manager.scss';
type Props = {
  syncDataClient: payload => void,
  getListSyncOrder: () => void,
  syncManager: Object,
  getDataSync: () => void,
  showLogsAction: (payload: Object) => void
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
    const { getDataSync } = this.props;
    getDataSync();
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

  syncDataClientAction = type => {
    const { syncDataClient, showLogsAction } = this.props;
    syncDataClient(type);
    showLogsAction({ status: false });
  };

  viewSelectedAction = payload => {
    this.setState({ viewSelected: payload });
  };

  renderLastTime = manager => {
    if (manager.update_at) {
      return formatDistance(manager.update_at, new Date());
    }
    console.log(manager);
    return 'not synced';
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

  actionSyncStatus = manager => {
    const { syncManager } = this.props;
    console.log('manager');
    console.log(manager);
    switch (manager.name) {
      case CUSTOMERS_SYNC:
        return syncManager.loadingSyncCustomer;
      case ALL_PRODUCT_SYNC:
        return syncManager.loadingSyncAllProduct;
      case CUSTOM_PRODUCT_SYNC:
        return syncManager.loadingSyncCustomProducts;
      case GENERAL_CONFIG_SYNC:
        return syncManager.loadingSyncConfig;
      default:
        return null;
    }
  };

  actionToggleShowLogs = type => {
    const { showLogsAction } = this.props;
    showLogsAction({ type, status: true });
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
              <tr
                className={Style.cursorPointer}
                onClick={() => {
                  this.actionToggleShowLogs(ALL_PRODUCT_SYNC);
                }}
              >
                <th scope="row">1</th>
                <td>All products sync</td>
                <td>{this.renderLastTime(syncAllProduct)}</td>
                <td>{this.renderStatusSync(syncAllProduct)}</td>
                <td>
                  {this.actionSyncStatus(syncAllProduct) ? (
                    <div>
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                      Syncing
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        this.syncDataClientAction(ALL_PRODUCT_SYNC);
                      }}
                    >
                      Sync now
                    </button>
                  )}
                </td>
              </tr>
              <tr
                className={Style.cursorPointer}
                onClick={() => {
                  this.actionToggleShowLogs(CUSTOM_PRODUCT_SYNC);
                }}
              >
                <th scope="row">2</th>
                <td>Custom products sync</td>
                <td>{this.renderLastTime(syncCustomProduct)}</td>
                <td>{this.renderStatusSync(syncCustomProduct)}</td>
                <td>
                  {this.actionSyncStatus(syncCustomProduct) ? (
                    <div>
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                      Syncing
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        this.syncDataClientAction(CUSTOM_PRODUCT_SYNC);
                      }}
                    >
                      Sync now
                    </button>
                  )}
                </td>
              </tr>
              <tr
                className={Style.cursorPointer}
                onClick={() => {
                  this.actionToggleShowLogs(CUSTOMERS_SYNC);
                }}
              >
                <th scope="row">4</th>
                <td>Customers sync</td>
                <td>{this.renderLastTime(syncCustomer)}</td>
                <td>{this.renderStatusSync(syncCustomer)}</td>
                <td>
                  {this.actionSyncStatus(syncCustomer) ? (
                    <div>
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                      Syncing
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        this.syncDataClientAction(CUSTOMERS_SYNC);
                      }}
                    >
                      Sync now
                    </button>
                  )}
                </td>
              </tr>
              <tr
                className={Style.cursorPointer}
                onClick={() => {
                  this.actionToggleShowLogs(GENERAL_CONFIG_SYNC);
                }}
              >
                <th scope="row">3</th>
                <td>General config sync</td>
                <td>{this.renderLastTime(syncConfig)}</td>
                <td>{this.renderStatusSync(syncConfig)}</td>

                <td>
                  {this.actionSyncStatus(syncConfig) ? (
                    <div>
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                      Syncing
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={e => {
                        e.stopPropagation();
                        this.syncDataClientAction(GENERAL_CONFIG_SYNC);
                      }}
                    >
                      Sync now
                    </button>
                  )}
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
    getDataSync: () => dispatch(getSyncDataFromLocal()),
    showLogsAction: payload => dispatch(showLogsAction(payload))
  };
}
function mapStateToProps(state) {
  return {
    isShowLogsMessages: state.mainRd.isShowLogsMessages,
    typeShowLogsMessages: state.mainRd.typeShowLogsMessages,
    syncManager: state.authenRd.syncManager
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncManager);
