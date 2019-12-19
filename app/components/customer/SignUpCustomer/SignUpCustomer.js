import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleModalSignUpCustomer,
  changeSignUpLoadingCustomer,
  signUpCustomer
} from '../../../actions/homeAction';
import Styles from './sign-up-customer.scss';
import ModalStyle from '../../styles/modal.scss';

type Props = {
  toggleModalSignUpCustomer: (payload: object) => void,
  isOpenSignUpCustomer: boolean,
  isLoadingSignUpCustomer: boolean,
  changeSignUpLoadingCustomer: (payload: boolean) => void,
  signUpCustomer: (payload: object) => void,
  messageSignUpCustomer: string
};
const initialState = {
  customer: {
    lastname: '',
    firstname: '',
    store_id: 1,
    website_id: 1,
    email: '',
    addresses: []
  },
  password: ''
}
class SignUpCustomer extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = initialState;
  }
  onChangeFirstName = event => {
    let customer = this.state.customer;
    customer.firstname = event.target.value;
    this.setState({ customer: customer });
  };
  onChangeLastName = event => {
    let customer = this.state.customer;
    customer.lastname = event.target.value;
    this.setState({ customer: customer });
  };
  onChangeEmail = event => {
    let customer = this.state.customer;
    customer.email = event.target.value;
    this.setState({ customer: customer });
  };
  // onChangePhone = event => {
  //   if(event.target.value[event.target.value.length - 1] >=0 && +event.target.value[event.target.value.length - 1] <=9 || event.target.value == ''){
  //     this.setState({ password: event.target.value });
  //   }
  // };
  onChangePassword = (event) => {
    this.setState({ password: event.target.value});
  }
  handleSignUpAction = (event) => {
    event.preventDefault();
    const { signUpCustomer } = this.props;
    signUpCustomer(this.state);
  };
  render() {
    const { firstname, lastname, email, password } = this.state;
    const {
      isOpenSignUpCustomer,
      toggleModalSignUpCustomer,
      isLoadingSignUpCustomer,
      messageSignUpCustomer
    } = this.props;
    return (
      <div className={Styles.wrapCartCustomer}>
        <div
          className={ModalStyle.modal}
          style={{ display: isOpenSignUpCustomer ? 'block' : 'none' }}
        >
          <div className={ModalStyle.modalContent}>
            <div className="modal-content">
              <form onSubmit={this.handleSignUpAction}>
                <div className="modal-header">
                  <h5 className="modal-title">Sign up customer</h5>
                </div>
                <div className="modal-body">
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputFirstName">First name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputFirstName"
                        value={firstname}
                        onChange={this.onChangeFirstName}
                        required
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputLastName">Last name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputLastName"
                        value={lastname}
                        onChange={this.onChangeLastName}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputEmail4">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="inputEmail4"
                      value={email}
                      onChange={this.onChangeEmail}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputEmail4">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="inputEmail4"
                      value={password}
                      onChange={this.onChangePassword}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <span className="text-danger">{messageSignUpCustomer}</span>
                  </div>
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
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={isLoadingSignUpCustomer}
                    >
                      {isLoadingSignUpCustomer ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        </>
                      ) : (
                        <>Sign Up</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    isOpenSignUpCustomer: state.mainRd.isOpenSignUpCustomer,
    isLoadingSignUpCustomer: state.mainRd.isLoadingSignUpCustomer,
    messageSignUpCustomer: state.mainRd.messageSignUpCustomer
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleModalSignUpCustomer: () => dispatch(toggleModalSignUpCustomer()),
    changeSignUpLoadingCustomer: payload =>
      dispatch(changeSignUpLoadingCustomer(payload)),
    signUpCustomer: payload => dispatch(signUpCustomer(payload))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUpCustomer);
