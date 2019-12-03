// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cashPlaceOrderAction } from '../../../actions/checkoutActions';
import { updateShowCashModal } from '../../../actions/homeAction';
import Styles from './cash.scss';
import { formatCurrencyCode } from '../../../common/product';

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
      orderPreparingCheckout,
      cashPlaceOrderAction,
      updateShowCashModal,
      isLoadingCashPlaceOrder,
      currencyCode
    } = this.props;
    const grandTotal = formatCurrencyCode(
      orderPreparingCheckout.totals.grand_total,
      currencyCode
    );
    const discountAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.discount_amount,
      currencyCode
    );
    const taxAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.tax_amount,
      currencyCode
    );
    const baseSubTotalWithDiscount = formatCurrencyCode(
      orderPreparingCheckout.totals.base_subtotal_with_discount,
      currencyCode
    );
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
            <div className="form-group row">
              <label htmlFor="staticEmail" className="col-sm-4 col-form-label">
                Subtotal
              </label>
              <div className="col-sm-8 pt-1">
                {cashLoadingPreparingOrder ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <div className="font-weight-bold">
                    <p className="font-weight-bold">{grandTotal}</p>
                  </div>
                )}
              </div>
              <label
                htmlFor="lblDiscountAmount"
                className="col-sm-4 col-form-label"
              >
                Discount
              </label>
              <div className="col-sm-8 pt-1">
                <p className="font-weight-bold" id="lblDiscountAmount">
                  {discountAmount}
                </p>
              </div>
              <label htmlFor="lblTaxAmount" className="col-sm-4 col-form-label">
                Tax Amount
              </label>
              <div className="col-sm-8 pt-1">
                <p className="font-weight-bold" id="lblTaxAmount">
                  {taxAmount}
                </p>
              </div>
              <div className={Styles.lineSubTotal} />
              <label htmlFor="staticEmail" className="col-sm-4 col-form-label">
                Order total
              </label>
              <div className="col-sm-8 pt-1">
                {cashLoadingPreparingOrder ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <div className="font-weight-bold">
                    <p className="font-weight-bold">
                      {baseSubTotalWithDiscount}
                    </p>
                  </div>
                )}
              </div>
            </div>
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
    currencyCode: state.mainRd.shopInfoConfig[0]
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
