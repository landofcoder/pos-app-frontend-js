import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../../OrderHistory/order-history.scss';
import { formatCurrencyCode } from '../../../../common/settings';

type Props = {
  listSyncOrder: array
};
class SyncOrderManager extends Component {
  props: Props;

  render() {
    const { listSyncOrder } = this.props;
    return (
      <>
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Id</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Created at</th>
              <th scope="col">Sync</th>
            </tr>
          </thead>
          <tbody>
            {listSyncOrder
              ? listSyncOrder.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      className={Styles.tableRowList}
                      onClick={e => {
                        e.preventDefault();
                      }}
                    >
                      <th scope="row">{index + 1}</th>
                      <td>{item.sales_order_id}</td>
                      <td>{formatCurrencyCode(item.grand_total)}</td>
                      <td>{item.order_status}</td>
                      <td>{item.created_at}</td>
                      <td>
                        {item.local ? (
                          <p className="text-muted">not synced</p>
                        ) : (
                          <></>
                        )}
                      </td>
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
    listSyncOrder: state.authenRd.syncManager.syncOrder
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncOrderManager);
