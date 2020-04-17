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
    // eslint-disable-next-line camelcase
    const { first_name, last_name, phone, email } = cashierInfo;
    return (
      <>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-6">
            <div className="card">
              <h5 className="card-header">Cashier Information</h5>
              <div className="card-body">
                <div className="form-group">
                  <div className="form-group">
                    {/* eslint-disable-next-line camelcase */}
                    <label htmlFor="first_name">First Name:</label>
                    <span id="first_name" className="">
                      {/* eslint-disable-next-line camelcase */}
                      {first_name}
                    </span>
                  </div>
                  <div className="form-group">
                    {/* eslint-disable-next-line camelcase */}
                    <label htmlFor="last_name">Last Name:</label>
                    <span id="last_name" className="">
                      {/* eslint-disable-next-line camelcase */}
                      {last_name}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address:</label>
                    <span id="email" className="">
                      {email}
                    </span>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <span id="phone" className="">
                      {phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={this.handleSignOut}
              >
                Sign out
              </button>
            </div>
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
