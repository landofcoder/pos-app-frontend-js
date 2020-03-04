import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateIsShowCardPaymentModel,
  updateCardPaymentType,
  acceptPaymentCard,
  checkoutAction,
  toggleCashCheckoutAction
} from '../../../actions/homeAction';
import InputCard from './InputCard';
import { formatCurrencyCode } from '../../../common/settings';
import {
  CANNOT_CHARGE,
  SHOP_CURRENCY_IS_NOT_CONFIG
} from '../../../constants/payment';

class CardPayment extends Component {
  props: Props;

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { updateIsShowCardPaymentModel } = this.props;
      // Hide any modal
      updateIsShowCardPaymentModel(false);
    }
  };

  switchToCashPayment = () => {
    const {
      toggleCashCheckoutAction,
      updateIsShowCardPaymentModel
    } = this.props;
    // Close modal
    updateIsShowCardPaymentModel(false);

    // Show cash modal
    toggleCashCheckoutAction();
  };

  render() {
    const {
      updateCardPaymentType,
      cardPayment,
      acceptPaymentCard,
      updateIsShowCardPaymentModel,
      orderPreparingCheckout,
      loadingPreparingOrder
    } = this.props;
    const cardPaymentType = cardPayment.type;
    // eslint-disable-next-line camelcase
    const grandTotal = formatCurrencyCode(
      orderPreparingCheckout.totals.grand_total
    );
    const { resultCharge } = cardPayment;

    return (
      <div className="row">
        <div className="modal-content" style={{ minHeight: '300px' }}>
          <div className="modal-header">
            <h5 className="modal-title">Payment</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="col-10 offset-1">
              <div className="row">
                <div className="col-12 text-center mb-4">
                  {loadingPreparingOrder ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <h2>{grandTotal}</h2>
                  )}
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-md-4">
                      <button
                        onClick={() => updateCardPaymentType('stripe')}
                        type="button"
                        className={`btn btn-outline-primary btn-lg btn-block ${
                          cardPaymentType === 'stripe' ? 'active' : ''
                        }`}
                      >
                        Stripe
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        onClick={() => updateCardPaymentType('authorize')}
                        type="button"
                        className={`btn btn-outline-primary btn-lg btn-block ${
                          cardPaymentType === 'authorize' ? 'active' : ''
                        }`}
                      >
                        {' '}
                        Authorize.net
                      </button>
                    </div>
                    <div className="col-md-4">
                      <button
                        onClick={() => this.switchToCashPayment()}
                        type="button"
                        className={`btn btn-outline-primary btn-lg btn-block ${
                          cardPaymentType === 'cash' ? 'active' : ''
                        }`}
                      >
                        CASH
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-4 mb-5">
                  <InputCard />
                </div>
              </div>
            </div>
            <div className="col-12">
              {() => {
                switch (resultCharge) {
                  case CANNOT_CHARGE:
                    return <p className="text-danger">Cannot charge</p>;
                  case SHOP_CURRENCY_IS_NOT_CONFIG:
                    return (
                      <p className="text-danger">
                        Left aligned text on all viewport sizes.
                      </p>
                    );
                  default:
                    return <p></p>;
                }
              }}
            </div>
          </div>
          {cardPaymentType ? (
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => updateIsShowCardPaymentModel(false)}
              >
                Close
              </button>
              <button
                disabled={cardPaymentType === '' || loadingPreparingOrder}
                type="button"
                className="btn btn-primary btn-lg"
                onClick={acceptPaymentCard}
              >
                Accept {loadingPreparingOrder === false ? grandTotal : ''}
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isShowCardPaymentModal: state.mainRd.checkout.isShowCardPaymentModal,
    orderPreparingCheckout: state.mainRd.checkout.orderPreparingCheckout,
    loadingPreparingOrder: state.mainRd.checkout.loadingPreparingOrder,
    cardPayment: state.mainRd.checkout.cardPayment
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsShowCardPaymentModel: payload =>
      dispatch(updateIsShowCardPaymentModel(payload)),
    updateCardPaymentType: payload => dispatch(updateCardPaymentType(payload)),
    acceptPaymentCard: () => dispatch(acceptPaymentCard()),
    checkoutAction: () => dispatch(checkoutAction()),
    toggleCashCheckoutAction: () => dispatch(toggleCashCheckoutAction())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardPayment);
