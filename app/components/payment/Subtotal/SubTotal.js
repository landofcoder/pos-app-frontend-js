import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../Cash/cash.scss';
import { formatCurrencyCode } from '../../../common/settings';
import {
  getDiscountCodeAction,
  setDiscountCodeAction,
  spendAmountRewardPointAction
} from '../../../actions/homeAction';

type Props = {
  loadingPreparingOrder: boolean,
  orderPreparingCheckout: Object,
  getDiscountCodeAction: (payload: string) => void,
  setDiscountCodeAction: (payload: string) => void,
  discountCode: string,
  amountDiscountCode: string,
  initDiscountAmount: number,
  earn_points: string,
  totalRewardPointCustomer: string,
  spendAmountRewardPointAction: (payload: string) => void
};

class SubTotal extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      delayTimer: null,
      isShowInputCouponCode: false,
      usePointValue: 0,
      isShowUsePoint: false,
      delayTimerRewardInput: null
    };
  }

  usePointAction = e => {
    const totalRewardPointCustomer = this.props;
    const { delayTimerRewardInput } = this.state;
    const { value } = e.target;
    if (+value <= totalRewardPointCustomer) {
      this.setState({ usePointValue: value });
      if (delayTimerRewardInput) clearTimeout(delayTimerRewardInput);
      const delayTimerRes = setTimeout(() => {
        // Do the ajax stuff
        spendAmountRewardPointAction(value);
      }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
      this.setState({
        delayTimerRewardInput: delayTimerRes
      });
    }
  };

  showRewardPointModule = () => {
    const {
      earn_points,
      loadingPreparingOrder,
      totalRewardPointCustomer
    } = this.props;
    const { usePointValue, isShowUsePoint } = this.state;
    return (
      <>
        {totalRewardPointCustomer >= 0 ? (
          <>
            <label htmlFor="staticEmail" className="col-sm-5 col-form-label">
              <p className="text-secondary font-weight-bold">
                Use Customer's points
              </p>
            </label>
            <label htmlFor="staticEmail" className="col-sm-6 col-form-label">
              <a
                onClick={() => {
                  this.setState({ isShowUsePoint: true });
                }}
              >
                <i
                  style={{ color: '#888', cursor: 'pointer' }}
                  className="fas fa-plus-circle fa-lg cursor-pointer"
                ></i>
              </a>
            </label>
            {isShowUsePoint ? (
              <div className="col-12 form-group">
                <div className="row">
                  <div className="col-5 ">
                    <label htmlFor="customRange2">Use Reward Point</label>
                  </div>
                  <div className="col-7">
                    <input
                      type="number"
                      className="form-control"
                      id="customRange2"
                      onChange={this.usePointAction}
                      value={usePointValue}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
        {!!earn_points && !loadingPreparingOrder ? (
          <>
            <label htmlFor="staticEmail" className="col-sm-5">
              <p className="text-secondary">Earning point total</p>
            </label>
            <label htmlFor="staticEmail" className="col-sm-7">
              <p className="text-secondary">{earn_points}</p>
            </label>
          </>
        ) : null}
      </>
    );
  };

  sumOrderTotal = () => {
    const { orderPreparingCheckout } = this.props;
    const subTotal = orderPreparingCheckout.totals.base_subtotal;

    const shippingAmount = orderPreparingCheckout.totals.base_shipping_amount;
    const discountAmount = orderPreparingCheckout.totals.base_discount_amount;

    console.log('dd0::', orderPreparingCheckout);
    console.log('dd1:', subTotal);
    console.log('dd2:', shippingAmount);
    console.log('dd3:', discountAmount);

    const grandTotal = orderPreparingCheckout.totals.grand_total;
    return formatCurrencyCode(grandTotal);
  };

  discountCodeAction = event => {
    const { getDiscountCodeAction, setDiscountCodeAction } = this.props;
    const { delayTimer } = this.state;
    const code = event.target.value;
    setDiscountCodeAction(code);
    if (delayTimer) clearTimeout(delayTimer);
    const delayTimerRes = setTimeout(() => {
      // Do the ajax stuff
      getDiscountCodeAction(code);
    }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
    this.setState({
      delayTimer: delayTimerRes
    });
  };

  showCouponCode = () => {
    const { isShowInputCouponCode } = this.state;
    const { discountCode, amountDiscountCode } = this.props;
    const discountCodeValue = discountCode || '';
    const isCheckValidateCode = !!amountDiscountCode;
    const isShowValidateCode = !!discountCode;
    if (isShowInputCouponCode) {
      return (
        <div className="input-group mb-3">
          <input
            value={discountCodeValue}
            onChange={this.discountCodeAction}
            type="text"
            className={`form-control ${
              // eslint-disable-next-line no-nested-ternary
              isShowValidateCode
                ? isCheckValidateCode
                  ? 'is-valid'
                  : 'is-invalid'
                : ''
            }`}
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
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <a
            onClick={() => {
              this.setState({ isShowInputCouponCode: true });
            }}
          >
            <i
              style={{ color: '#888', cursor: 'pointer' }}
              className="fas fa-plus-circle fa-lg cursor-pointer"
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
          {this.showRewardPointModule()}
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
      state.mainRd.checkout.orderPreparingCheckout.totals.init_discount_amount,
    earn_points:
      state.mainRd.checkout.orderPreparingCheckout.totals.earn_points,
    totalRewardPointCustomer: state.mainRd.cartCurrent.totalRewardPoint
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDiscountCodeAction: payload => dispatch(getDiscountCodeAction(payload)),
    setDiscountCodeAction: payload => dispatch(setDiscountCodeAction(payload)),
    spendAmountRewardPointAction: payload =>
      dispatch(spendAmountRewardPointAction(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubTotal);
