import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './cash.scss';
import { formatCurrencyCode } from '../../../common/settings';

type Props = {
  cashLoadingPreparingOrder: boolean,
  orderPreparingCheckout: Object,
  currencyCode: string
};

class CashOnline extends Component<Props> {
  props: Props;

  render() {
    const {
      orderPreparingCheckout,
      cashLoadingPreparingOrder,
      currencyCode
    } = this.props;
    const subTotal = formatCurrencyCode(
      orderPreparingCheckout.totals.base_subtotal,
      currencyCode
    );
    const discountAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.discount_amount,
      currencyCode
    );
    const shippingAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.base_shipping_amount,
      currencyCode
    );
    const grandTotal = formatCurrencyCode(
      orderPreparingCheckout.totals.grand_total,
      currencyCode
    );
    return (
      <>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-4 col-form-label">
            Subtotal
          </label>
          <div className="col-sm-8 pt-1">
            {cashLoadingPreparingOrder ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="font-weight-bold">
                <p className="font-weight-bold">{subTotal}</p>
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
            Shipping & Handling
          </label>
          <div className="col-sm-8 pt-1">
            <p className="font-weight-bold" id="lblTaxAmount">
              {shippingAmount}
            </p>
          </div>
          <div className={Styles.lineSubTotal} />
          <label htmlFor="staticEmail" className="col-sm-4 col-form-label">
            Order total
          </label>
          <div className="col-sm-8 pt-1">
            {cashLoadingPreparingOrder ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="font-weight-bold">
                <p className="font-weight-bold">{grandTotal}</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder,
    orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout,
    currencyCode: state.mainRd.shopInfoConfig[0]
  };
}

export default connect(
  mapStateToProps,
  null
)(CashOnline);
