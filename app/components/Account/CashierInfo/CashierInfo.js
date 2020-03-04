import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { logout } from '../../../actions/authenAction';
import * as routes from '../../../constants/routes.json';

type Props = {
  cashierInfo: Object,
  logout: () => void,
  history: payload => void
};

class CashierInfo extends Component<Props> {
  props: Props;

  handleSignOut = () => {
    const { logout, history } = this.props;
    logout();
    history.push(routes.POS);
  };

  render() {
    const { cashierInfo } = this.props;
    const { first_name, last_name, phone, email } = cashierInfo;
    return (
      <>
        <div className="card">
          <h5 className="card-header">Cashier Information</h5>
          <div className="card-body">
            <div className="form-group">
              <p className="card-text font-weight-bold">First Name</p>
              <div className="form-group">
                <label className="">{first_name}</label>
              </div>
              <p className="card-text font-weight-bold">Last Name</p>
              <div className="form-group">
                <label className="">{last_name}</label>
              </div>
              <p className="card-text font-weight-bold">Email Adrdress</p>
              <div className="form-group">
                <label className="">{email}</label>
              </div>
              <p className="card-text font-weight-bold">Phone</p>
              <div className="form-group">
                <label className="">{phone}</label>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-body">
            <button
              type="button"
              className="btn btn-danger"
              onClick={this.handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    cashierInfo: state.authenRd.cashierInfo
  };
}
function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  };
}
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CashierInfo)
);
