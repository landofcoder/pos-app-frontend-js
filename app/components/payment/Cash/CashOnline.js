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

  constructor(props) {
    super(props);
    this.state = {
      inputCustomerCash: ''
    };
  }

  changeInputCustomerCash = event => {
    console.log(event);
    this.setState({ inputCustomerCash: event.target.value });
  };

  filterToNumberString = value => {
    let number = '';
    for (let i = 0; i < value.length; i += 1)
      if ((value[i] >= 0 && value[i] < 10) || value[i] === '.')
        number += value[i];
    return number;
  };

  calculateNumberString = () => {
    const { inputCustomerCash } = this.state;
    const { orderPreparingCheckout, currencyCode } = this.props;
    const grandTotal = formatCurrencyCode(
      orderPreparingCheckout.totals.grand_total,
      currencyCode
    );
    try {
      const output = eval(
        inputCustomerCash + '-' + this.filterToNumberString(grandTotal)
      );
      return output;
    } catch (err) {
      console.log('calculate error');
    }
  };

  render() {
    const {
      orderPreparingCheckout,
      cashLoadingPreparingOrder,
      currencyCode
    } = this.props;
    const { inputCustomerCash } = this.state;
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
          <div className="col-sm-4 pt-1">
            <label htmlFor="staticEmail">Customer's Cash</label>
          </div>
          <div className="col-sm-8 pb-1">
            <input
              type="number"
              placeholder="Input Customer's Cash"
              className="form-control"
              onChange={this.changeInputCustomerCash}
              value={inputCustomerCash}
            />
          </div>
          {/* <div className={Styles.lineSubTotal} /> */}
          {inputCustomerCash === '' ? null : (
            <>
              <div className="col-sm-4 pt-1">
                <label htmlFor="staticEmail">Spare Cash</label>
              </div>

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
                      {this.calculateNumberString()}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder,
    orderPreparingCheckout: state.mainRd.orderPreparingCheckout,
    currencyCode: state.mainRd.shopInfoConfig[0]
  };
}

export default connect(
  mapStateToProps,
  null
)(CashOnline);
