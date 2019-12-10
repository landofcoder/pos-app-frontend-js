import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './CashierInfo.scss';
import * as routes from '../../../constants/routes.json';
import {logout} from '../../../actions/authenAction';
import { Redirect } from 'react-router-dom';
type Props = {
  cashierInfo: Object,
  logout: () => void
};

class CashierInfo extends Component<Props> {
  props: Props;
  constructor(props){
    super(props);
    this.state = {redirect: false};
  }
  handleSignOut = () => {
    this.props.logout();
    this.setState({redirect: true});
  }
  render() {
    const { first_name, last_name, phone, email} = this.props.cashierInfo;
    const { redirect } = this.state;
    if(redirect){
      return (
        <Redirect to={routes.LOGIN} />
      )
    }
    return (
      <>
        <div className="container-fluid mt-4">
          <h5 className="card-title">Cashier Information</h5>
          <div>
            <div className={`${Styles.wrapContent} form-group`}>
              <h5 className="card-title">First Name</h5>
              <div className="form-group">
                <input
                  value={first_name}
                  type="text"
                  className="form-control"
                  required
                />
              </div>

              <h5 className="card-title">Last Name</h5>
              <div className="form-group">
                <input
                  value={last_name}
                  type="text"
                  className="form-control"
                  required
                />
              </div>

              <h5 className="card-title">Email Adrdress</h5>
              <div className="form-group">
                <input
                  value={email}
                  type="text"
                  className="form-control"
                  required
                />
              </div>

              <h5 className="card-title">Phone </h5>
              <div className="form-group">
                <input
                  value={phone}
                  type="text"
                  className="form-control"
                  required
                />
              </div>
              <div>
                <button type="button" class="btn btn-danger" onClick={this.handleSignOut}>Sign out</button>
              </div>
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
  }
}
export default connect(
  mapStateToProps, mapDispatchToProps
)(CashierInfo);
