import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemCart } from '../../../../actions/homeAction';
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
    let {
      subtotal_display,
      subtotal_label,
      discount_display,
      discount_label,
      cashier_name_display,
      cashier_label,
      grand_total_label
    } = customReceipt;
    // hien tai nen show tat ca cac thong tin cua receipt

    subtotal_display = 1;
    subtotal_label = 'Subtotal';
    discount_display = 1;
    discount_label = 'Discount';
    cashier_name_display = 1;
    cashier_label = 'Cashier';
    grand_total_label = 'Grand total';

    const { totals } = orderPreparingCheckout;
    const subTotal = formatCurrencyCode(totals.base_subtotal);
    const discountAmount = formatCurrencyCode(totals.base_discount_amount);
    const shippingAmount = formatCurrencyCode(totals.base_shipping_amount);
    const grandTotal = formatCurrencyCode(totals.grand_total);

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

        {Number(subtotal_display) === 1 ? (
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>{subtotal_label}</td>
                <td style={{ textAlign: 'right' }}>{subTotal}</td>
              </tr>
            </tbody>
          </table>
        ) : null}
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ textAlign: 'left' }}>Shipping & Handling</td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                {shippingAmount}
              </td>
            </tr>
            {Number(discount_display) === 1 ? (
              <tr>
                <td style={{ textAlign: 'left' }}>{discount_label}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  {discountAmount}
                </td>
              </tr>
            ) : null}
            <tr>
              <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                Grand total
              </td>
              <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                {grandTotal}
              </td>
            </tr>
          </tbody>
        </table>
        {Number(cashier_name_display) === 1 ? (
          <>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'left' }}>{cashier_label}&nbsp;</td>
                  <td style={{ textAlign: 'right' }}>
                    {`${cashierInfo.first_name} ${cashierInfo.last_name}`}
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
          </>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartForReceipt: state.mainRd.receipt.items.cartCurrentResult.data,
  orderPreparingCheckout:
    state.mainRd.receipt.items.orderPreparingCheckoutResult,
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
