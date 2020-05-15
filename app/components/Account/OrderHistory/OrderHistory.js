import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { formatDistance } from 'date-fns';
import {
  getOrderHistory,
  toggleModalOrderDetail,
  toggleModalOrderDetailOffline,
  orderAction,
  toggleModalAddNote,
  getOrderHistoryDetail,
  closeToggleModalOrderDetail,
  getSyncAllOrderError
} from '../../../actions/accountAction';
import DetailOrder from './DetailOrder/DetailOrder';
import DetailOrderOffline from './DetailOrderOffline/DetailOrderOffline';
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
  REFUND_ACTION_ORDER
} from '../../../constants/root';
import AddNoteOrder from './AddNoteOrder/AddNoteOrder';
import { syncDataClient } from '../../../actions/homeAction';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistory: array,
  orderHistoryDb: array,
  isOpenDetailOrder: boolean,
  isOpenDetailOrderOffline: boolean,
  isOpenAddNote: boolean,
  toggleModalOrderDetail: object => void,
  toggleModalOrderDetailOffline: object => void,
  orderAction: payload => void,
  getOrderHistoryDetail: id => void,
  orderHistoryDetailOffline: object,
  orderHistoryDetail: object,
  history: payload => void,
  toggleModalAddNote: payload => void,
  syncDataClient: payload => void,
  closeToggleModalOrderDetail: () => void,
  isLoadingSyncAllOrder: boolean,
  getSyncAllOrderError: () => void
};

