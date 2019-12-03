// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemCart } from '../../actions/homeAction';
import style from './cartReceipt.scss';

class CartReceipt extends Component<Props> {
  props: Props;

  render() {
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
            <tr>
              <td>Affirm Water Bottle</td>
              <td>1</td>
              <td>$7.00</td>
            </tr>
            <tr>
              <td>Affirm Water Bottle</td>
              <td>1</td>
              <td>$7.00</td>
            </tr>
            <tr>
              <td>Affirm Water Bottle</td>
              <td>1</td>
              <td>$7.00</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div className="form-group row">
          <label className="col-sm-4 col-form-label">Subtotal</label>
          <div className="col-sm-8 text-right">
            <p className="font-weight-bold">$5.00</p>
          </div>
          <label className="col-sm-4 col-form-label">Discount</label>
          <div className="col-sm-8 text-right">
            <p className="font-weight-bold">$3.00</p>
          </div>
          <label className="col-sm-4 col-form-label">GRAND TOTAL</label>
          <div className="col-sm-8 text-right">
            <p className="font-weight-bold">$5.00</p>
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
  cartCurrent: state.mainRd.cartCurrent
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
