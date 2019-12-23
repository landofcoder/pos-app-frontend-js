import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './OrderHistory.scss';
import { getOrderHistory } from '../../../actions/accountAction';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistory: []
};
class OrderHistory extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { getOrderHistory } = this.props;
    getOrderHistory();
  }

  render() {
    const { isLoading, orderHistory } = this.props;
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    console.log('orderHistoryItems in layout');
    console.log(orderHistory);
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
                <>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.increment_id}</td>
                    <td>
                      {item.items.map(product => (
                        <>
                          <p className="mb-0">{product.name}</p>
                          <p className={Styles.shapeText}>
                            {product.row_total_incl_tax}
                          </p>
                        </>
                      ))}
                    </td>
                    <td>{item.subtotal_incl_tax}</td>
                    <td>{item.status}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
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
    getOrderHistory: () => dispatch(getOrderHistory())
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