class OrderHistory extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      intervalGetDataErrorId: null
    };
  }

  componentDidMount(): void {
    const { getOrderHistory, getSyncAllOrderError } = this.props;
    getOrderHistory();
    getSyncAllOrderError();
    const getSyncOrderErrorId = setInterval(getSyncAllOrderError, 3000);
    this.setState({ intervalGetDataErrorId: getSyncOrderErrorId });
  }

  componentWillUnmount(): void {
    const { intervalGetDataErrorId } = this.state;
    clearInterval(intervalGetDataErrorId);
  }

  getOrderHistoryDetail = saleOrderId => {
    const { toggleModalOrderDetail, getOrderHistoryDetail } = this.props;
    toggleModalOrderDetail({ isShow: true, order_id: saleOrderId });
    getOrderHistoryDetail(saleOrderId);
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
    const { isOpenDetailOrder, isOpenDetailOrderOffline } = this.props;
    if (isOpenDetailOrder) return <DetailOrder />;
    if (isOpenDetailOrderOffline) return <DetailOrderOffline />;
    return null;
  };

  isShowingDetailOrder = () => {
    const { orderHistoryDetail, isOpenDetailOrder } = this.props;
    // Object.entries(obj).length > 0 to check in object empty or not
    return Object.entries(orderHistoryDetail).length > 0 && isOpenDetailOrder;
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

  actionDetailOrder = () => {
    const { orderAction, history, isOpenAddNote } = this.props;

    // check have detail order to consider show action detail
    if (this.isShowingDetailOrder() || this.isShowingDetailOrderOffline()) {
      return (
        <>
          {isOpenAddNote ? <AddNoteOrder /> : null}
          <div className="row flex-row-reverse mx-3">
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn btn-block"
                onClick={() => {
                  orderAction({
                    action: PAYMENT_ACTION_ORDER
                  });
                }}
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
              >
                Print
              </button>
            </div>
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn btn-block"
                onClick={() => {
                  orderAction({
                    action: SHIPMENT_ACTION_ORDER
                  });
                }}
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
                  this.noteOrderAction();
                }}
              >
                Note
              </button>
            </div>
            <div className="col-md-3 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-danger btn btn-block"
                disabled={this.isShowingDetailOrder()}
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
                  orderAction({
                    action: REFUND_ACTION_ORDER
                  });
                }}
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

  noteOrderAction = () => {
    const { toggleModalAddNote } = this.props;
    toggleModalAddNote(true);
  };

  render() {
    const {
      orderHistory,
      orderHistoryDb,
      isOpenDetailOrderOffline,
      isOpenDetailOrder,
      isLoading,
      isLoadingSyncAllOrder
    } = this.props;
    return (
      <>
        <div className="row">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Orders Id</th>
                <th scope="col">Total</th>
                <th scope="col">Last time sync</th>
                <th scope="col">Orders status</th>
                <th scope="col">Sync status</th>
                {/*<th scope="col">Action</th>*/}
              </tr>
            </thead>
            <tbody>
              {/*order db*/}
              {orderHistoryDb.map((item, index) => {
                if (item.local) {
                  return (
                    <tr
                      key={index}
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        item.local
                          ? this.getOrderHistoryDetailOffline(item)
                          : this.getOrderHistoryDetail(item.sales_order_id)
                      }
                    >
                      <th scope="row">{index + 1}</th>
                      <td>--</td>
                      <td>{formatCurrencyCode(item.grand_total)}</td>
                      <td>{this.renderLastTime(item)}</td>
                      <td>{item.status ? item.status : '--'}</td>
                      <td>{this.renderStatusSync(item)}</td>
                      {/*<td>*/}
                      {/*  {isLoadingSyncAllOrder ? (*/}
                      {/*    <div>*/}
                      {/*      <div*/}
                      {/*        className="spinner-border spinner-border-sm"*/}
                      {/*        role="status"*/}
                      {/*      >*/}
                      {/*        <span className="sr-only">Loading...</span>*/}
                      {/*      </div>*/}
                      {/*      &nbsp;Syncing*/}
                      {/*    </div>*/}
                      {/*  ) : (*/}
                      {/*    <button*/}
                      {/*      type="button"*/}
                      {/*      className="btn btn-outline-secondary btn-sm"*/}
                      {/*      onClick={e => {*/}
                      {/*        e.stopPropagation();*/}
                      {/*        this.syncDataClientAction(*/}
                      {/*          SYNC_ORDER_LIST,*/}
                      {/*          item.id*/}
                      {/*        );*/}
                      {/*      }}*/}
                      {/*    >*/}
                      {/*      Sync now*/}
                      {/*    </button>*/}
                      {/*  )}*/}
                      {/*</td>*/}
                    </tr>
                  );
                }
              })}
              {/*order service api*/}
              {orderHistory.map((item, index) => {
                if (item.local) {
                  return (
                    <tr
                      key={index}
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        item.local
                          ? this.getOrderHistoryDetailOffline(item)
                          : this.getOrderHistoryDetail(item.sales_order_id)
                      }
                    >
                      <th scope="row">{index + 1}</th>
                      <td>--</td>
                      <td>{formatCurrencyCode(item.grand_total)}</td>
                      <td>{this.renderLastTime(item)}</td>
                      <td>{item.status ? item.status : '--'}</td>
                      <td>{this.renderStatusSync(item)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={e => {
                            e.stopPropagation();
                            this.syncDataClientAction(SYNC_ORDER_LIST, item.id);
                          }}
                        >
                          Sync now
                        </button>
                      </td>
                    </tr>
                  );
                }
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
        </div>
        <div
          className={modalStyle.modal}
          style={{
            display:
              isOpenDetailOrderOffline || isOpenDetailOrder ? 'block' : 'none'
          }}
        >
          <div className={modalStyle.modalContentLg}>
            {/* {isLoading ? ( */}
            {/*  <div className="form-group"> */}
            {/*    <div className="text-center"> */}
            {/*      <div */}
            {/*        className="spinner-border spinner-border-sm text-secondary" */}
            {/*        role="status" */}
            {/*      > */}
            {/*        <span className="sr-only">Loading...</span> */}
            {/*      </div> */}
            {/*    </div> */}
            {/*  </div> */}
            {/* ) : null} */}
            {/* <div className="col-9"> */}
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order receipt</h5>
                <div className="col-md-2 p-0">
                  <button
                    onClick={() => {
                      this.closeOrderHistoryDetail();
                    }}
                    type="button"
                    className="btn btn-outline-dark btn-block"
                  >
                    Close
                  </button>
                </div>
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
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isOpenDetailOrderOffline: state.mainRd.isOpenDetailOrderOffline,
    isOpenAddNote: state.mainRd.isOpenAddNote,
    isLoading: state.mainRd.isLoadingOrderHistory,
    orderHistory: state.mainRd.orderHistory,
    orderHistoryDb: state.authenRd.syncDataManager.syncOrder,
    orderHistoryDetailOffline: state.mainRd.orderHistoryDetailOffline,
    orderHistoryDetail: state.mainRd.orderHistoryDetail,
    isLoadingSyncAllOrder: state.authenRd.syncManager.loadingSyncOrder
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: () => dispatch(getOrderHistory()),
    toggleModalOrderDetail: payload =>
      dispatch(toggleModalOrderDetail(payload)),
    toggleModalOrderDetailOffline: payload =>
      dispatch(toggleModalOrderDetailOffline(payload)),
    getOrderHistoryDetail: id => dispatch(getOrderHistoryDetail(id)),
    orderAction: payload => dispatch(orderAction(payload)),
    toggleModalAddNote: payload => dispatch(toggleModalAddNote(payload)),
    syncDataClient: payload => dispatch(syncDataClient(payload)),
    closeToggleModalOrderDetail: () => dispatch(closeToggleModalOrderDetail()),
    getSyncAllOrderError: () => dispatch(getSyncAllOrderError())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderHistory)
);
