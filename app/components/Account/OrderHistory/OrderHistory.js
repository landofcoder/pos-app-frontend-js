import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Modal from 'react-modal';
import { formatDistance } from 'date-fns';
import {
  toggleModalOrderDetailOffline,
  orderAction,
  toggleModalActionOrder,
  closeToggleModalOrderDetail,
  getDataServiceWithType
} from '../../../actions/accountAction';
import DetailOrderOffline from './DetailOrderOffline/DetailOrderOffline';
import Close from '../../commons/x';
import Styles from './order-history.scss';
import { formatCurrencyCode } from '../../../common/settings';
import StylesPos from '../../pos.scss';
import modalStyle from '../../styles/modal.scss';
import types from '../../../constants/routes';
import { SYNC_ORDER_LIST } from '../../../constants/authen.json';
import {
  PAYMENT_ACTION_ORDER,
  REORDER_ACTION_ORDER,
  PRINT_ACTION_ORDER,
  SHIPMENT_ACTION_ORDER,
  CANCEL_ACTION_ORDER,
  REFUND_ACTION_ORDER,
  ADD_NOTE_ACTION_ORDER
} from '../../../constants/root';
import DetailOrderAction from './DetailOrderAction/DetailOrderAction';
import { syncDataClient } from '../../../actions/homeAction';

type Props = {
  isLoading: boolean,
  syncDataManager: array,
  getDataServiceWithType: payload => void,
  isOpenDetailOrder: boolean,
  isOpenDetailOrderOffline: boolean,
  isOpenToggleActionOrder: boolean,
  toggleModalOrderDetail: object => void,
  toggleModalOrderDetailOffline: object => void,
  orderAction: payload => void,
  orderHistoryDetailOffline: object,
  history: payload => void,
  toggleModalActionOrder: payload => void,
  syncDataClient: payload => void,
  closeToggleModalOrderDetail: () => void,
  isLoadingSyncAllOrder: boolean,
  getAllOrdersDb: payload => void
};

