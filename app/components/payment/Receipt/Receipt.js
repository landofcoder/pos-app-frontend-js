import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import Style from './receipt.scss';
import CartReceipt from './CartReceipt/CartReceipt';
import { closeReceiptModal } from '../../../actions/homeAction';
import ModalStyle from '../../styles/modal.scss';
import Close from '../../commons/x';

type Props = {
  closeReceiptModal: () => void,
  receipt: Object,
  customReceipt: Object,
  detailOutlet: Object,
  isOpenReceiptModal: boolean,
  isPrintReceiptNow: boolean
};

class Receipt extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      dateTime: this.formatDate(new Date())
    };
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { closeReceiptModal } = this.props;
      // Hide any modal
      closeReceiptModal();
    }
  };

  printReceipt = () => {
    const { isPrintReceiptNow, closeReceiptModal } = this.props;
    const content = document.getElementById('wrap-main-receipt');
    const pri = document.getElementById('ifmcontentstoprint').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
    console.log(isPrintReceiptNow);
    if (isPrintReceiptNow) {
      closeReceiptModal();
    }
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
      detailOutlet,
      isOpenReceiptModal,
      isPrintReceiptNow
    } = this.props;
    const { dateTime } = this.state;
    const { orderId } = receipt;
    const cartForReceipt =
      receipt.items.orderPreparingCheckoutResult.shipping_address;
    const customerReceipt = cartForReceipt.customer;
    /* eslint-disable */
    const { outlet_name } = detailOutlet;
    let {
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

    // hien tai nen show tat ca cac thong tin cua receipt
    receipt_title = 'Receipt';
    outlet_name_display = 1;
    date_display = 1;
    order_id_display = 0;
    customer_display = 1;

    const css = `
        img {
            width: 100%;
        }
    `;
    return (
      <>
        <iframe
          id="ifmcontentstoprint"
          style={{ height: '0px', width: '0px', postition: 'absolute' }}
        />
        <div style={{ color: '#666' }} className={Style.wrapMainReceipt}>
          <Modal
            overlayClassName={ModalStyle.Overlay}
            shouldCloseOnOverlayClick
            onRequestClose={() => closeReceiptModal(false)}
            className={`${ModalStyle.Modal}`}
            isOpen={isOpenReceiptModal}
            contentLabel="Example Modal"
          >
            <div className={ModalStyle.modalContent}>
              <div
                className={ModalStyle.close}
                role="presentation"
                onClick={() => closeReceiptModal(false)}
              >
                <Close />
              </div>
              <div className="card">
                <div className="card-body">
                  <div className={Style.wrapMainPrint} id="wrap-main-receipt">
                    <style>{css}</style>
                    <table
                      style={{
                        width: '100%',
                        paddingTop: '20px',
                        textAlign: 'center',
                        borderBottom: '1px solid #dedede'
                      }}
                    >
                      <tbody>
                        {+logo_display === 1 ? (
                          <tr>
                            <td colSpan="2">
                              <img
                                style={{
                                  display: 'block',
                                  margin: '0 auto',
                                  width: '150px'
                                }}
                                src={window.mainUrl + '/pub/' + icon}
                              />
                            </td>
                          </tr>
                        ) : null}
                        <tr>
                          <td
                            colSpan="2"
                            style={{
                              borderBottom: '1px solid #dedede',
                              marginBottom: '10px',
                              textAlign: 'center',
                              fontSize: '20px',
                              fontWeight: 'bold'
                            }}
                          >
                            {receipt_title}
                          </td>
                        </tr>
                        {+outlet_name_display ? (
                          <tr>
                            <td colSpan="2" style={{ textAlign: 'center' }}>
                              {detailOutlet.outlet_name}
                            </td>
                          </tr>
                        ) : null}
                        <tr>
                          {+date_display === 1 ? (
                            <>
                              <td
                                style={{
                                  marginTop: '25px',
                                  textAlign: 'left',
                                  width: '50%'
                                }}
                              >
                                Create at
                              </td>
                              <td
                                style={{
                                  marginTop: '25px',
                                  textAlign: 'left',
                                  width: '50%'
                                }}
                              >
                                {dateTime}
                              </td>
                            </>
                          ) : null}
                          {+order_id_display ? (
                            <td style={{ textAlign: 'left' }}>
                              <span>{order_id_label}&nbsp;</span>
                              <span>{orderId}</span>
                            </td>
                          ) : null}
                        </tr>
                        {customerReceipt && +customer_display === 1 ? (
                          <tr>
                            <td style={{ textAlign: 'left' }}>
                              Customer:&nbsp;
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {customerReceipt.firstname}
                            </td>
                          </tr>
                        ) : null}
                        <tr>
                          <td colSpan="2">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: header_content
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table style={{ width: '100%' }}>
                      <tbody>
                        <tr>
                          <td>
                            <CartReceipt />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: footer_content
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    type="button"
                    onClick={() => {
                      this.printReceipt();
                    }}
                    className="btn btn-primary btn-lg btn-block"
                  >
                    PRINT
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
    /* eslint-enable */
  }
}
function mapStateToProps(state) {
  return {
    receipt: state.mainRd.receipt,
    customReceipt: state.mainRd.customReceipt, // need to move to receipt ? >>  NO
    detailOutlet:
      state.mainRd.receipt.items.orderPreparingCheckoutResult
        .detailOutletResult,
    isPrintReceiptNow: state.mainRd.receipt.isPrintReceiptNow,
    isOpenReceiptModal: state.mainRd.receipt.isOpenReceiptModal
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
