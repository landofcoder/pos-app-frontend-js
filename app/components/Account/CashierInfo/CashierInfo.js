import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { logout } from '../../../actions/authenAction';
import Styles from './CashierInfo.scss';
import * as routes from '../../../constants/routes.json';
type Props = {
  cashierInfo: Object,
  logout: () => void
};

class CashierInfo extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = { redirect: false };
  }

  handleSignOut = () => {
    const { logout } = this.props;
    logout();
    this.setState({ redirect: true });
  };

  render() {
    const { cashierInfo } = this.props;
    const { first_name, last_name, phone, email } = cashierInfo;
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to={routes.LOGIN} />;
    }
    return (
      <>
        <div className="card">
          <h5 className={`card-header`}>Cashier Information</h5>
          <div className={`card-body`}>
            <div className={`form-group`}>
              <p className="card-text font-weight-bold">First Name</p>
              <div className="form-group">
                <label className="">{first_name}</label>
                {/* {<input

                    type="text"
                    className="form-control"
                    required
                  />} */}
              </div>
              <p className="card-text font-weight-bold">Last Name</p>
              <div className="form-group">
                <label className="">{last_name}</label>
                {/* {<input
                    value={last_name}
                    type="text"
                    className="form-control"
                    required
                  />} */}
              </div>
              <p className="card-text font-weight-bold">Email Adrdress</p>
              <div className="form-group">
                <label className="">{email}</label>
                {/* {<input
                    value={email}
                    type="text"
                    className="form-control"
                    required
                  />} */}
              </div>
              <p className="card-text font-weight-bold">Phone</p>
              <div className="form-group">
                <label className="">{phone}</label>
                {/* {<input
                    value={phone}
                    type="text"
                    className="form-control"
                    required
                  />} */}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashierInfo);
