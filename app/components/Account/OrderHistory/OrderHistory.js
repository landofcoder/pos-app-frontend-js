import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getOrderHistory,
  toggleModalOrderDetail,
  toggleModalOrderDetailOffline
} from '../../../actions/accountAction';
import DetailOrder from './DetailOrder/DetailOrder';
import DetailOrderOffline from './DetailOrderOffline/DetailOrderOffline';
import Styles from './order-history.scss';
import { formatCurrencyCode } from '../../../common/settings';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistory: [],
  isOpenDetailOrder: boolean,
  isOpenDetailOrderOffline: boolean,
  toggleModalOrderDetail: object => void,
  toggleModalOrderDetailOffline: object => void
};

class OrderHistory extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { getOrderHistory } = this.props;
    getOrderHistory();
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

  render() {
    const {
      orderHistory,
      isLoading,
      isOpenDetailOrder,
      isOpenDetailOrderOffline
    } = this.props;
    return (
      <>
        <div className="card">
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border text-secondary" role="status">
                <span className="sr-only">Loading...</span>
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
        {isOpenDetailOrder ? <DetailOrder /> : null}
        {isOpenDetailOrderOffline ? <DetailOrderOffline /> : null}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isOpenDetailOrderOffline: state.mainRd.isOpenDetailOrderOffline,
    isLoading: state.mainRd.isLoadingOrderHistory,
    orderHistory: state.mainRd.orderHistory
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: () => dispatch(getOrderHistory()),
    toggleModalOrderDetail: payload =>
      dispatch(toggleModalOrderDetail(payload)),
    toggleModalOrderDetailOffline: payload =>
      dispatch(toggleModalOrderDetailOffline(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistory);
