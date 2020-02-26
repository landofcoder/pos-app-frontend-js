import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateIsShowCardPaymentModel } from '../../../actions/homeAction';

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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Checkout</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">Modal body</div>
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
