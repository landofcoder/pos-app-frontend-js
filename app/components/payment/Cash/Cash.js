import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateShowCashModal,
  toggleModalCalculator,
  cashPlaceOrderAction
} from '../../../actions/homeAction';
import Calculator from '../Calculator/Calculator';
import CashOffline from './CashOffline';
import CashOnline from './CashOnline';

type Props = {
  cashLoadingPreparingOrder: boolean,
  cashPlaceOrderAction: () => void,
  updateShowCashModal: () => void,
  isLoadingCashPlaceOrder: boolean,
  posSystemConfig: Object,
  toggleModalCalculatorStatus: boolean,
  toggleModalCalculator: (payload: boolean) => void
};

class CashPayment extends Component<Props> {
  props: Props;

  toggleModalCalculator = () => {
    const { toggleModalCalculatorStatus, toggleModalCalculator } = this.props;
    toggleModalCalculator(!toggleModalCalculatorStatus);
  };

  render() {
    const {
      cashLoadingPreparingOrder,
      cashPlaceOrderAction,
      updateShowCashModal,
      isLoadingCashPlaceOrder,
      posSystemConfig,
      toggleModalCalculatorStatus
    } = this.props;
    const enableOfflineMode = Number(
      posSystemConfig.general_configuration.enable_offline_mode
    );
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
            {enableOfflineMode === 1 ? <CashOffline /> : <CashOnline />}
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
              disabled={cashLoadingPreparingOrder || isLoadingCashPlaceOrder}
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
                <></>
              )}
              PLACE ORDER
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
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder,
    isLoadingCashPlaceOrder: state.mainRd.isLoadingCashPlaceOrder,
    currencyCode: state.mainRd.shopInfoConfig[0],
    posSystemConfig: state.mainRd.posSystemConfig,
    toggleModalCalculatorStatus: state.mainRd.isOpenCalculator
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
