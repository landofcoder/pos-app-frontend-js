import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './OrderHistory.scss';
import { getOrderHistory } from '../../../actions/accountAction';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean,
  orderHistoryItems: []
};
class OrderHistory extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { getOrderHistory } = this.props;
    getOrderHistory();
  }

  render() {
    const { isLoading, orderHistoryItems } = this.props;
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
    console.log(orderHistoryItems);
    return (
      <>
        <table className="table">
          <thead>
            <tr className={Styles.fixBorderTop}>
              <th scope="col">#</th>
              <th scope="col">Product Name</th>
              <th scope="col">Product Quality</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {orderHistoryItems.map((item, index) => {
              return (
                <>
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
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
    orderHistoryItems: state.mainRd.orderHistory
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getOrderHistory: () => dispatch(getOrderHistory())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderHistory);
