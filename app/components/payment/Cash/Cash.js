// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';

type Props = {
  cashLoadingPreparingOrder: boolean,
  orderPreparingCheckout: Object
};

class CashPayment extends Component<Props> {
  props: Props;

  render() {
    const { cashLoadingPreparingOrder, orderPreparingCheckout } = this.props;
    console.log('order preparing checkout:', orderPreparingCheckout);
    return (
      <div className="col-md-3">
        <button type="button" className="btn btn-primary btn-lg">
          {cashLoadingPreparingOrder ? (
            <span
              className="spinner-border"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <>{orderPreparingCheckout.totals.grand_total}</>
          )}
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder,
    orderPreparingCheckout: state.mainRd.orderPreparingCheckout
  };
}

export default connect(
  mapStateToProps,
  null
)(CashPayment);
