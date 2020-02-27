import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateIsShowCardPaymentModel,
  updateCardPaymentType,
  acceptPaymentCard,
  cashCheckoutAction
} from '../../../actions/homeAction';
import InputCard from './InputCard';

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
    const { cashCheckoutAction, updateIsShowCardPaymentModel } = this.props;

    // Close modal
    updateIsShowCardPaymentModel(false);

    // Show cash modal
    cashCheckoutAction();
  };

  render() {
    const {
      updateCardPaymentType,
      cardPayment,
      acceptPaymentCard,
      updateIsShowCardPaymentModel
    } = this.props;
    const cardPaymentType = cardPayment.type;
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
                  <h2>$67</h2>
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
                disabled={cardPaymentType === ''}
                type="button"
                className="btn btn-primary btn-lg"
                onClick={acceptPaymentCard}
              >
                Accept $67
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
    cardPayment: state.mainRd.checkout.cardPayment
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsShowCardPaymentModel: payload =>
      dispatch(updateIsShowCardPaymentModel(payload)),
    updateCardPaymentType: payload => dispatch(updateCardPaymentType(payload)),
    acceptPaymentCard: () => dispatch(acceptPaymentCard()),
    cashCheckoutAction: () => dispatch(cashCheckoutAction())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardPayment);
