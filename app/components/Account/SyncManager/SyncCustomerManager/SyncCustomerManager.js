import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../../OrderHistory/order-history.scss';

type Props = {
  ListSyncCustomer: Array
};
class SyncCustomerManager extends Component {
  props: Props;

  render() {
    const { ListSyncCustomer } = this.props;
    console.log(ListSyncCustomer);
    return (
      <>
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Id</th>
              <th scope="col">email</th>
              <th scope="col">fist name</th>
              <th scope="col">last name</th>
            </tr>
          </thead>
          <tbody>
            {ListSyncCustomer
              ? ListSyncCustomer.map((item, index) => {
                  console.log(item);
                  return (
                    <tr key={index} className={Styles.tableRowList}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.id}</td>
                      <td>{item.email}</td>
                      <td>{item.payload.customer.firstname}</td>
                      <td>{item.payload.customer.lastname}</td>
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
    ListSyncCustomer: state.authenRd.syncManager.syncCustomer
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncCustomerManager);
