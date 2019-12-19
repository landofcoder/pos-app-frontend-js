import React, { Component } from 'react';
import { toggleModalSignInCustomer } from '../../../actions/homeAction.js';
import { connect } from 'react-redux';
import Styles from './sign-in-customer.scss';
import ModalStyle from '../../styles/modal.scss';

type Props = {
  toggleModalSignInCustomer: (payload: object) => void,
  isOpenSignInCustomer: boolean
};
class SignInCustomer extends Component {
  props: Props;
  constructor(props) {
    super(props);
  }
  render() {
    const { isOpenSignInCustomer, toggleModalSignInCustomer } = this.props;
    return (
      <div className={Styles.wrapCartCustomer}>
        <div
          className={ModalStyle.modal}
          style={{ display: isOpenSignInCustomer ? 'block' : 'none' }}
        >
          <div className={ModalStyle.modalContent}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sign up customer</h5>
              </div>
              <div className="modal-body">
                <form>
                  <div class="form-group">
                    <label for="inputFirstName">First name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="inputFirstName"
                    />
                  </div>
                  <div class="form-group">
                    <label for="inputLastName">Last name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="inputLastName"
                    />
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="inputEmail4">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        id="inputEmail4"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="inputPassword4">Password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="inputPassword4"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputConfirmPassword">Confirm Password</label>
                    <input
                      type="text"
                      class="form-control"
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
                    onClick={() => toggleModalSignInCustomer(false)}
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
    isOpenSignInCustomer: state.mainRd.isOpenSignInCustomer
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleModalSignInCustomer: () => dispatch(toggleModalSignInCustomer())
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SignInCustomer);
