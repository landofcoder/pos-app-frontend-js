import React, { Component } from 'react';
import { toggleModalSignUpCustomer } from '../../../actions/homeAction.js';
import { connect } from 'react-redux';
import Styles from './sign-up-customer.scss';
import ModalStyle from '../../styles/modal.scss';

type Props = {
  toggleModalSignUpCustomer: (payload: object) => void,
  isOpenSignUpCustomer: boolean
};
class SignUpCustomer extends Component {
  props: Props;
  constructor(props) {
    super(props);
  }
  render() {
    const { isOpenSignUpCustomer, toggleModalSignUpCustomer } = this.props;
    return (
      <div className={Styles.wrapCartCustomer}>
        <div
          className={ModalStyle.modal}
          style={{ display: isOpenSignUpCustomer ? 'block' : 'none' }}
        >
          <div className={ModalStyle.modalContent}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sign up customer</h5>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="inputFirstName">First name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputFirstName"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputLastName">Last name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputLastName"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputEmail4">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="inputEmail4"
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputPassword4">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="inputPassword4"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputConfirmPassword">Confirm Password</label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputConfirmPassword"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="col-md-2 p-0">
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => toggleModalSignUpCustomer(false)}
                  >
                    CLOSE
                  </button>
                </div>
                <div className="col-md-3 p-0">
                  <button type="button" className="btn btn-primary btn-block">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    isOpenSignUpCustomer: state.mainRd.isOpenSignUpCustomer
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleModalSignUpCustomer: () => dispatch(toggleModalSignUpCustomer())
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUpCustomer);
