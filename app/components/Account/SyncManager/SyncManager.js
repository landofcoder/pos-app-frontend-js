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
    console.log(viewSelected);
    return (
      <>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-6">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Cras justo odio
                <span className="badge badge-primary badge-pill">14</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Dapibus ac facilisis in
                <span className="badge badge-primary badge-pill">2</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Morbi leo risus
                <span className="badge badge-primary badge-pill">1</span>
              </li>
            </ul>
          </div>
          <div className="col-md-4"></div>
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