class OrderHistory extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      intervalGetDataErrorId: null,
      step: 10,
      stepAt: 0
    };
  }

  componentDidMount(): void {
    const { getAllOrdersDb } = this.props;
    const { step, stepAt } = this.state;
    getAllOrdersDb({ id: SYNC_ORDER_LIST, step, stepAt });
    const getAllSyncOrderErrorId = setInterval(() => {
      getAllOrdersDb({ id: SYNC_ORDER_LIST, step, stepAt });
    }, 10000);
    this.setState({ intervalGetDataErrorId: getAllSyncOrderErrorId });
  }

  componentWillUnmount(): void {
    const { intervalGetDataErrorId } = this.state;
    clearInterval(intervalGetDataErrorId);
  }

  getOrderHistoryDetail = saleOrderId => {
    const { toggleModalOrderDetail } = this.props;
    toggleModalOrderDetail({ isShow: true, order_id: saleOrderId });
  };

  getOrderHistoryDetailOffline = dataOrderCheckoutOfflineItem => {
    const { toggleModalOrderDetailOffline } = this.props;
    toggleModalOrderDetailOffline({
      isShow: true,
      dataItem: dataOrderCheckoutOfflineItem
    });
  };

  closeOrderHistoryDetail = () => {
    const { closeToggleModalOrderDetail } = this.props;
    closeToggleModalOrderDetail();
  };

  selectDetailOrder = () => {
    const { isOpenDetailOrderOffline } = this.props;
    if (isOpenDetailOrderOffline) return <DetailOrderOffline />;
    return null;
  };

  isShowingDetailOrderOffline = () => {
    const { orderHistoryDetailOffline, isOpenDetailOrderOffline } = this.props;
    return (
      Object.entries(orderHistoryDetailOffline).length > 0 &&
      isOpenDetailOrderOffline
    );
  };

  renderLastTime = manager => {
    if (manager.update_at) {
      return `${formatDistance(manager.update_at, Date.now())} ago`;
    }
    return 'not synced';
  };

  renderStatusSync = manager => {
    const { isLoadingSyncAllOrder } = this.props;
    if (isLoadingSyncAllOrder)
      return (
        <div>
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          &nbsp;Syncing
        </div>
      );
    if (!manager.update_at) {
      return (
        <span className="badge badge-pill badge-secondary">not synced</span>
      );
    }
    if (!manager.status) {
      return <span className="badge badge-danger badge-pill">error</span>;
    }
    return <span className="badge badge-success badge-pill">success</span>;
  };

  goDataPage = payloadStepAt => {
    const { getDataServiceWithType, syncDataManager } = this.props;
    getDataServiceWithType({
      id: syncDataManager.id,
      step: syncDataManager.step,
      stepAt: payloadStepAt
    });
  };

  showPaginate = () => {
    const { syncDataManager } = this.props;
    const { stepAt, id } = syncDataManager;
    let listPage = [];
    // dang ky hien thi dang so trang
    switch (id) {
      case SYNC_ORDER_LIST:
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
        <ul
          className={`pagination ${Styles.noselect}`}
          style={{ cursor: 'pointer' }}
        >
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

  statusDisableActionOrder = type => {
    const { orderHistoryDetailOffline } = this.props;
    let status;
    ({ status } = orderHistoryDetailOffline);
    status = status === 'complete' || status === 'closed';
    switch (type) {
      case SHIPMENT_ACTION_ORDER:
        return status;
      case PRINT_ACTION_ORDER:
        return false;
      case CANCEL_ACTION_ORDER:
        return status;
      case REFUND_ACTION_ORDER:
        return false;
      case PAYMENT_ACTION_ORDER:
        return status;
      default:
        break;
    }
  };

  actionDetailOrder = () => {
    const { orderAction, history, isOpenToggleActionOrder } = this.props;

    // check have detail order to consider show action detail
    if (this.isShowingDetailOrderOffline()) {
      return (
        <>
          {isOpenToggleActionOrder ? <DetailOrderAction /> : null}
          <div className="row flex-row-reverse mx-3">
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn btn-block"
                onClick={() => {
                  this.toggleOrderAction(PAYMENT_ACTION_ORDER);
                }}
                disabled={this.statusDisableActionOrder(PAYMENT_ACTION_ORDER)}
              >
                Take Payment
              </button>
            </div>
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn btn-block"
                onClick={() => {
                  orderAction({
                    action: REORDER_ACTION_ORDER
                  });
                  history.push(types.POS);
                }}
                disabled={this.statusDisableActionOrder(REORDER_ACTION_ORDER)}
              >
                Reorder
              </button>
            </div>
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn btn-block"
                onClick={() => {
                  orderAction({
                    action: PRINT_ACTION_ORDER
                  });
                }}
                disabled={this.statusDisableActionOrder(PRINT_ACTION_ORDER)}
              >
                Print
              </button>
            </div>
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn btn-block"
                onClick={() => {
                  this.toggleOrderAction(SHIPMENT_ACTION_ORDER);
                }}
                disabled={this.statusDisableActionOrder(SHIPMENT_ACTION_ORDER)}
              >
                Take Shipment
              </button>
            </div>
          </div>
          <div
            className={`${StylesPos.wrapActionSecondLine} row flex-row-reverse mx-3 py-1`}
          >
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn btn-block"
                onClick={() => {
                  this.toggleOrderAction(ADD_NOTE_ACTION_ORDER);
                }}
                disabled={this.statusDisableActionOrder(ADD_NOTE_ACTION_ORDER)}
              >
                Note
              </button>
            </div>
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-danger btn btn-block"
                disabled={this.statusDisableActionOrder(CANCEL_ACTION_ORDER)}
                onClick={() => {
                  orderAction({
                    action: CANCEL_ACTION_ORDER
                  });
                }}
              >
                Cancel Order
              </button>
            </div>
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn btn-block"
                onClick={() => {
                  this.toggleOrderAction(REFUND_ACTION_ORDER);
                }}
                disabled={this.statusDisableActionOrder(REFUND_ACTION_ORDER)}
              >
                Refund
              </button>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  syncDataClientAction = (type, id) => {
    const { syncDataClient } = this.props;
    syncDataClient({ type, id });
  };

  toggleOrderAction = type => {
    const { toggleModalActionOrder } = this.props;
    toggleModalActionOrder({ type, status: true });
  };

  render() {
    const {
      syncDataManager,
      isOpenDetailOrderOffline,
      isOpenDetailOrder,
      isLoading
    } = this.props;

    let orderHistoryDb = [];
    if (syncDataManager.id === 'SYNC_ORDER_LIST') {
      orderHistoryDb = syncDataManager.data;
    }

    return (
      <>
        <div className="row">
          <div className="col-12">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Orders Id</th>
                  <th scope="col">Total</th>
                  <th scope="col">Create at</th>
                  <th scope="col">Last time sync</th>
                  <th scope="col">Orders status</th>
                  <th scope="col">Sync status</th>
                </tr>
              </thead>
              <tbody>
                {orderHistoryDb.map((item, index) => {
                  const { syncData } = item.items;
                  let orderId;
                  let invoiceId;
                  if (syncData) {
                    ({ orderId, invoiceId } = syncData);
                  }
                  return (
                    <tr
                      key={index}
                      style={{ cursor: 'pointer' }}
                      onClick={
                        () =>
                          // item.local
                          this.getOrderHistoryDetailOffline(item)
                        // : this.getOrderHistoryDetail(item.sales_order_id)
                      }
                    >
                      <th scope="row">{index + 1}</th>
                      <td>{orderId || '--'}</td>
                      <td>{formatCurrencyCode(item.grand_total)}</td>
                      <td>{new Date(item.created_at).toDateString()}</td>
                      <td>{this.renderLastTime(item)}</td>
                      <td>
                        {invoiceId || item.status === 'complete' ? (
                          <span className="badge badge-success badge-pill">
                            success
                          </span>
                        ) : (
                          <span className="badge badge-pill badge-secondary">
                            {item.status ? item.status : 'pending'}
                          </span>
                        )}
                      </td>
                      <td>{this.renderStatusSync(item)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {isLoading ? (
              <div className="form-group">
                <div className="text-center">
                  <div
                    className="spinner-border spinner-border-sm text-secondary"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
            ) : null}
            {!orderHistoryDb.length ? (
              <div className="col">
                <div className="alert alert-light text-center" role="alert">
                  No orders found to wait for syncing.
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <Modal
          overlayClassName={modalStyle.Overlay}
          shouldCloseOnOverlayClick
          onRequestClose={this.closeOrderHistoryDetail}
          className={`${modalStyle.Modal}`}
          isOpen={isOpenDetailOrderOffline || isOpenDetailOrder}
          contentLabel="Example Modal"
        >
          <div className={modalStyle.modalContentLg}>
            <div
              className={modalStyle.close}
              role="presentation"
              onClick={this.closeOrderHistoryDetail}
            >
              <Close />
            </div>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order receipt</h5>
              </div>
              <div className={`modal-body ${Styles.toogleContent}`}>
                {this.selectDetailOrder()}
              </div>
              <div
                className={Styles.buttonAction}
                style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: '0',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {this.actionDetailOrder()}
              </div>
            </div>
            {/* </div> */}
          </div>
        </Modal>
        {this.showPaginate()}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isOpenDetailOrderOffline: state.mainRd.isOpenDetailOrderOffline,
    isOpenToggleActionOrder:
      state.mainRd.toggleActionOrder.isOpenToggleActionOrder,
    isLoading: state.mainRd.isLoadingOrderHistory,
    syncDataManager: state.authenRd.syncDataManager,
    orderHistoryDetailOffline: state.mainRd.orderHistoryDetailOffline,
    isLoadingSyncAllOrder: state.authenRd.syncManager.loadingSyncOrder
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleModalOrderDetailOffline: payload =>
      dispatch(toggleModalOrderDetailOffline(payload)),
    orderAction: payload => dispatch(orderAction(payload)),
    toggleModalActionOrder: payload =>
      dispatch(toggleModalActionOrder(payload)),
    syncDataClient: payload => dispatch(syncDataClient(payload)),
    closeToggleModalOrderDetail: () => dispatch(closeToggleModalOrderDetail()),
    getAllOrdersDb: payload => dispatch(getDataServiceWithType(payload)),
    getDataServiceWithType: payload => dispatch(getDataServiceWithType(payload))
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderHistory)
);
