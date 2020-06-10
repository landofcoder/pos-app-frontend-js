import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleModalSignUpCustomer,
  changeSignUpLoadingCustomer,
  signUpCustomer,
  toggleModalCustomer
} from '../../../actions/homeAction';
import ModalStyle from '../../styles/modal.scss';
import Close from '../../commons/x';

type Props = {
  toggleModalSignUpCustomer: (payload: object) => void,
  isLoadingSignUpCustomer: boolean,
  changeSignUpLoadingCustomer: (payload: boolean) => void,
  signUpCustomer: (payload: object) => void,
  messageSignUpCustomer: string,
  toggleModalCustomer: (payload: boolean) => void
};
class SignUpCustomer extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      customer: {
        lastname: '',
        firstname: '',
        store_id: 1,
        website_id: 1,
        email: '',
        addresses: []
      },
      password: ''
    };
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);

    // Reset state
    this.setState({
      customer: {
        lastname: '',
        firstname: '',
        store_id: 1,
        website_id: 1,
        email: '',
        addresses: []
      },
      password: ''
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      this.closeCustomerModal();
    }
  };

  closeCustomerModal = () => {
    const { toggleModalSignUpCustomer, toggleModalCustomer } = this.props;
    toggleModalSignUpCustomer(false);

    // Reshow choose customer form
    toggleModalCustomer(true);
  };

  onChangeFirstName = event => {
    const { customer } = this.state;
    customer.firstname = event.target.value;
    this.setState({ customer });
  };

  onChangeLastName = event => {
    const { customer } = this.state;
    customer.lastname = event.target.value;
    this.setState({ customer });
  };

  onChangeEmail = event => {
    const { customer } = this.state;
    customer.email = event.target.value;
    this.setState({ customer });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  handleSignUpAction = event => {
    event.preventDefault();
    const { signUpCustomer } = this.props;
    signUpCustomer(this.state);
  };

  render() {
    const { customer, password } = this.state;
    const { firstname, lastname, email } = customer;
    const { isLoadingSignUpCustomer, messageSignUpCustomer } = this.props;
    return (
      <div>
        <div className={ModalStyle.modalContentMd}>
          <div
            className={ModalStyle.close}
            role="presentation"
            onClick={this.closeCustomerModal}
          >
            <Close />
          </div>
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
                      className="form-control form-control-sm"
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
                      className="form-control form-control-sm"
                      id="inputLastName"
                      value={lastname}
                      onChange={this.onChangeLastName}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="labelInputEmail">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    id="labelInputEmail"
                    value={email}
                    onChange={this.onChangeEmail}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="labelInputPassword">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    id="inputPassword"
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
                <div className="col-md-3 p-0">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-sm"
                    disabled={isLoadingSignUpCustomer}
                  >
                    {isLoadingSignUpCustomer ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        />
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
    toggleModalSignUpCustomer: payload =>
      dispatch(toggleModalSignUpCustomer(payload)),
    changeSignUpLoadingCustomer: payload =>
      dispatch(changeSignUpLoadingCustomer(payload)),
    signUpCustomer: payload => dispatch(signUpCustomer(payload)),
    toggleModalCustomer: payload => dispatch(toggleModalCustomer(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpCustomer);
