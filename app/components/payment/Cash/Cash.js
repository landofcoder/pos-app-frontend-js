import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {
  updateShowCashModal,
  toggleModalCalculator,
  cashPlaceOrderAction
} from '../../../actions/homeAction';
import Calculator from '../Calculator/Calculator';
import SubTotal from '../Subtotal/SubTotal';
import { formatCurrencyCode } from '../../../common/settings';
import ModalStyle from '../../styles/modal.scss';
import RewardPoint from '../RewardPoint/RewardPoint';
import Close from '../../commons/x';

type Props = {
  loadingPreparingOrder: boolean,
  cashPlaceOrderAction: () => void,
  updateShowCashModal: () => void,
  isLoadingCashPlaceOrder: boolean,
  toggleModalCalculatorStatus: boolean,
  toggleModalCalculator: (payload: boolean) => void,
  orderPreparingCheckout: Object,
  isShowCashPaymentModel: boolean,
  isShowRewardPoint: boolean,
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
        <div className="col-12">
          <button
            type="button"
            onClick={() => this.toggleModalCalculator()}
            className="btn btn-outline-info btn-sm mt-0"
          >
            CALCULATOR
          </button>
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
      toggleModalCalculatorStatus,
      isShowRewardPoint,
      isShowCashPaymentModel
    } = this.props;
    console.info('reward point flag:', isShowRewardPoint);
    return (
      <Modal
        overlayClassName={ModalStyle.Overlay}
        shouldCloseOnOverlayClick
        onRequestClose={() => updateShowCashModal(false)}
        className={`${ModalStyle.Modal}`}
        isOpen={isShowCashPaymentModel}
        contentLabel="Example Modal"
      >
        <div className="row">
          <div
            className={`${ModalStyle.modalContent} ${
              toggleModalCalculatorStatus ? 'mr-2' : ''
            }`}
          >
            <div
              className={ModalStyle.close}
              onClick={() => updateShowCashModal(false)}
              role="presentation"
            >
              <Close />
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Checkout</h5>
                <SubTotal />
                {this.considerOrder() ? this.transactionCustomer() : null}
              </div>
              <div className="card-footer">
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
          </div>
          <Calculator />
          <RewardPoint />
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    loadingPreparingOrder: state.mainRd.checkout.loadingPreparingOrder,
    isLoadingCashPlaceOrder: state.mainRd.isLoadingCashPlaceOrder,
    toggleModalCalculatorStatus: state.mainRd.isOpenCalculator,
    orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout,
    cartCurrent: state.mainRd.cartCurrent,
    isShowRewardPoint: state.mainRd.checkout.rewardPoint.isShowRewardPoint,
    isShowCashPaymentModel: state.mainRd.checkout.isShowCashPaymentModel
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
