import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {
  toggleModalCustomer,
  searchCustomer,
  selectCustomerForCurrentCart,
  unSelectCustomerForCurrentCart,
  toggleModalSignUpCustomer
} from '../../actions/homeAction';
import Styles from './cart-customer.scss';
import ModalStyle from '../styles/modal.scss';
import Close from '../commons/x';
import SignUpCustomer from './SignUpCustomer/SignUpCustomer';

type Props = {
  customer: Object,
  isOpenFindCustomer: boolean,
  isOpenSignUpCustomer: boolean,
  toggleModalCustomer: (payload: boolean) => void,
  searchCustomer: () => void,
  isLoadingSearchCustomer: boolean,
  customerSearchResult: Array,
  selectCustomerForCurrentCart: (payload: Object) => void,
  unSelectCustomerForCurrentCart: (payload: Object) => void,
  toggleModalSignUpCustomer: (payload: boolean) => void
};

class CartCustomer extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      delayTimer: null,
      searchValue: ''
    };
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { toggleModalCustomer } = this.props;
      // Hide any modal
      toggleModalCustomer(false);
    }
  };

  onSearchCustomer = e => {
    const { searchCustomer } = this.props;
    const { value } = e.target;
    this.setState({ searchValue: value });
    const { delayTimer } = this.state;
    clearTimeout(delayTimer);
    const delayTimerRes = setTimeout(() => {
      // Do the ajax stuff
      searchCustomer(value);
    }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
    this.setState({ delayTimer: delayTimerRes });
  };

  onClose = () => {
    const { toggleModalCustomer } = this.props;
    toggleModalCustomer(false);
  };

  onCloseAddNewCustomer = () => {
    const { toggleModalSignUpCustomer, toggleModalCustomer } = this.props;
    toggleModalSignUpCustomer(false);

    // Reshow choose customer form
    toggleModalCustomer(true);
  };

  /**
   * Show add customer form
   */
  showAddCustomer = () => {
    // Hide choose customer modal and show add customer modal
    const { toggleModalSignUpCustomer, toggleModalCustomer } = this.props;
    toggleModalCustomer(false);
    toggleModalSignUpCustomer(true);
  };

  render() {
    const {
      customer,
      isOpenFindCustomer,
      toggleModalCustomer,
      isLoadingSearchCustomer,
      customerSearchResult,
      selectCustomerForCurrentCart,
      unSelectCustomerForCurrentCart,
      isOpenSignUpCustomer
    } = this.props;
    const { searchValue } = this.state;
    let email = '';
    if (customer) {
      email = customer.email || customer.email;
    }
    return (
      <div>
        <Modal
          overlayClassName={ModalStyle.Overlay}
          shouldCloseOnOverlayClick
          onRequestClose={this.onCloseAddNewCustomer}
          className={`${ModalStyle.Modal}`}
          isOpen={isOpenSignUpCustomer}
          contentLabel="Example Modal"
        >
          <SignUpCustomer />
        </Modal>
        <Modal
          overlayClassName={ModalStyle.Overlay}
          shouldCloseOnOverlayClick
          onRequestClose={this.onClose}
          className={`${ModalStyle.Modal}`}
          isOpen={isOpenFindCustomer}
          contentLabel="Example Modal"
        >
          <div className={ModalStyle.modalContentMd}>
            <div
              className={ModalStyle.close}
              role="presentation"
              onClick={() => toggleModalCustomer(false)}
            >
              <Close />
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Choose customer</h5>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={this.showAddCustomer}
                >
                  Add customer
                </button>
                <div className="mt-2">
                  <div className="form-group">
                    {customer ? (
                      <div className="row">
                        <div className="col-md-6">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                          >
                            {email}
                          </button>
                          <span className={Styles.wrapCloseIcon}>
                            <i
                              role="presentation"
                              onClick={unSelectCustomerForCurrentCart}
                              className="fas fa-times"
                            />
                          </span>
                        </div>
                        <div className="col-md-6" />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control input-sm"
                      value={searchValue}
                      placeholder="Search by customer id, email, first name"
                      aria-label="Recipient's username"
                      onChange={this.onSearchCustomer}
                      aria-describedby="button-addon2"
                    />
                  </div>
                </div>

                {isLoadingSearchCustomer ? (
                  <div className="d-flex justify-content-center">
                    <div
                      className="spinner-border spinner-border-sm text-secondary"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <ul className="list-group">
                    {customerSearchResult.map((item, index) => {
                      return (
                        <button
                          key={index}
                          onClick={() => selectCustomerForCurrentCart(item)}
                          type="button"
                          className="list-group-item list-group-item-action"
                        >
                          <div className="row">
                            <div className="col-6">
                              {item.firstname ||
                                item.payload.customer.firstname}{' '}
                              {item.lastname || item.payload.customer.lastname}
                            </div>
                            <div className="col-6">{item.email}</div>
                          </div>
                        </button>
                      );
                    })}
                    {customerSearchResult.length === 0 &&
                    searchValue.length !== 0 ? (
                      <div>
                        <p className="text-muted text-center">
                          No result found
                        </p>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Modal>
        <button
          type="button"
          className="btn btn-outline-dark btn-block"
          onClick={() => toggleModalCustomer(true)}
        >
          Customer{' '}
          {customer ? `(${customer.firstname || customer.firstname})` : ''}
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: state.mainRd.cartCurrent.customer,
  isOpenFindCustomer: state.mainRd.isOpenFindCustomer,
  isLoadingSearchCustomer: state.mainRd.isLoadingSearchCustomer,
  customerSearchResult: state.mainRd.customerSearchResult,
  isOpenSignUpCustomer: state.mainRd.isOpenSignUpCustomer
});

const mapDispatchToProps = dispatch => {
  return {
    toggleModalCustomer: payload => dispatch(toggleModalCustomer(payload)),
    searchCustomer: payload => dispatch(searchCustomer(payload)),
    selectCustomerForCurrentCart: payload =>
      dispatch(selectCustomerForCurrentCart(payload)),
    unSelectCustomerForCurrentCart: payload =>
      dispatch(unSelectCustomerForCurrentCart(payload)),
    toggleModalSignUpCustomer: payload =>
      dispatch(toggleModalSignUpCustomer(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartCustomer);
