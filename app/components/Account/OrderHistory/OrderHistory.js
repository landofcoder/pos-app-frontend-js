import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getOrderHistory,
  toggleModalOrderDetail
} from '../../../actions/accountAction';
import DetailOrder from './DetailOrder/DetailOrder';
import Styles from './order-history.scss';
type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistory: [],
  getOrderHistoryDetail: sales_order_id => void,
  isOpenDetailOrder: boolean
};
class OrderHistory extends Component<Props> {
  props: Props;

  getOrderHistoryDetail = sales_order_id => {
    const { toggleModalOrderDetail } = this.props;
    toggleModalOrderDetail({ isShow: true, order_id: sales_order_id });
  };
  componentDidMount(): void {
    const { getOrderHistory } = this.props;
    getOrderHistory();
  }

  render() {
    const { orderHistory, isLoading, isOpenDetailOrder } = this.props;
    console.log(isOpenDetailOrder);
    return (
      <>
        <table className="table">
          <thead>
            <tr className={Styles.fixBorderTop}>
              <th scope="col">#</th>
              <th scope="col">Id</th>
              <th scope="col">Product Name</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={Styles.tableRowList}
                  onClick={() =>
                    this.getOrderHistoryDetail(item.sales_order_id)
                  }
                >
                  <th scope="row">{index + 1}</th>
                  <td>{item.increment_id}</td>
                  <td>
                    {item.items === undefined
                      ? null
                      : item.items.map(product => (
                          <>
                            <p className="mb-0">{product.name}</p>
                            <p className={`mb-0 ${Styles.shapeText}`}>
                              1 Unit(s) at ${product.price_incl_tax}/Unit
                            </p>
                            <p className={Styles.shapeText}>
                              ${product.row_total_incl_tax}
                            </p>
                          </>
                        ))}
                  </td>
                  <td>${item.subtotal_incl_tax}</td>
                  <td>{item.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5 mb-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : null}
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
