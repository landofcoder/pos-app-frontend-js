// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemCart } from '../../../../actions/homeAction';
import style from './cartReceipt.scss';
import { formatCurrencyCode } from '../../../../common/product';

type Props = {
  cartForReceipt: Array,
  orderPreparingCheckout: Object,
  currencyCode: string,
  customReceipt: Object,
  cashierInfo: Object
};

class CartReceipt extends Component<Props> {
  props: Props;

  render() {
    const {
      cartForReceipt,
      orderPreparingCheckout,
      currencyCode,
      customReceipt,
      cashierInfo
    } = this.props;

    /* eslint-disable-next-line */
    const { subtotal_display, subtotal_label, discount_display, discount_label, cashier_name_display, cashier_label, grand_total_label } = customReceipt;

    const { totals } = orderPreparingCheckout;
    const subTotal = formatCurrencyCode(totals.base_subtotal, currencyCode);
    const discountAmount = formatCurrencyCode(
      totals.discount_amount,
      currencyCode
    );
    const shippingAmount = formatCurrencyCode(
      totals.base_shipping_amount,
      currencyCode
    );
    const grandTotal = formatCurrencyCode(totals.grand_total, currencyCode);
    // eslint-disable-next-line no-lone-blocks
    /*eslint-disable*/

    console.log('grand total label:', grand_total_label);

    return (
      <div className={style.wrapCartReceipt}>
        <table>
          <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          {cartForReceipt.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.pos_qty}</td>
                <td>{item.pos_totalPriceFormat}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
        <hr/>
        <div className="form-group row">
          {Number(subtotal_display) === 1 ? (
            <>
              <label
                htmlFor="receiptLblGrandTotal"
                className="col-sm-4 col-form-label"
              >
                {subtotal_label}
              </label>
              <div className="col-sm-8 text-right">
                <p id="receiptLblGrandTotal" className="font-weight-bold">
                  {subTotal}
                </p>
              </div>
            </>
          ) : (
            <></>
          )}

          <label
            htmlFor="receiptLblGrandTotal"
            className="col-sm-4 col-form-label"
          >
            Shipping & Handling
          </label>
          <div className="col-sm-8 text-right">
            <p id="receiptLblGrandTotal" className="font-weight-bold">
              {shippingAmount}
            </p>
          </div>

          {
            Number(discount_display) === 1 ? <>
              <label
                htmlFor="receiptLblDiscountAmount"
                className="col-sm-4 col-form-label"
              >
                {discount_label}
              </label>
              <div className="col-sm-8 text-right">
                <p id="receiptLblDiscountAmount" className="font-weight-bold">
                  {discountAmount}
                </p>
              </div>
            </> : <></>
          }
          <label
            htmlFor="receiptLblOrderTotal"
            className="col-sm-4 col-form-label"
          >
            {grand_total_label}
          </label>
          <div className="col-sm-8 text-right">
            <p id="receiptLblOrderTotal" className="font-weight-bold">
              {grandTotal}
            </p>
          </div>
        </div>
        <hr/>
          {
            Number(cashier_name_display) === 1 ?
              <>
              <div className="form-group row">
                <label
                  htmlFor="receiptLblCashierName"
                  className="col-sm-12 col-form-label"
                >
                  <span id="receiptLblCashierName">{cashier_label}&nbsp;</span>
                  <span>{cashierInfo.first_name}</span>
                </label>
              </div>
                <hr/>
              </> : <></>
          }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartForReceipt: state.mainRd.receipt.cartForReceipt.data,
  orderPreparingCheckout: state.mainRd.orderPreparingCheckout,
  currencyCode: state.mainRd.shopInfoConfig[0],
  customReceipt: state.mainRd.customReceipt,
  cashierInfo: state.authenRd.cashierInfo
});

const mapDispatchToProps = dispatch => {
  return {
    deleteItemCart: payload => dispatch(deleteItemCart(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartReceipt);
