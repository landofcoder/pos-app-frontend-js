import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalStyle from '../../../styles/modal.scss';
import {
  ALL_PRODUCT_SYNC,
  CUSTOM_PRODUCT_SYNC,
  CUSTOMERS_SYNC,
  GENERAL_CONFIG_SYNC,
  SYNC_ORDER_LIST
} from '../../../../constants/authen.json';
import {
  showLogsAction,
  getDataServiceWithType
} from '../../../../actions/accountAction';
import { getDisplayNameForSyncService } from '../../../../common/sync-group-manager';
import { formatCurrencyCode } from '../../../../common/settings';

type Props = {
  isShowLogsMessages: boolean,
  typeShowLogsMessages: string,
  syncDataManager: object,
  showLogsAction: (payload: Object) => void,
  statusData: object,
  getDataServiceWithType: payload => void
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

  renderStatusSync = manager => {
    if (!manager.update_at) {
      return (
        <span className="badge badge-pill badge-secondary">not synced</span>
      );
    }
    if (manager.errors || !manager.status) {
      return (
        <span className="badge badge-danger badge-pill">
          {manager.errors} errors
        </span>
      );
    }
    return <span className="badge badge-success badge-pill">success</span>;
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
    const { syncDataManager, statusData } = this.props;
    const { stepAt } = syncDataManager;
    let message;
    let syncDataAllProduct = [];
    if (statusData.errors) {
      message = statusData.message || 'Some reason sync all product error !!!';
    }
    if (syncDataManager.id === ALL_PRODUCT_SYNC) {
      syncDataAllProduct = syncDataManager.data;
    }
    if (!syncDataAllProduct.length && !statusData.errors) {
      return (
        <div className="text-success" role="alert">
          <i className="far fa-check-circle" /> &nbsp;
          <span>All Product synced success</span>
        </div>
      );
    }
    const tableAllProduct = syncDataAllProduct.map((item, index) => {
      return (
        <tr
          key={index}
          onClick={() => {
            this.actionCollapseData(index);
          }}
        >
          <th scope="row">{index + 1 + 10 * stepAt}</th>
          <td>{item.name}</td>
          <td>{item.sku}</td>
          <td>{new Date(item.pos_sync_create_at).toLocaleString()}</td>
          <td>{new Date(item.pos_sync_updated_at).toLocaleString()}</td>
        </tr>
      );
    });

    return (
      <>
        {message ? (
          <div className="alert text-danger" role="alert">
            <i
              className="fas fa-exclamation-circle"
              style={{ color: '#666' }}
            />{' '}
            &nbsp;
            {message}
          </div>
        ) : null}
        <div className="card mb-3">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product Name</th>
                <th scope="col">Sku</th>
                <th scope="col">Create at</th>
                <th scope="col">Update at</th>
              </tr>
            </thead>
            <tbody>{tableAllProduct}</tbody>
          </table>
        </div>
      </>
    );
  };

  showPaginate = () => {
    const { typeShowLogsMessages, syncDataManager } = this.props;
    const { stepAt } = syncDataManager;
    let listPage = [];
    // dang ky hien thi dang so trang
    switch (typeShowLogsMessages) {
      case SYNC_ORDER_LIST:
      case ALL_PRODUCT_SYNC:
      case CUSTOMERS_SYNC:
      case CUSTOM_PRODUCT_SYNC:
        break;
      default:
        return;
    }
    if (syncDataManager.data.length < syncDataManager.step && +stepAt === 0) {
      return null;
    }

    // condition for first page
    if (+stepAt === 0) {
      listPage = [+stepAt, +stepAt + 1, +stepAt + 2];
    } else {
      listPage = [+stepAt - 1, +stepAt, +stepAt + 1];
    }
    if (syncDataManager.data.length < syncDataManager.step) {
      listPage = listPage.filter(item => {
        return item <= stepAt;
      });
    }
    return (
      <nav aria-label="...">
        <ul className="pagination" style={{ cursor: 'pointer' }}>
          <li className={`page-item ${+stepAt === 0 ? 'disabled' : null}`}>
            <a
              className="page-link"
              role="presentation"
              onClick={() => this.goDataPage(+stepAt - 1)}
            >
              Previous
            </a>
          </li>
          {listPage.map((item, index) => {
            return (
              <li
                className={`page-item ${+stepAt === item ? 'active' : null}`}
                key={index}
              >
                <a
                  className="page-link"
                  role="presentation"
                  onClick={() => this.goDataPage(item)}
                >
                  {item + 1}
                </a>
              </li>
            );
          })}
          <li
            className={`page-item ${
              syncDataManager.data.length < syncDataManager.step
                ? 'disabled'
                : null
            }`}
          >
            <a
              className="page-link"
              role="presentation"
              onClick={() => this.goDataPage(+stepAt + 1)}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  showTableCustomProduct = () => {
    const { syncDataManager, statusData } = this.props;
    const { stepAt } = syncDataManager;
    let syncDataCustomProduct = [];
    let message;
    if (statusData.errors) {
      message =
        statusData.message || 'Some reason sync all custom product error !!!';
    }
    if (syncDataManager.id === CUSTOM_PRODUCT_SYNC) {
      syncDataCustomProduct = syncDataManager.data;
    }
    if (!syncDataCustomProduct.length && !statusData.errors) {
      return (
        <div className="text-success" role="alert">
          <i className="far fa-check-circle" /> &nbsp;
          <span>All Custom Product synced success</span>
        </div>
      );
    }
    const tableCustomProduct = syncDataCustomProduct.map((item, index) => {
      return (
        <tr
          key={index}
          onClick={() => {
            this.actionCollapseData(index);
          }}
        >
          <th scope="row">{index + 1 + 10 * stepAt}</th>
          <td>{item.name}</td>
          <td>{item.price.regularPrice.amount.value}</td>
          <td>{item.pos_qty}</td>
          <td>{new Date(item.id).toDateString()}</td>
          <td>{this.renderStatusSync(item)}</td>
        </tr>
      );
    });
    return (
      <>
        {message ? (
          <div className="alert text-danger" role="alert">
            <i
              className="fas fa-exclamation-circle"
              style={{ color: '#666' }}
            />{' '}
            &nbsp;
            {message}
          </div>
        ) : null}
        <div className="card mb-3">
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
        </div>
      </>
    );
  };

  showTableCustomer = () => {
    const { syncDataManager, statusData } = this.props;
    const { stepAt } = syncDataManager;
    let syncDataCustomer = [];
    let message;
    if (statusData.errors) {
      message = statusData.message || 'Some reason sync all customer error !!!';
    }
    if (syncDataManager.id === CUSTOMERS_SYNC) {
      syncDataCustomer = syncDataManager.data;
    }
    if (!syncDataCustomer.length && !statusData.errors) {
      return (
        <div className="text-success" role="alert">
          <i className="far fa-check-circle" /> &nbsp;
          <span>All Customer synced success</span>
        </div>
      );
    }
    const tableCustomer = syncDataCustomer.map((item, index) => {
      return (
        <tr
          key={index}
          onClick={() => {
            this.actionCollapseData(index);
          }}
        >
          <th scope="row">{index + 1 + 10 * stepAt}</th>
          <td>{`${item.first_name} ${item.payload.customer.lastname}`}</td>
          <td>{item.email}</td>
          <td>{new Date(item.id).toDateString()}</td>
          <td>{this.renderStatusSync(item)}</td>
        </tr>
      );
    });
    return (
      <>
        {message ? (
          <div className="alert text-danger" role="alert">
            <i
              className="fas fa-exclamation-circle"
              style={{ color: '#666' }}
            />{' '}
            &nbsp;
            {message}
          </div>
        ) : null}
        <div className="card mb-3">
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
        </div>
      </>
    );
  };

  showTableGeneralConfig = () => {
    const { syncDataManager, statusData } = this.props;
    let syncDataConfig = [];
    if (syncDataManager.id === CUSTOMERS_SYNC) {
      syncDataConfig = syncDataManager.data;
    }
    let message;
    if (statusData.errors) {
      message = statusData.message || 'Some reason sync all product error !!!';
      return (
        <div className="alert text-danger" role="alert">
          <i className="fas fa-exclamation-circle" style={{ color: '#666' }} />{' '}
          &nbsp;
          {message}
        </div>
      );
    }

    if (!syncDataConfig.length && !statusData.errors) {
      return (
        <div className="text-success" role="alert">
          <i className="far fa-check-circle" /> &nbsp;
          <span>General config synced success</span>
        </div>
      );
    }
  };

  showTableOrderLocal = () => {
    const { syncDataManager, statusData } = this.props;
    const { stepAt } = syncDataManager;
    let syncDataAllProduct = [];
    let message;
    if (statusData.errors) {
      message = statusData.message || 'Some reason sync all product error !!!';
    }
    if (syncDataManager.id === SYNC_ORDER_LIST) {
      syncDataAllProduct = syncDataManager.data;
    }
    if (!syncDataAllProduct.length && !statusData.errors) {
      return (
        <div className="text-success" role="alert">
          <i className="far fa-check-circle" /> &nbsp;
          <span>All Order synced success</span>
        </div>
      );
    }
    const tableOrderLocal = syncDataAllProduct.map((item, index) => {
      return (
        <tr key={index} style={{ cursor: 'pointer' }}>
          <th scope="row">{index + 1 + 10 * stepAt}</th>
          <td>--</td>
          <td>{formatCurrencyCode(item.grand_total)}</td>
          <td>{new Date(item.created_at).toDateString()}</td>
          <td>{this.renderStatusSync(item)}</td>
        </tr>
      );
    });
    return (
      <>
        {message ? (
          <div className="alert text-danger" role="alert">
            <i
              className="fas fa-exclamation-circle"
              style={{ color: '#666' }}
            />{' '}
            &nbsp;
            {message}
          </div>
        ) : null}
        <div className="card mb-3">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Orders Id</th>
                <th scope="col">Total</th>
                <th scope="col">Create at</th>
                <th scope="col">Sync status</th>
              </tr>
            </thead>
            <tbody>{tableOrderLocal}</tbody>
          </table>
        </div>
      </>
    );
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
      case SYNC_ORDER_LIST:
        return this.showTableOrderLocal();
      default:
        return null;
    }
  };

  goDataPage = payloadStepAt => {
    const {
      getDataServiceWithType,
      typeShowLogsMessages,
      syncDataManager
    } = this.props;
    getDataServiceWithType({
      id: typeShowLogsMessages,
      step: syncDataManager.step,
      stepAt: payloadStepAt
    });
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
            <div className="modal-body">
              {this.showTableLog()}
              {this.showPaginate()}
            </div>
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
    statusData: state.authenRd.syncDataManager.statusData,
    syncManager: state.authenRd.syncManager
  };
}
function mapDispatchToProps(dispatch) {
  return {
    showLogsAction: payload => dispatch(showLogsAction(payload)),
    getDataServiceWithType: payload => dispatch(getDataServiceWithType(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowMessages);
