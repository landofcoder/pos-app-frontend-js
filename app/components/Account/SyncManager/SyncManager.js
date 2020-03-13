import React, { Component } from 'react';
import { connect } from 'react-redux';
import SyncCustomProductManager from './SyncCustomProductManager/SyncCustomProductManager';
import SyncCustomerManager from './SyncCustomerManager/SyncCustomerManager';
import SyncOrderManager from './SyncOrderManager/SyncOrderManager';
import { autoSyncGroupCheckout } from '../../../actions/homeAction';
import { getSyncManager } from '../../../actions/accountAction';

type Props = {
  syncStatus: boolean,
  autoSyncGroupCheckout: payload => void,
  getSyncManager: () => void
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
    const { getSyncManager } = this.props;
    getSyncManager();
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
        return <></>;
    }
  };

  syncStartAction = e => {
    const { autoSyncGroupCheckout, getSyncManager } = this.props;
    e.preventDefault();
    autoSyncGroupCheckout(true);
    getSyncManager();
  };

  viewSelectedAction = payload => {
    this.setState({ viewSelected: payload });
  };

  render() {
    const { viewSelected } = this.state;
    const { syncStatus } = this.props;
    console.log(syncStatus);
    return (
      <>
        <div className="row mr-0 ml-0">
          <div className="col-3 p-0">
            <ul className="list-group">
              <li className="list-group-item ">
                <a
                  className={`nav-link  ${
                    viewSelected === 'syncOrder' ? 'active' : ''
                  }`}
                  id="v-pills-profile-tab"
                  data-toggle="pill"
                  href="#"
                  role="tab"
                  aria-controls="v-pills-profile"
                  onClick={e => {
                    e.preventDefault();
                    this.viewSelectedAction('syncOrder');
                  }}
                >
                  Sync Order
                </a>
              </li>
              <li className="list-group-item ">
                <a
                  className={`nav-link  ${
                    viewSelected === 'syncCustomer' ? 'active' : ''
                  }`}
                  id="v-pills-profile-tab"
                  data-toggle="pill"
                  href="#"
                  role="tab"
                  aria-controls="v-pills-profile"
                  onClick={e => {
                    e.preventDefault();
                    this.viewSelectedAction('syncCustomer');
                  }}
                >
                  Sync Customer
                </a>
              </li>
              <li className="list-group-item">
                <a
                  className={`nav-link  ${
                    viewSelected === 'syncCustomProduct' ? 'active' : ''
                  }`}
                  id="v-pills-profile-tab"
                  data-toggle="pill"
                  href="#"
                  role="tab"
                  aria-controls="v-pills-profile"
                  onClick={e => {
                    e.preventDefault();
                    this.viewSelectedAction('syncCustomProduct');
                  }}
                >
                  Sync Custom Product
                </a>
              </li>
            </ul>
            <div className="row form-group mt-2">
              <div className="col-md-1"></div>
              <div className="col-md-5">
                {syncStatus ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></div>
                    <span>&nbsp; Syncing...</span>
                  </>
                ) : (
                  <>
                    <a
                      href="#"
                      onClick={e => {
                        this.syncStartAction(e);
                      }}
                    >
                      <i className="fas fa-sync fa-1x"></i>
                      <span>&nbsp; Not sync yet</span>
                    </a>
                  </>
                )}
              </div>
              <div className="col-md-5"></div>
            </div>
          </div>
          <div className="col-9">
            <div className="card">{this.renderSwitchShowUpSync()}</div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    syncStatus: state.authenRd.syncManager.syncStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    autoSyncGroupCheckout: payload => dispatch(autoSyncGroupCheckout(payload)),
    getSyncManager: () => dispatch(getSyncManager())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncManager);
