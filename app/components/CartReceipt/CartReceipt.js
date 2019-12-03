// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemCart } from '../../actions/homeAction';
import style from './cartReceipt.scss';
import { formatCurrencyCode } from '../../common/product';

type Props = {
  cartForReceipt: Array,
  orderPreparingCheckout: Object,
  currencyCode: string
};

class CartReceipt extends Component<Props> {
  props: Props;

  render() {
    const { cartForReceipt, orderPreparingCheckout, currencyCode } = this.props;
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
        <hr />
        <div className="form-group row">
          <label
            htmlFor="receiptLblGrandTotal"
            className="col-sm-4 col-form-label"
          >
            Subtotal
          </label>
          <div className="col-sm-8 text-right">
            <p id="receiptLblGrandTotal" className="font-weight-bold">
              {subTotal}
            </p>
          </div>
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
          <label
            htmlFor="receiptLblDiscountAmount"
            className="col-sm-4 col-form-label"
          >
            Discount
          </label>
          <div className="col-sm-8 text-right">
            <p id="receiptLblDiscountAmount" className="font-weight-bold">
              {discountAmount}
            </p>
          </div>
          <label
            htmlFor="receiptLblOrderTotal"
            className="col-sm-4 col-form-label"
          >
            ORDER TOTAL
          </label>
          <div className="col-sm-8 text-right">
            <p id="receiptLblOrderTotal" className="font-weight-bold">
              {grandTotal}
            </p>
          </div>
        </div>
        <hr />
        <div className="form-group row">
          <label
            htmlFor="receiptLblCashierName"
            className="col-sm-4 col-form-label"
          >
            <span id="receiptLblCashierName">Cashier name: JOHN DOE</span>
          </label>
        </div>
        <hr />
        <p className="font-weight-bold">Thanks for shopping. Keep in touch.</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartForReceipt: state.mainRd.receipt.cartForReceipt.data,
  orderPreparingCheckout: state.mainRd.orderPreparingCheckout,
  currencyCode: state.mainRd.shopInfoConfig[0]
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
