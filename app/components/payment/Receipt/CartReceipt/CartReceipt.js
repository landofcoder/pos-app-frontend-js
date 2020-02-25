import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemCart } from '../../../../actions/homeAction';
import style from './cartReceipt.scss';
import { formatCurrencyCode } from '../../../../common/settings';

type Props = {
  cartForReceipt: Array,
  orderPreparingCheckout: Object,
  customReceipt: Object,
  cashierInfo: Object
};

class CartReceipt extends Component<Props> {
  props: Props;

  render() {
    const {
      cartForReceipt,
      orderPreparingCheckout,
      customReceipt,
      cashierInfo
    } = this.props;

    /* eslint-disable-next-line */
    const {
      subtotal_display,
      subtotal_label,
      discount_display,
      discount_label,
      cashier_name_display,
      cashier_label,
      grand_total_label
    } = customReceipt;

    const { totals } = orderPreparingCheckout;
    console.log('totals:', totals);
    const subTotal = formatCurrencyCode(totals.base_subtotal);
    const discountAmount = formatCurrencyCode(totals.discount_amount);
    const shippingAmount = formatCurrencyCode(totals.base_shipping_amount);
    const grandTotal = formatCurrencyCode(totals.grand_total);
    // eslint-disable-next-line no-lone-blocks
    /*eslint-disable*/

    return (
      <div>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ color: '#444', textAlign: 'left' }}>Product</th>
              <th style={{ color: '#444', textAlign: 'left' }}>Quantity</th>
              <th style={{ color: '#444', textAlign: 'right' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {cartForReceipt.map((item, index) => {
              return (
                <tr key={index}>
                  <td style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                    {item.name}
                  </td>
                  <td
                    style={{
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      textAlign: 'left'
                    }}
                  >
                    {item.pos_qty}
                  </td>
                  <td
                    style={{
                      paddingTop: '6px',
                      paddingBottom: '6px',
                      textAlign: 'right'
                    }}
                  >
                    {item.pos_totalPriceFormat}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr />
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }}>Shipping & Handling</td>
              <td style={{ textAlign: 'right' }}>{shippingAmount}</td>
            </tr>
          </tbody>
        </table>

        {Number(subtotal_display) !== 1 ? (
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td>{subtotal_label}</td>
                <td style={{ textAlign: 'right' }}>{subTotal}</td>
              </tr>
              <tr>
                <td>{discount_label}</td>
                <td>{discountAmount}</td>
              </tr>
              <tr>
                <td>{grand_total_label}</td>
                <td>{grandTotal}</td>
              </tr>
              <tr>
                <td>{cashier_label}&nbsp;</td>
                <td>{cashierInfo.first_name}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <></>
        )}
        <hr />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartForReceipt: state.mainRd.receipt.cartForReceipt.data,
  orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout,
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
