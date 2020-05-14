import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../../OrderHistory/order-history.scss';
import { getSyncAllCustomerError } from '../../../../actions/accountAction';

type Props = {
  ListSyncCustomer: Array,
  getSyncAllCustomerError: payload => void
};
class SyncCustomerManager extends Component {
  props: Props;

  componentDidUpdate() {
    const { getSyncAllCustomerError } = this.props;
    getSyncAllCustomerError();
  }

  render() {
    const { ListSyncCustomer } = this.props;
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
  return {
    getSyncAllCustomerError: dispatch(getSyncAllCustomerError())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncCustomerManager);
