// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './cash.scss';
import { getDiscountForOfflineCheckout } from '../../../actions/homeAction';
import { sumCartTotalPrice } from '../../../common/cart';

type Props = {
  getDiscountForOfflineCheckout: () => void,
  isLoadingDiscountCheckoutOffline: boolean,
  currencyCode: string,
  cartCurrent: Object,
  offlineCartInfo: Object
};

class CashOffline extends Component<Props> {
  props: Props;

  componentDidMount() {
    const { getDiscountForOfflineCheckout } = this.props;
    getDiscountForOfflineCheckout();
  }

  /**
   * Handle total price
   * @returns {number}
   */
  sumTotalPrice = () => {
    const { cartCurrent, currencyCode } = this.props;
    return sumCartTotalPrice(cartCurrent, currencyCode);
  };

  render() {
    const { isLoadingDiscountCheckoutOffline, offlineCartInfo } = this.props;
    console.log('offline cart info:', offlineCartInfo);
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
                500
              </p>
            )}
          </div>
          <label htmlFor="lblTaxAmount" className="col-sm-4 col-form-label">
            Shipping & Handling
          </label>
          <div className="col-sm-8 pt-1">
            <p className="font-weight-bold" id="lblTaxAmount">
              0
            </p>
          </div>
          <div className={Styles.lineSubTotal} />
          <label htmlFor="staticEmail" className="col-sm-4 col-form-label">
            Order total
          </label>
          <div className="col-sm-8 pt-1">
            <div className="font-weight-bold">
              <p className="font-weight-bold">500</p>
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

function mapDispatchToProps(dispatch) {
  return {
    getDiscountForOfflineCheckout: () =>
      dispatch(getDiscountForOfflineCheckout())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashOffline);
