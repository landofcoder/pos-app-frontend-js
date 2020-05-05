import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  getOrderHistory,
  toggleModalOrderDetail,
  toggleModalOrderDetailOffline,
  orderAction,
  toggleModalAddNote,
  getOrderHistoryDetail
} from '../../../actions/accountAction';
import DetailOrder from './DetailOrder/DetailOrder';
import DetailOrderOffline from './DetailOrderOffline/DetailOrderOffline';
import Styles from './order-history.scss';
import { formatCurrencyCode } from '../../../common/settings';
import StylesPos from '../../pos.scss';
import types from '../../../constants/routes';
import { SYNC_ORDER_LIST} from '../../../constants/authen.json';
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
  orderHistory: [],
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
};

class OrderHistory extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { getOrderHistory } = this.props;
    getOrderHistory();
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

  actionDetailOrder = () => {
    const { orderAction, history, isOpenAddNote } = this.props;

    // check have detail order to consider show action detail
    if (this.isShowingDetailOrder() || this.isShowingDetailOrderOffline()) {
      return (
        <div>
          {isOpenAddNote ? <AddNoteOrder /> : null}
          <div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn-lg btn-block"
                onClick={() => {
                  orderAction({
                    action: PAYMENT_ACTION_ORDER
                  });
                }}
              >
                Take Payment
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn-lg btn-block"
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
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn-lg btn-block"
                onClick={() => {
                  orderAction({
                    action: PRINT_ACTION_ORDER
                  });
                }}
              >
                Print
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn-lg btn-block"
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
            className={`${StylesPos.wrapActionSecondLine} ${Styles.fixMarginRow} row`}
          >
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn-lg btn-block"
                onClick={() => {
                  this.noteOrderAction();
                }}
              >
                Note
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-danger btn-lg btn-block"
                disabled={this.isShowingDetailOrder()}
                onClick={() => {
                  orderAction({
                    action: CANCEL_ACTION_ORDER
                  });
                }}
              >
                Cancel
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-dark btn-lg btn-block"
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
        </div>
      );
    }
    return null;
  };

  syncDataClientAction = (type,id) => {
    const { syncDataClient } = this.props;
    syncDataClient({ type,id });
  }

  noteOrderAction = () => {
    const { toggleModalAddNote } = this.props;
    toggleModalAddNote(true);
  };

  render() {
    const { orderHistory, isLoading } = this.props;
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
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((item, index) => {
                return (
                  <tr
                    key={index}
                    // onClick={() =>
                    //   item.local
                    //     ? this.getOrderHistoryDetailOffline(item)
                    //     : this.getOrderHistoryDetail(item.sales_order_id)
                    // }
                  >
                    <th scope="row">{index + 1}</th>
                    <td>{item.sales_order_id ? item.sales_order_id : '--'}</td>
                    <td>{formatCurrencyCode(item.grand_total)}</td>
                    <td>{item.created_at ? '5 minutes ago' : ''}</td>
                    <td>{item.order_status ? item.order_status : '--'}</td>
                    <td>
                      {item.local ? (
                        <span className="badge badge-dark badge-pill">
                          Not synced
                        </span>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          this.syncDataClientAction(SYNC_ORDER_LIST,item.id)
                        }}
                      >
                        Sync now
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-12">
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
          <div className="col-9">
            {this.selectDetailOrder()}
            {this.actionDetailOrder()}
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
    orderHistoryDetailOffline: state.mainRd.orderHistoryDetailOffline,
    orderHistoryDetail: state.mainRd.orderHistoryDetail
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
    syncDataClient: payload => dispatch(syncDataClient(payload))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderHistory)
);
