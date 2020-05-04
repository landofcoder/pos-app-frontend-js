import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showLogsAction } from '../../../../../actions/accountAction';
import { TOOGLE_MODAL_SHOW_SYNC_LOGS } from '../../../../../constants/root.json';
type Props = {
  ListSyncCustomer: Array,
  showLogsAction: (payload: Object) => void
};
type Props = {};
class ShowMessages extends Component {
  props: Props;

  render() {
    return (
      <div>
        <p>helo world</p>
      </div>
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
    showLogsAction: payload => dispatch(showLogsAction(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowMessages);
