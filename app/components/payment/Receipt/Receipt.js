// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Style from './receipt.scss';
import CartReceipt from '../../CartReceipt/CartReceipt';
import { closeReceiptModal } from '../../../actions/homeAction';

type Props = {
  closeReceiptModal: () => void,
  receipt: Object,
  customReceipt: Object
};

class Receipt extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      dateTime: this.formatDate(new Date())
    };
  }

  printReceipt = () => {
    const printContents = document.getElementById('wrap-main-receipt')
      .innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

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
    const { receipt, closeReceiptModal, customReceipt } = this.props;
    const { dateTime } = this.state;
    const { orderId } = receipt;
    const {
      receipt_title,
      outlet_name_display,
      date_display,
      order_id_display,
      order_id_label,
      customer_display,
      subtotal_display,
      subtotal_label,
      discount_display,
      discount_label,
      tax_display,
      tax_label,
      credit_amount_display,
      credit_label,
      change_amount_display,
      change_label,
      cashier_name_display,
      cashier_label,
      outlet_address_display,
      grand_total_label,
      logo_display,
      icon,
      image,
      logo_width,
      logo_height,
      logo_alt,
      header_content,
      footer_content
    } = customReceipt;

    return (
      <div className={Style.wrapMainReceipt}>
        <div className="modal-content">
          <div id="wrap-main-receipt">
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
                  <span>{orderId}</span>
                </div>
              </div>
            </div>
            <div className="modal-body">
              <div>
                <CartReceipt />
              </div>
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
                onClick={this.printReceipt}
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
    receipt: state.mainRd.receipt,
    customReceipt: state.mainRd.customReceipt
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
