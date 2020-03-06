import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  getOrderHistory,
  toggleModalOrderDetail,
  toggleModalOrderDetailOffline,
  orderAction,
  getOrderHistoryDetail
} from '../../../actions/accountAction';
import DetailOrder from './DetailOrder/DetailOrder';
import DetailOrderOffline from './DetailOrderOffline/DetailOrderOffline';
import Styles from './order-history.scss';
import { formatCurrencyCode } from '../../../common/settings';
import StylesPos from '../../pos.scss';
import types from '../../../constants/routes';
import {
  PAYMENT_ACTION_ORDER,
  REORDER_ACTION_ORDER,
  PRINT_ACTION_ORDER,
  SHIPMENT_ACTION_ORDER,
  CANCEL_ACTION_ORDER,
  REFUND_ACTION_ORDER,
  DETAIL_ORDER_ONLINE,
  DETAIL_ORDER_OFFLINE
} from '../../../constants/root';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistory: [],
  isOpenDetailOrder: boolean,
  isOpenDetailOrderOffline: boolean,
  toggleModalOrderDetail: object => void,
  toggleModalOrderDetailOffline: object => void,
  orderAction: payload => void,
  getOrderHistoryDetail: id => void,
  orderHistoryDetailOffline: object,
  orderHistoryDetail: object,
  history: payload => void
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

  selectKindOfDetail = () => {
    if (this.isShowingDetailOrder()) return DETAIL_ORDER_ONLINE;
    if (this.isShowingDetailOrderOffline()) return DETAIL_ORDER_OFFLINE;
  };

  actionDetailOrder = () => {
    const { orderAction, history } = this.props;

    // check have detail order to consider show action detail
    if (this.isShowingDetailOrder() || this.isShowingDetailOrderOffline()) {
      return (
        <div
          className={`${Styles.wrapOrderAction} ${StylesPos.wrapFooterAction} `}
        >
          <div
            className={`${StylesPos.wrapActionFirstLine} ${Styles.fixMarginRow} row`}
          >
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn-lg btn-block"
                onClick={() => {
                  orderAction({
                    action: PAYMENT_ACTION_ORDER,
                    kindOf: this.selectKindOfDetail()
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
                    action: REORDER_ACTION_ORDER,
                    kindOf: this.selectKindOfDetail()
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
                    action: PRINT_ACTION_ORDER,
                    kindOf: this.selectKindOfDetail()
                  });
                }}
              >
                Print
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg btn-block"
                onClick={() => {
                  orderAction({
                    action: SHIPMENT_ACTION_ORDER,
                    kindOf: this.selectKindOfDetail()
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
                className="btn btn-outline-danger btn-lg btn-block"
                disabled={this.isShowingDetailOrder()}
                onClick={() => {
                  orderAction({
                    action: CANCEL_ACTION_ORDER,
                    kindOf: this.selectKindOfDetail()
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
                    action: REFUND_ACTION_ORDER,
                    kindOf: this.selectKindOfDetail()
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

  render() {
    const { orderHistory, isLoading } = this.props;
    return (
      <>
        <div className={`row mr-0 ml-0 ${Styles.wrapOrderHistory}`}>
          <div className="col-3 p-0">
            <div className={`card ${Styles.wrapListOrder}`}>
              {isLoading ? (
                <div className="form-group mt-3">
                  <div className="text-center">
                    <div
                      className="spinner-border text-secondary"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              ) : null}
              <table className="table">
                <thead>
                  <tr className={Styles.fixBorderTop}>
                    <th scope="col">#</th>
                    <th scope="col">Id</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created at</th>
                    <th scope="col">Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={Styles.tableRowList}
                        onClick={() =>
                          item.local
                            ? this.getOrderHistoryDetailOffline(item)
                            : this.getOrderHistoryDetail(item.sales_order_id)
                        }
                      >
                        <th scope="row">{index + 1}</th>
                        <td>{item.sales_order_id}</td>
                        <td>{formatCurrencyCode(item.grand_total)}</td>
                        <td>{item.order_status}</td>
                        <td>{item.created_at}</td>
                        <td>
                          {item.local ? (
                            <p className="text-muted">Not synced</p>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
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
    orderAction: payload => dispatch(orderAction(payload))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderHistory)
);
