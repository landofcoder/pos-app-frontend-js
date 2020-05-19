import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateShowCashModal,
  toggleModalCalculator,
  cashPlaceOrderAction
} from '../../../actions/homeAction';
import Calculator from '../Calculator/Calculator';
import SubTotal from '../Subtotal/SubTotal';
import { formatCurrencyCode } from '../../../common/settings';

type Props = {
  loadingPreparingOrder: boolean,
  cashPlaceOrderAction: () => void,
  updateShowCashModal: () => void,
  isLoadingCashPlaceOrder: boolean,
  toggleModalCalculatorStatus: boolean,
  toggleModalCalculator: (payload: boolean) => void,
  orderPreparingCheckout: Object,
  currencyCode: string
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
    console.log('run to cash did mount');
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
        `${inputCustomerCash}-${orderPreparingCheckout.totals.grand_total
          .toString()
          .replace('$', '')}`
      );
      return formatCurrencyCode(output, currencyCode);
    } catch (err) {
      console.log('calculate error');
    }
  };

  considerOrder = () => {
    return true;
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
          Money received
        </label>
        <div className="col-sm-7 pb-1">
          <input
            type="number"
            placeholder="Money received"
            className="form-control"
            onChange={this.changeInputCustomerCash}
            value={inputCustomerCash}
            id="inputValue"
          />
        </div>
        {inputCustomerCash === '' ? null : (
          <>
            <label htmlFor="inputValue" className="col-sm-5 pt-1">
              Change money
            </label>

            <div className="col-sm-7 pt-1">
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
      const { updateShowCashModal } = this.props;
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
      toggleModalCalculatorStatus
    } = this.props;
    return (
      <div className="row">
        <div
          className={`modal-content ${
            toggleModalCalculatorStatus
              ? 'col-lg-6 col-md-6 col-sm-6 col-6'
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
          </div>
          <div className="modal-footer">
            <button
              type="button"
              onClick={() => updateShowCashModal(false)}
              className="btn btn-outline-dark btn-block mt-0"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={() => this.toggleModalCalculator()}
              className="btn btn-outline-info btn-block mt-0"
            >
              CALCULATOR
            </button>
          </div>
          <div className="modal-footer">
            <button
              onClick={cashPlaceOrderAction}
              disabled={!this.considerOrder() || isLoadingCashPlaceOrder}
              type="button"
              className="btn btn-primary btn-block"
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
    toggleModalCalculatorStatus: state.mainRd.isOpenCalculator,
    orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout,
    cartCurrent: state.mainRd.cartCurrent
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cashPlaceOrderAction: () => dispatch(cashPlaceOrderAction()),
    updateShowCashModal: payload => dispatch(updateShowCashModal(payload)),
    toggleModalCalculator: payload => dispatch(toggleModalCalculator(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashPayment);
