import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateIsShowCardPaymentModel } from '../../../actions/homeAction';
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

  render() {
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
            <div className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-lg btn-block"
                    >
                      CASH
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-lg btn-block"
                    >
                      Stripe
                    </button>
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-lg btn-block"
                    >
                      {' '}
                      Authorize.net
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <InputCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isShowCardPaymentModal: state.mainRd.checkout.isShowCardPaymentModal
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsShowCardPaymentModel: payload =>
      dispatch(updateIsShowCardPaymentModel(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardPayment);
