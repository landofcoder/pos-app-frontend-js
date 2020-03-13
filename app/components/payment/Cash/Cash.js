import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateShowCashModal,
  toggleModalCalculator,
  cashPlaceOrderAction,
  messagePlaceOrderError
} from '../../../actions/homeAction';
import Calculator from '../Calculator/Calculator';
import SubTotal from '../Subtotal/SubTotal';
import { formatCurrencyCode } from '../../../common/settings';
import { validateShippingAddress } from '../../../common/customer';

type Props = {
  loadingPreparingOrder: boolean,
  cashPlaceOrderAction: () => void,
  updateShowCashModal: () => void,
  isLoadingCashPlaceOrder: boolean,
  posSystemConfig: Object,
  toggleModalCalculatorStatus: boolean,
  toggleModalCalculator: (payload: boolean) => void,
  orderPreparingCheckout: Object,
  currencyCode: string,
  cartCurrent: Object,
  messageOrderError: string,
  sendMessagePlaceOrderError: payload => void,
  detailOutlet: Object
};

class CashPayment extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      inputCustomerCash: ''
    };
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  changeInputCustomerCash = event => {
    this.setState({ inputCustomerCash: event.target.value });
  };

  calculateNumberString = () => {
    const { inputCustomerCash } = this.state;
    const { orderPreparingCheckout, currencyCode } = this.props;
    try {
      // eslint-disable-next-line no-eval
      const output = eval(
        `${inputCustomerCash}-${orderPreparingCheckout.totals.grand_total}`
      );
      return formatCurrencyCode(output, currencyCode);
    } catch (err) {
      console.log('calculate error');
    }
  };

  considerOrder = () => {
    const {
      loadingPreparingOrder,
      posSystemConfig,
      cartCurrent,
      sendMessagePlaceOrderError,
      detailOutlet
    } = this.props;
    // check validate place order in here
    // If offline mode != 1 check value order
    // if loading don't consider

    if (loadingPreparingOrder) return false;

    const result = validateShippingAddress(
      detailOutlet[0].data,
      posSystemConfig.default_guest_checkout,
      cartCurrent.isGuestCustomer
    );
    if (!result.status) {
      sendMessagePlaceOrderError(result);
      return false;
    }
    if (loadingPreparingOrder === false) return true;
    return false;
  };

  transactionCustomer = () => {
    const { inputCustomerCash } = this.state;
    const { loadingPreparingOrder } = this.props;
    return (
      <div className="form-group row">
        <label
          className="col-sm-12 pt-4 pb-2 col-form-label font-weight-bold"
          htmlFor="inputValue"
        >
          Cash Transaction
        </label>
        <label
          className="col-sm-5 pt-1 pr-0 col-form-label"
          htmlFor="inputValue"
        >
          Customer&apos;s cash recieved
        </label>
        <div className="col-sm-7 pb-1">
          <input
            // ref={input => input && input.focus()}
            type="number"
            placeholder="Input Customer's Cash"
            className="form-control"
            onChange={this.changeInputCustomerCash}
            value={inputCustomerCash}
            id="inputValue"
          />
        </div>
        {inputCustomerCash === '' ? null : (
          <>
            <label htmlFor="inputValue" className="col-sm-4 pt-1">
              Change money
            </label>

            <div className="col-sm-8 pt-1">
              {loadingPreparingOrder ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div className="font-weight-bold">
                  <p className="font-weight-bold">
                    {this.calculateNumberString()}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { updateShowCashModal } = this.props;
      // Hide any modal
      updateShowCashModal(false);
    }
  };

  toggleModalCalculator = () => {
    const { toggleModalCalculatorStatus, toggleModalCalculator } = this.props;
    toggleModalCalculator(!toggleModalCalculatorStatus);
  };

  render() {
    const {
      cashPlaceOrderAction,
      updateShowCashModal,
      isLoadingCashPlaceOrder,
      posSystemConfig,
      toggleModalCalculatorStatus,
      messageOrderError
    } = this.props;
    const enableOfflineMode = Number(
      posSystemConfig.general_configuration.enable_offline_mode
    );

    console.log('enable offline mode:', enableOfflineMode);
    return (
      <div className="row">
        <div
          className={`modal-content ${
            toggleModalCalculatorStatus
              ? 'col-lg-8 col-md-8 col-sm-8 col-8'
              : null
          }`}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="modalCashPayment">
              Checkout
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <SubTotal />
            {this.considerOrder() ? this.transactionCustomer() : null}
            <span className="text-danger">{messageOrderError}</span>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={() => updateShowCashModal(false)}
              className="btn btn-outline-secondary btn-lg btn-block mt-0"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={() => this.toggleModalCalculator()}
              className="btn btn-outline-info btn-lg btn-block mt-0"
            >
              CALCULATOR
            </button>
          </div>
          <div className="modal-footer">
            <button
              onClick={cashPlaceOrderAction}
              disabled={!this.considerOrder() || isLoadingCashPlaceOrder}
              type="button"
              className="btn btn-primary btn-lg btn-block"
            >
              {isLoadingCashPlaceOrder ? (
                <span
                  className="spinner-border spinner-border"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <>PLACE ORDER</>
              )}
            </button>
          </div>
        </div>
        <Calculator />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loadingPreparingOrder: state.mainRd.checkout.loadingPreparingOrder,
    isLoadingCashPlaceOrder: state.mainRd.isLoadingCashPlaceOrder,
    currencyCode: state.mainRd.shopInfoConfig[0],
    posSystemConfig: state.mainRd.posSystemConfig,
    toggleModalCalculatorStatus: state.mainRd.isOpenCalculator,
    orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout,
    messageOrderError: state.mainRd.messageOrderError,
    cartCurrent: state.mainRd.cartCurrent,
    detailOutlet: state.mainRd.detailOutlet
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cashPlaceOrderAction: () => dispatch(cashPlaceOrderAction()),
    updateShowCashModal: payload => dispatch(updateShowCashModal(payload)),
    toggleModalCalculator: payload => dispatch(toggleModalCalculator(payload)),
    sendMessagePlaceOrderError: payload =>
      dispatch(messagePlaceOrderError(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashPayment);
