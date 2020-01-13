// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Style from './receipt.scss';
import CartReceipt from './CartReceipt/CartReceipt';
import { closeReceiptModal } from '../../../actions/homeAction';

type Props = {
  closeReceiptModal: () => void,
  receipt: Object,
  customReceipt: Object,
  detailOutlet: Object
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
    const {
      receipt,
      closeReceiptModal,
      customReceipt,
      detailOutlet
    } = this.props;
    const { dateTime } = this.state;
    const { orderId, cartForReceipt } = receipt;
    const customerReceipt = cartForReceipt.customer;
    /* eslint-disable */
    const { outlet_name } = detailOutlet;
    const {
      receipt_title,
      outlet_name_display,
      date_display,
      order_id_display,
      order_id_label,
      customer_display,
      logo_display,
      icon,
      image,
      logo_width,
      logo_height,
      logo_alt,
      header_content,
      footer_content
    } = customReceipt;
    /* eslint-enable */
    /* eslint-disable */
    return (
      <div className={Style.wrapMainReceipt}>
        <div className="modal-content">
          <div id="wrap-main-receipt">
            <div className={Style.wrapHeader}>
              {
                Number(logo_display) === 1 ?
                  <div className={Style.wrapReceiptLogo}>
                    <img src={icon}/>
                  </div> : <></>
              }
              <div className={Style.wrapReceiptTitle}>
                <p>{receipt_title}</p>
              </div>
              <div className={Style.wraOutletAddress}>
                <p>{detailOutlet.outlet_name}</p>
              </div>
              <div className={Style.wrapHeadLogo}>
                <h5 className="modal-title" id="modalReceipt">
                  {outlet_name_display ? outlet_name : ''}
                </h5>
              </div>
              <div className={Style.wrapHeadInfo}>
                <div className={Style.wrapTime}>
                  {date_display === '1' ? <span>{dateTime}</span> : <></>}
                </div>
                {order_id_display ? (
                  <div className={Style.wrapOrderId}>
                    <span>{order_id_label}&nbsp;</span>
                    <span>{orderId}</span>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {
                customerReceipt && Number(customer_display) === 1 ?
                  <div className={Style.wrapCustomerInfo}>
                    <span>Customer:&nbsp;</span>
                    <span>{customerReceipt.firstname}</span>
                  </div> : <></>
              }
            </div>
            <div className="col-md-12">
             <div dangerouslySetInnerHTML={{__html: header_content}} />
            </div>
            <div className="modal-body">
              <div>
                <CartReceipt/>
                <div dangerouslySetInnerHTML={{__html: footer_content}} />
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
    /* eslint-enable */
  }
}

function mapStateToProps(state) {
  return {
    receipt: state.mainRd.receipt,
    customReceipt: state.mainRd.customReceipt,
    detailOutlet: state.mainRd.detailOutlet
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
