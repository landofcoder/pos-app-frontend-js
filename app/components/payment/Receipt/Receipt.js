// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Style from './receipt.scss';
import CartReceipt from '../../CartReceipt/CartReceipt';
import { closeReceiptModal } from '../../../actions/homeAction';

type Props = {
  closeReceiptModal: () => void
};

class Receipt extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      dateTime: this.formatDate(new Date())
    };
  }

  formatDate = date => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return `${day} ${monthNames[monthIndex]} ${year}`;
  };

  render() {
    const { receipt, closeReceiptModal } = this.props;
    const { dateTime } = this.state;
    const cartData = receipt.cartForReceipt.data;
    console.log('dd1:', cartData);
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
                <span>{dateTime}</span>
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
            </div>
          </div>
          <div className="modal-footer">
            <div className="col-md-6 p-0">
              <button
                type="button"
                onClick={closeReceiptModal}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                CLOSE
              </button>
            </div>
            <div className="col-md-6 p-0">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
              >
                PRINT
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    receipt: state.mainRd.receipt
  };
}

function mapDispatchToProps(dispatch) {
  return {
    closeReceiptModal: () => dispatch(closeReceiptModal())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Receipt);
