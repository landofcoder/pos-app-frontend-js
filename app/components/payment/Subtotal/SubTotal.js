import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../Cash/cash.scss';
import { formatCurrencyCode } from '../../../common/settings';
import {
  checkoutAction,
  setDiscountCodeAction,
  setGiftCardAction
} from '../../../actions/homeAction';

type Props = {
  loadingPreparingOrder: boolean,
  orderPreparingCheckout: Object,
  checkoutAction: (payload: string) => void,
  setDiscountCodeAction: (payload: string) => void,
  setGiftCardAction: (payload: Object) => void,
  discountCode: string,
  amountDiscountCode: string,
  initDiscountAmount: number
};

class SubTotal extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      delayTimer: null,
      isShowInputCouponCode: false,
      isShowInputGiftCard: false
    };
  }

  sumOrderTotal = () => {
    const { orderPreparingCheckout } = this.props;
    const grandTotal = orderPreparingCheckout.totals.grand_total;
    return formatCurrencyCode(grandTotal);
  };

  discountCodeAction = event => {
    const { checkoutAction, setDiscountCodeAction } = this.props;
    const { delayTimer } = this.state;
    const code = event.target.value;
    setDiscountCodeAction(code);
    if (delayTimer) clearTimeout(delayTimer);
    const delayTimerRes = setTimeout(() => {
      // Do the ajax stuff
      checkoutAction(code);
    }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
    this.setState({
      delayTimer: delayTimerRes
    });
  };

  giftCardAction = event => {
    const { checkoutAction, setGiftCardAction } = this.props;
    const { delayTimer } = this.state;
    const code = event.target.value;
    setGiftCardAction({ code, id: 0 });
    if (delayTimer) clearTimeout(delayTimer);
    const delayTimerRes = setTimeout(() => {
      // Do the ajax stuff
      checkoutAction(code);
    }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
    this.setState({
      delayTimer: delayTimerRes
    });
  };

  showGiftCard = () => {
    const { isShowInputGiftCard } = this.state;
    // eslint-disable-next-line react/prop-types
    const { giftCardCode } = this.props;
    // const  isCheckValidateCode = !!amountDiscountCode;
    // const isShowValidateCode = !!discountCode;
    if (isShowInputGiftCard) {
      return (
        <div className="input-group mb-3">
          <input
            value={giftCardCode}
            onChange={this.giftCardAction}
            type="text"
            className="form-control"
            aria-label="Text input with dropdown button"
            placeholder="Enter Gift card"
            required
          />
        </div>
      );
    }
    return (
      <>
        <div>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a
            onClick={() => {
              this.setState({ isShowInputGiftCard: true });
            }}
          >
            <i
              style={{ color: '#888' }}
              className="fas fa-plus-circle fa-lg"
            ></i>
          </a>
        </div>
      </>
    );
  };

  showCouponCode = () => {
    const { isShowInputCouponCode } = this.state;
    const { discountCode } = this.props;
    const discountCodeValue = discountCode || '';
    if (isShowInputCouponCode) {
      return (
        <div className="input-group mb-3">
          <input
            value={discountCodeValue}
            onChange={this.discountCodeAction}
            type="text"
            className="form-control"
            aria-label="Text input with dropdown button"
            placeholder="Enter code here"
            required
          />
        </div>
      );
    }
    return (
      <>
        <div>
          <a
            onClick={() => {
              this.setState({ isShowInputCouponCode: true });
            }}
          >
            <i
              style={{ color: '#888' }}
              className="fas fa-plus-circle fa-lg"
            ></i>
          </a>
        </div>
      </>
    );
  };

  render() {
    const {
      loadingPreparingOrder,
      orderPreparingCheckout,
      amountDiscountCode,
      initDiscountAmount
    } = this.props;
    const subTotal = formatCurrencyCode(
      orderPreparingCheckout.totals.base_subtotal
    );

    const shippingAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.base_shipping_amount
    );

    const discountAmount = formatCurrencyCode(
      orderPreparingCheckout.totals.base_discount_amount
    );

    const isCheckValidateCode = !!amountDiscountCode;
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
          <div className="col-sm-7 pt-1">{this.showCouponCode()}</div>
          <div className="col-sm-5 pt-1">
            <p id="lblDiscountAmount">GiftCard</p>
          </div>
          <div className="col-sm-7 pt-1">{this.showGiftCard()}</div>

          <label
            htmlFor="lblDiscountAmount"
            className="col-sm-5 col-form-label"
          >
            Discount
          </label>
          <div className="col-sm-7 pt-1">
            <span className="font-weight-bold" id="lblDiscountAmount">
              {discountAmount}
            </span>
            &nbsp;&nbsp;
            <span>
              <del>
                {isCheckValidateCode
                  ? formatCurrencyCode(initDiscountAmount)
                  : null}
              </del>
            </span>
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
    orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout,
    discountCode:
      state.mainRd.checkout.orderPreparingCheckout.totals.discount_code,
    amountDiscountCode:
      state.mainRd.checkout.orderPreparingCheckout.totals.amount_discount_code,
    initDiscountAmount:
      state.mainRd.checkout.orderPreparingCheckout.totals.init_discount_amount
  };
}

function mapDispatchToProps(dispatch) {
  return {
    checkoutAction: payload => dispatch(checkoutAction(payload)),
    setDiscountCodeAction: payload => dispatch(setDiscountCodeAction(payload)),
    setGiftCardAction: payload => dispatch(setGiftCardAction(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubTotal);
