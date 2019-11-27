// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Style from './receipt.scss';
import CartReceipt from '../../CartReceipt/CartReceipt';

class Receipt extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={Style.wrapMainReceipt}>
        <div className="modal-content">
          <div className={Style.wrapHeader}>
            <div className={Style.wrapHeadLogo}>
              <h5 className="modal-title" id="modalReceipt">
                Luma outlet
              </h5>
            </div>
            <div className={Style.wrapHeadInfo}>
              <div className={Style.wrapTime}>
                <span>Nov 27, 2019, 2:54:20 AM</span>
              </div>
              <div className={Style.wrapOrderId}>
                <span>OrderId:&nbsp;</span>
                <span>#1000001</span>
              </div>
            </div>
          </div>
          <div className="modal-body">
            <div>
              <CartReceipt />
              <div className="row">
                <div className="col-md-12">
                  <button type="button" className="btn btn-primary btn-lg btn-block">PRINT</button>
                </div>
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
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Receipt);
