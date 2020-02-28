import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './cash.scss';
import { sumCartTotalPrice } from '../../../common/cart';
import { formatCurrencyCode } from '../../../common/settings';

type Props = {
  isLoadingDiscountCheckoutOffline: boolean,
  currencyCode: string,
  cartCurrent: Object,
  offlineCartInfo: Object
};

class CashOffline extends Component<Props> {
  props: Props;

  /**
   * Handle total price
   * @returns {number}
   */
  sumTotalPrice = () => {
    const { cartCurrent, currencyCode } = this.props;
    return sumCartTotalPrice(cartCurrent, currencyCode);
  };

  sumOrderTotal = () => {
    const { cartCurrent, currencyCode, offlineCartInfo } = this.props;
    const subTotal = sumCartTotalPrice(cartCurrent, currencyCode, false);

    const grandTotal =
      subTotal +
      offlineCartInfo.base_discount_amount -
      offlineCartInfo.shipping_and_tax_amount;
    return formatCurrencyCode(grandTotal, currencyCode);
  };

  render() {
    const {
      isLoadingDiscountCheckoutOffline,
      offlineCartInfo,
      currencyCode
    } = this.props;
    const discountAmount = formatCurrencyCode(
      offlineCartInfo.base_discount_amount,
      currencyCode
    );
    const shippingTaxAndAmount = formatCurrencyCode(
      offlineCartInfo.shipping_and_tax_amount,
      currencyCode
    );
    return (
      <div>
        <div className="form-group row">
          <label htmlFor="staticEmail" className="col-sm-4 col-form-label">
            Subtotal
          </label>
          <div className="col-sm-8 pt-1">
            <div className="font-weight-bold">
              <p className="font-weight-bold"> {this.sumTotalPrice()}</p>
            </div>
          </div>
          <label
            htmlFor="lblDiscountAmount"
            className="col-sm-4 col-form-label"
          >
            Discount
          </label>
          <div className="col-sm-8 pt-1">
            {isLoadingDiscountCheckoutOffline ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <p className="font-weight-bold" id="lblDiscountAmount">
                {discountAmount}
              </p>
            )}
          </div>
          <label htmlFor="lblTaxAmount" className="col-sm-4 col-form-label">
            Shipping & Handling
          </label>
          <div className="col-sm-8 pt-1">
            <p className="font-weight-bold" id="lblTaxAmount">
              {shippingTaxAndAmount}
            </p>
          </div>
          <div className={Styles.lineSubTotal} />
          <label htmlFor="staticEmail" className="col-sm-4 col-form-label">
            Order total
          </label>
          <div className="col-sm-8 pt-1">
            <div className="font-weight-bold">
              <p className="font-weight-bold">{this.sumOrderTotal()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoadingDiscountCheckoutOffline:
      state.mainRd.checkout.offline.isLoadingDiscount,
    offlineCartInfo: state.mainRd.checkout.offline.cartInfo,
    cartCurrent: state.mainRd.cartCurrent,
    currencyCode: state.mainRd.shopInfoConfig[0]
  };
}

export default connect(
  mapStateToProps,
  null
)(CashOffline);
