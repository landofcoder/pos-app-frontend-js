import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../../OrderHistory/order-history.scss';

type Props = {
  customer: Object,
  ListSyncCustomProduct: Array
};
class SyncCustomProductManager extends Component {
  props: Props;

  render() {
    const { ListSyncCustomProduct } = this.props;
    return (
      <>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              <th scope="col">Tax</th>
            </tr>
          </thead>
          <tbody>
            {ListSyncCustomProduct
              ? ListSyncCustomProduct.map((item, index) => {
                  console.log(item);
                  return (
                    <tr key={index} className={Styles.tableRowList}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>{item.tax}</td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    customer: state.authenRd.syncManager.syncCustomer,
    ListSyncCustomProduct: state.authenRd.syncManager.syncCustomProduct
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncCustomProductManager);
