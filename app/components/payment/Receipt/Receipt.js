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
    const content = document.getElementById('wrap-main-receipt');
    const pri = document.getElementById('ifmcontentstoprint').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
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
    //fake

    let receipt_title = '123',
      outlet_name_display = '123',
      date_display = '123',
      order_id_display = '123',
      order_id_label = '123',
      customer_display = '123',
      logo_display = '123',
      icon = '123',
      image = '123',
      logo_width = '123',
      logo_height = '123',
      logo_alt = '123',
      header_content = '123',
      footer_content = '123';
    // const {
    //   receipt_title,
    //   outlet_name_display,
    //   date_display,
    //   order_id_display,
    //   order_id_label,
    //   customer_display,
    //   logo_display,
    //   icon,
    //   image,
    //   logo_width,
    //   logo_height,
    //   logo_alt,
    //   header_content,
    //   footer_content
    // } = customReceipt;
    /* eslint-enable */
    /* eslint-disable */
    return (
      <>
        <iframe
          id="ifmcontentstoprint"
          style={{ height: '500px', width: '500px', backgroundColor: 'white' }}
        ></iframe>
        <div style={{ color: '#666' }} className={Style.wrapMainReceipt}>
          <div className="modal-content">
            <div className={Style.wrapMainPrint} id="wrap-main-receipt">
              <table
                style={{
                  width: '100%',
                  paddingTop: '20px',
                  textAlign: 'center'
                }}
              >
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <img
                        style={{
                          width: '160px',
                          height: '160px',
                          display: 'block',
                          margin: '0 auto'
                        }}
                      ></img>
                    </td>
                  </tr>
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
                  <tr>
                    <td colSpan="2" style={{ textAlign: 'center' }}>
                      {/*{detailOutlet.outlet_name}*/}
                      outletname
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        marginTop: '25px',
                        textAlign: 'left',
                        width: '50%'
                      }}
                    >
                      {dateTime}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span>{order_id_label}&nbsp;</span>
                      <span>{orderId}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left' }}>Customer:&nbsp;</td>
                    {/*<td>{customerReceipt.firstname}</td>*/}
                    <td style={{ textAlign: 'right' }}>123</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <div
                        dangerouslySetInnerHTML={{ __html: header_content }}
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
                        dangerouslySetInnerHTML={{ __html: footer_content }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
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
      </>
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
