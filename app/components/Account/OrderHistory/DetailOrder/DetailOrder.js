import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalStyle from '../../../styles/modal.scss';
import Styles from './detail-order.scss';
import {
  getOrderHistoryDetail,
  toggleModalOrderDetail
} from '../../../../actions/accountAction';
type Props = {
  orderHistoryDetail: {},
  order_id_history: number,
  isOpenDetailOrder: boolean,
  isLoadingOrderHistoryDetail: boolean,
  getOrderHistoryDetail: id => void,
  orderHistoryDetail: {},
  toggleModalOrderDetail: payload => void
};
class DetailOrder extends Component {
  props: Props;
  componentDidMount() {
    const {
      getOrderHistoryDetail,
      order_id_history,
      toggleModalOrderDetail
    } = this.props;
    getOrderHistoryDetail(order_id_history);
  }
  render() {
    const {
      isOpenDetailOrder,
      isLoadingOrderHistoryDetail,
      orderHistoryDetail,
      toggleModalOrderDetail
    } = this.props;
    console.log(orderHistoryDetail);
    return (
      <>
        <div className={Styles.wrapDetailOrder}>
          <div
            className={ModalStyle.modal}
            style={{ display: isOpenDetailOrder ? 'block' : 'none' }}
          >
            <div className={Styles.contentSize}>
              <div className={`${Styles.colorBg} modal-content`}>
                {isLoadingOrderHistoryDetail ? (
                  <div className="d-flex justify-content-center mt-5 mb-5">
                    <div
                      className="spinner-border text-secondary"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* {<div className="modal-header">
                      <h5 className="modal-title"></h5>
                      <div className="col-md-3 p-0"></div>
                    </div>} */}
                    <div className="modal-body">
                      <div className="form-group">
                        <span className="font-weight-bold">$132.6</span>
                      </div>
                      <div className="form-group">
                        <div className="row form-group">
                          <div className="col-md-6 pl-0">
                            <div className={Styles.wrapContent}>
                              <span>Order Date: 12/23/2019 4:13 PM</span>
                              <span>Location: Primary Location</span>
                              <span>Customer: Guest</span>
                            </div>
                          </div>
                          <div className="col-md-6 pr-0">
                            <div className={Styles.wrapContent}>
                              <span>Subtotal</span>
                              <span>Discount</span>
                              <span>Shipping</span>
                              <span>Grand Total</span>
                              <span>Total Paid</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`form-group`}>
                        <div className="row">
                          <div
                            className={`border-bottom col ${Styles.wrapContent}`}
                          >
                            <span className="font-weight-bold">
                              Item Ordered
                            </span>
                          </div>
                        </div>
                        <div className="row">
                          <div
                            className={`col ${Styles.wrapContent}`}
                          >
                            <span>
                              Product
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <div className="col-md-2 p-0">
                        <button
                          type="button"
                          className="btn btn-secondary btn-block"
                          onClick={() =>
                            toggleModalOrderDetail({ isShow: false })
                          }
                        >
                          CLOSE
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    orderHistoryDetail: state.mainRd.orderHistoryDetail,
    order_id_history: state.mainRd.order_id_history,
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isLoadingOrderHistoryDetail: state.mainRd.isLoadingOrderHistoryDetail,
    orderHistoryDetail: state.mainRd.orderHistoryDetail
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getOrderHistoryDetail: id => dispatch(getOrderHistoryDetail(id)),
    toggleModalOrderDetail: payload => dispatch(toggleModalOrderDetail(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailOrder);
