import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalStyle from '../../../styles/modal.scss';
import {
  ALL_PRODUCT_SYNC,
  CUSTOM_PRODUCT_SYNC,
  CUSTOMERS_SYNC,
  GENERAL_CONFIG_SYNC
} from '../../../../constants/authen.json';
import { showLogsAction } from '../../../../actions/accountAction';
import { getDisplayNameForSyncService } from '../../../../common/sync-group-manager';

type Props = {
  isShowLogsMessages: boolean,
  typeShowLogsMessages: string,
  syncDataManager: object,
  syncManager: object,
  showLogsAction: (payload: Object) => void
};
class ShowMessages extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      collapseData: {}
    };
  }

  close = () => {
    const { showLogsAction } = this.props;
    showLogsAction({ status: false });
  };

  actionCollapseData = index => {
    const { collapseData } = this.state;
    if (collapseData[index]) {
      collapseData[index] = !collapseData[index];
    } else {
      collapseData[index] = true;
    }
    this.setState({ collapseData });
  };

  showTitleLog = () => {
    const { typeShowLogsMessages } = this.props;
    return getDisplayNameForSyncService(typeShowLogsMessages);
  };

  showTableAllProduct = () => {
    const { syncManager } = this.props;
    const syncAllProductStatus = syncManager.syncAllProduct;
    if (!syncAllProductStatus.errors) {
      return (
        <div className="text-success" role="alert">
          <i className="far fa-check-circle" /> &nbsp;
          <span>All Product synced success</span>
        </div>
      );
    }
    // get message
    const message =
      syncAllProductStatus.message || 'Some reason sync all product error !!!';

    return (
      <div className="alert text-danger" role="alert">
        <i className="fas fa-exclamation-circle" style={{ color: '#666' }} />{' '}
        &nbsp;
        {message}
      </div>
    );
  };

  showTableCustomProduct = () => {
    const { syncDataManager, syncManager } = this.props;
    const syncConfigStatus = syncManager.syncCustomProduct;
    let syncCustomProduct = [];
    if (syncDataManager.id === 'CUSTOM_PRODUCT_SYNC') {
      syncCustomProduct = syncDataManager.data;
    }
    const tableCustomProduct = syncCustomProduct.map((item, index) => {
      if (item.status) return null;
      return (
        <tr
          key={index}
          onClick={() => {
            this.actionCollapseData(index);
          }}
        >
          <th scope="row">{index + 1}</th>
          <td>{item.name}</td>
          <td>{item.price.regularPrice.amount.value}</td>
          <td>{item.pos_qty}</td>
          <td>{new Date(item.id).toDateString()}</td>
          <td>
            <span className="badge badge-pill badge-danger">error</span>
          </td>
        </tr>
      );
    });
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Custom Product Name</th>
              <th scope="col">Price</th>
              <th scope="col">Q.ty</th>
              <th scope="col">Create at</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{tableCustomProduct}</tbody>
        </table>
      </>
    );
  };

  showTableCustomer = () => {
    const { syncDataManager, syncManager } = this.props;
    const syncCustomerStatus = syncManager.syncCustomer;
    let syncCustomer = [];
    if (syncDataManager.id === 'CUSTOMERS_SYNC') {
      syncCustomer = syncDataManager.data;
    }

    const tableCustomer = syncCustomer.map((item, index) => {
      if (item.status) return null;
      return (
        <tr
          key={index}
          onClick={() => {
            this.actionCollapseData(index);
          }}
        >
          <th scope="row">{index + 1}</th>
          <td>{`${item.first_name} ${item.payload.customer.lastname}`}</td>
          <td>{item.email}</td>
          <td>{new Date(item.id).toDateString()}</td>
          <td>
            <span className="badge badge-pill badge-danger">error</span>
          </td>
        </tr>
      );
    });
    return (
      <>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Email</th>
              <th scope="col">Create at</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{tableCustomer}</tbody>
        </table>
      </>
    );
  };

  showTableGeneralConfig = () => {
    return null;
  };

  showTableLog = () => {
    const { typeShowLogsMessages } = this.props;
    switch (typeShowLogsMessages) {
      case ALL_PRODUCT_SYNC:
        return this.showTableAllProduct();
      case CUSTOM_PRODUCT_SYNC:
        return this.showTableCustomProduct();
      case CUSTOMERS_SYNC:
        return this.showTableCustomer();
      case GENERAL_CONFIG_SYNC:
        return this.showTableGeneralConfig();
      default:
        return null;
    }
  };

  render() {
    const { isShowLogsMessages } = this.props;
    return (
      <div
        className={ModalStyle.modal}
        style={{
          display: isShowLogsMessages ? 'block' : 'none'
        }}
      >
        <div className={ModalStyle.modalContentLg}>
          <div className="modal-content" style={{ backgroundColor: '#F7F8FA' }}>
            <div className="modal-header">
              <h5 className="modal-title">{this.showTitleLog()}</h5>
            </div>
            <div className="modal-body">{this.showTableLog()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  this.close();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isShowLogsMessages: state.mainRd.isShowLogsMessages,
    typeShowLogsMessages: state.mainRd.typeShowLogsMessages,
    syncDataManager: state.authenRd.syncDataManager,
    syncManager: state.authenRd.syncManager
  };
}
function mapDispatchToProps(dispatch) {
  return {
    showLogsAction: payload => dispatch(showLogsAction(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowMessages);
