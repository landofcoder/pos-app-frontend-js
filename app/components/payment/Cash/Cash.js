// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cashPlaceOrderAction } from '../../../actions/checkoutActions';
import { updateShowCashModal } from '../../../actions/homeAction';
import CashOffline from './CashOffline';
import CashOnline from './CashOnline';

type Props = {
  cashLoadingPreparingOrder: boolean,
  orderPreparingCheckout: Object,
  cashPlaceOrderAction: () => void,
  updateShowCashModal: () => void,
  isLoadingCashPlaceOrder: boolean,
  currencyCode: string
};

class CashPayment extends Component<Props> {
  props: Props;

  render() {
    const {
      cashLoadingPreparingOrder,
      cashPlaceOrderAction,
      updateShowCashModal,
      isLoadingCashPlaceOrder,
      posSystemConfig
    } = this.props;
    const enableOfflineMode = Number(posSystemConfig.general_configuration.enable_offline_mode);
    return (
      <div>
        <div className="modal-content">
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
            {
              enableOfflineMode === 1 ? <CashOffline/> : <CashOnline/>
            }
          </div>
          <div className="modal-footer">
            <div className="col-md-6 p-0">
              <button
                type="button"
                onClick={() => updateShowCashModal(false)}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                CANCEL
              </button>
            </div>
            <div className="col-md-6 p-0">
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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder,
    orderPreparingCheckout: state.mainRd.orderPreparingCheckout,
    isLoadingCashPlaceOrder: state.mainRd.isLoadingCashPlaceOrder,
    currencyCode: state.mainRd.shopInfoConfig[0],
    posSystemConfig: state.mainRd.posSystemConfig
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cashPlaceOrderAction: () => dispatch(cashPlaceOrderAction()),
    updateShowCashModal: payload => dispatch(updateShowCashModal(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashPayment);
