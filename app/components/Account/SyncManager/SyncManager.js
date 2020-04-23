import React, { Component } from 'react';
import { connect } from 'react-redux';
import SyncCustomProductManager from './SyncCustomProductManager/SyncCustomProductManager';
import SyncCustomerManager from './SyncCustomerManager/SyncCustomerManager';
import SyncOrderManager from './SyncOrderManager/SyncOrderManager';
import { syncDataClient } from '../../../actions/homeAction';
import { getListSyncOrder } from '../../../actions/accountAction';
import {
  ALL_PRODUCT_SYNC,
  CUSTOM_PRODUCT_SYNC,
  CUSTOMERS_SYNC,
  GENERAL_CONFIG_SYNC
} from '../../../constants/authen.json';

type Props = {
  syncDataClient: payload => void,
  getListSyncOrder: () => void
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
    const { getListSyncOrder } = this.props;
    getListSyncOrder();
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

  render() {
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
                <td>30 minutes ago</td>
                <td>
                  <span className="badge badge-success badge-pill">
                    success
                  </span>
                </td>
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
                <td>15 minutes ago</td>
                <td>
                  <span className="badge badge-success badge-pill">
                    success
                  </span>
                </td>
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
                <td>20 minutes ago</td>
                <td>
                  <span className="badge badge-danger badge-pill">
                    2 errors
                  </span>
                </td>
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
                <td>a few seconds</td>
                <td>
                  <span className="badge badge-danger badge-pill">
                    2 errors
                  </span>
                </td>
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
    syncDataClient: payload => dispatch(syncDataClient(payload)),
    getListSyncOrder: () => dispatch(getListSyncOrder())
  };
}
export default connect(
  null,
  mapDispatchToProps
)(SyncManager);
