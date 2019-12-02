// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemCart } from '../../actions/homeAction';
import style from './cartReceipt.scss';

type Props = {
  cartForReceipt: Array,
  orderPreparingCheckout: Object
};

class CartReceipt extends Component<Props> {
  props: Props;

  render() {
    const { cartForReceipt, orderPreparingCheckout } = this.props;
    const { totals } = orderPreparingCheckout;
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
                  <td>{item.pos_totalPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <hr />
        <div className="form-group row">
          <label className="col-sm-4 col-form-label">Subtotal</label>
          <div className="col-sm-8 text-right">
            <p className="font-weight-bold">{totals.base_subtotal}</p>
          </div>
          <label className="col-sm-4 col-form-label">Discount</label>
          <div className="col-sm-8 text-right">
            <p className="font-weight-bold">{totals.discount_amount}</p>
          </div>
          <label className="col-sm-4 col-form-label">ORDER TOTAL</label>
          <div className="col-sm-8 text-right">
            <p className="font-weight-bold">
              {totals.base_subtotal_with_discount}
            </p>
          </div>
        </div>
        <hr />
        <div className="form-group row">
          <label className="col-sm-4 col-form-label">
            Cashier name: JOHN DOE
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
  orderPreparingCheckout: state.mainRd.orderPreparingCheckout
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
