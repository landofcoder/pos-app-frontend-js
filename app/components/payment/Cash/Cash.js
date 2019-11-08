// @flow
import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HOME_DEFAULT_PRODUCT_LIST } from '../../../constants/main-panel-types';
import * as CheckoutActions from '../../../actions/checkoutActions';
import {} from '../../../actions/homeAction';

type Props = {
  cashLoadingPreparingOrder: boolean,
  orderPreparingCheckout: Object,
  updateMainPanelTypeAction: (payload: string) => void,
  cashPlaceOrderAction: () => void
};

class CashPayment extends Component<Props> {
  props: Props;

  render() {
    const {
      cashLoadingPreparingOrder,
      orderPreparingCheckout,
      updateMainPanelTypeAction,
      cashPlaceOrderAction
    } = this.props;
    return (
      <div className="col-md-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => updateMainPanelTypeAction(HOME_DEFAULT_PRODUCT_LIST)}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={cashPlaceOrderAction}
        >
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CheckoutActions }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashPayment);
