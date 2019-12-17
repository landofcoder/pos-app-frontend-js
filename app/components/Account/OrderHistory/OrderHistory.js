import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './OrderHistory.scss';
import { getOrderHistory } from '../../../actions/accountAction';

type Props = {
  getOrderHistory: () => void,
  isLoading: boolean
};
class OrderHistory extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    const { getOrderHistory } = this.props;
    getOrderHistory();
  }

  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
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
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    isLoading: state.mainRd.isLoadingOrderHistory
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
