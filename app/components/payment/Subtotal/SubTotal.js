import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../Cash/cash.scss';
import { formatCurrencyCode } from '../../../common/settings';

type Props = {
  loadingPreparingOrder: boolean,
  orderPreparingCheckout: Object
};

class SubTotal extends Component<Props> {
  props: Props;

  sumOrderTotal = () => {
    const { orderPreparingCheckout } = this.props;
    const subTotal = orderPreparingCheckout.totals.base_subtotal;

    const shippingAmount = orderPreparingCheckout.totals.base_shipping_amount;
    const discountAmount = orderPreparingCheckout.totals.base_discount_amount;

    console.log('dd0::', orderPreparingCheckout);
    console.log('dd1:', subTotal);
    console.log('dd2:', shippingAmount);
    console.log('dd3:', discountAmount);

    const grandTotal = orderPreparingCheckout.totals.grand_total;
    return formatCurrencyCode(grandTotal);
  };

  render() {
    const { loadingPreparingOrder, orderPreparingCheckout } = this.props;
    const subTotal = formatCurrencyCode(
      orderPreparingCheckout.totals.base_subtotal
    );

    const shippingAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.base_shipping_amount
    );

    const discountAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.base_discount_amount
    );
    return (
      <div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-5 col-form-label">
            Subtotal
          </label>
          <div className="col-sm-7 pt-1">
            {loadingPreparingOrder ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="font-weight-bold">
                <p className="font-weight-bold">{subTotal}</p>
              </div>
            )}
          </div>
          <div className="col-sm-5 pt-1">
            <p id="lblDiscountAmount">Coupon code</p>
          </div>
          <div className="col-sm-7 pt-1">
            <input
              type="text"
              placeholder="Enter code here"
              className="form-control"
            />
          </div>
          <label
            htmlFor="lblDiscountAmount"
            className="col-sm-5 col-form-label"
          >
            Discount
          </label>
          <div className="col-sm-7 pt-1">
            <p className="font-weight-bold" id="lblDiscountAmount">
              {discountAmount}
            </p>
          </div>
          <label htmlFor="lblTaxAmount" className="col-sm-5 col-form-label">
            Shipping & Handling
          </label>
          <div className="col-sm-7 pt-1">
            <p className="font-weight-bold" id="lblTaxAmount">
              {shippingAmount}
            </p>
          </div>
          <div className={Styles.lineSubTotal} />
          <label htmlFor="staticEmail" className="col-sm-5 col-form-label">
            Order total
          </label>
          <div className="col-sm-7 pt-1">
            {loadingPreparingOrder ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="font-weight-bold">
                <p className="font-weight-bold">{this.sumOrderTotal()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loadingPreparingOrder: state.mainRd.checkout.loadingPreparingOrder,
    orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout
  };
}

export default connect(
  mapStateToProps,
  null
)(SubTotal);
