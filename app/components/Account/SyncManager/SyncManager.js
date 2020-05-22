import React, { Component } from 'react';
import { formatDistance } from 'date-fns';
import { connect } from 'react-redux';
import { syncDataClient } from '../../../actions/homeAction';
import {
  showLogsAction,
  getDataServiceWithType,
  getSyncStatusFromLocal
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
  syncManager: Object,
  showLogsAction: (payload: Object) => void,
  getSyncStatusFromLocal: () => void,
  getDataServiceWithType: payload => void
};
class SyncManager extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      intervalGetDataErrorId: null
    };
  }

  componentDidMount(): void {
    const { getSyncStatusFromLocal } = this.props;
    getSyncStatusFromLocal();
    const getSyncOrderErrorId = setInterval(getSyncStatusFromLocal, 10000);
    this.setState({ intervalGetDataErrorId: getSyncOrderErrorId });
  }

  componentWillUnmount(): void {
    const { intervalGetDataErrorId } = this.state;
    clearInterval(intervalGetDataErrorId);
  }

  syncDataClientAction = type => {
    const { syncDataClient } = this.props;
    syncDataClient({ type, syncAllNow: true });
  };

  renderLastTime = manager => {
    if (manager.update_at) {
      return `${formatDistance(manager.update_at, Date.now())} ago`;
    }
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
    const { showLogsAction, getDataServiceWithType } = this.props;
    // toggle show log action will get data from local
    getDataServiceWithType(type);
    showLogsAction({ type, status: true });
  };

  render() {
    const { syncManager } = this.props;
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
              {syncManager.length
                ? syncManager.map((item, index) => (
                    <tr
                      key={index}
                      className={Style.cursorPointer}
                      onClick={() => {
                        this.actionToggleShowLogs(item.name);
                      }}
                    >
                      <th scope="row">{index + 1}</th>
                      <td>{item.displayName}</td>
                      <td>{this.renderLastTime(item)}</td>
                      <td>{this.renderStatusSync(item)}</td>
                      <td>
                        {this.actionSyncStatus(item) ? (
                          <div>
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                            &nbsp;Syncing
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={e => {
                              e.stopPropagation();
                              this.syncDataClientAction(item.name);
                            }}
                          >
                            Sync now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    syncDataClient: payload =>
      dispatch(
        syncDataClient({
          type: payload.type,
          id: 'syncManger', // id for special item to sync
          syncAllNow: payload.syncAllNow
        })
      ),
    showLogsAction: payload => dispatch(showLogsAction(payload)),
    getDataServiceWithType: payload =>
      dispatch(getDataServiceWithType(payload)),
    getSyncStatusFromLocal: () => dispatch(getSyncStatusFromLocal())
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
