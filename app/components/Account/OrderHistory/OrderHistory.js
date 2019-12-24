import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './OrderHistory.scss';
import { getOrderHistory, getOrderHistoryDetail } from '../../../actions/accountAction';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistory: [],
  getOrderHistoryDetail: (sales_order_id) => void,
};
class OrderHistory extends Component<Props> {
  props: Props;

  getOrderHistoryDetail = (sales_order_id) => {
    const { getOrderHistoryDetail } = this.props;
    getOrderHistoryDetail(sales_order_id);
  }
  componentDidMount(): void {
    const { getOrderHistory } = this.props;
    getOrderHistory();
  }

  render() {
    const { orderHistory, isLoading } = this.props;
    // console.log('orderHistoryItems in layout');
    // console.log(orderHistory);
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
                <tr key={index} className={Styles.tableRowList} onClick={() => this.getOrderHistoryDetail(item.sales_order_id)}>
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
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    isLoading: state.mainRd.isLoadingOrderHistory,
    orderHistory: state.mainRd.orderHistory
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: () => dispatch(getOrderHistory()),
    getOrderHistoryDetail: (index) => dispatch(getOrderHistoryDetail(index)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
