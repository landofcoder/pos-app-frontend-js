import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getOrderHistory,
  toggleModalOrderDetail
} from '../../../actions/accountAction';
import DetailOrder from './DetailOrder/DetailOrder';
import Styles from './order-history.scss';
import { formatCurrencyCode } from '../../../common/settings';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistory: [],
  isOpenDetailOrder: boolean,
  toggleModalOrderDetail: () => void
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

  render() {
    const { orderHistory, isLoading, isOpenDetailOrder } = this.props;
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
                console.log('log item:', item);
                return (
                  <tr
                    key={index}
                    className={Styles.tableRowList}
                    onClick={() =>
                      this.getOrderHistoryDetail(item.sales_order_id)
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
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isLoading: state.mainRd.isLoadingOrderHistory,
    orderHistory: state.mainRd.orderHistory
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: () => dispatch(getOrderHistory()),
    toggleModalOrderDetail: payload => dispatch(toggleModalOrderDetail(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistory);
