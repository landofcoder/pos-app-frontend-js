import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalStyle from '../../../styles/modal.scss';
import Styles from '../DetailOrder/detail-order.scss';
import { formatCurrencyCode } from '../../../../common/settings';
import {
  getOrderHistoryDetailOffline,
  toggleModalOrderDetailOffline,
  actionLoadingOrderDetailOffline
} from '../../../../actions/accountAction';

type Props = {
  orderHistoryDetail: {},
  // order_id_history: number,
  isOpenDetailOrder: boolean,
  isLoadingOrderHistoryDetail: boolean,
  // getOrderHistoryDetail: id => void,
  orderHistoryDetail: {},
  toggleModalOrderDetail: payload => void,
  actionLoadingOrderDetailOffline: payload => void
};
class DetailOrderOffline extends Component {
  props: Props;

  componentDidMount() {
    const { actionLoadingOrderDetailOffline } = this.props;
    actionLoadingOrderDetailOffline(false);
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
                    <div className="modal-body">
                      <div className="form-group">
                        <div className="form-group">
                          <div className="pl-0">
                            <div className={Styles.wrapContent}>
                              <div className="d-flex justify-content-between pr-1">
                                <span>Order Date: </span>
                                <span>{orderHistoryDetail.created_at}</span>
                              </div>
                              <div className="d-flex justify-content-between pr-1">
                                <span>Location: </span>
                              </div>
                              <div className="d-flex justify-content-between pr-1">
                                <span>Customer: </span>
                                <span>
                                  {/* {orderHistoryDetail.customer_firstname}{' '}
                                  {orderHistoryDetail.customer_lastname} */}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div>
                          <div
                            className={`border-bottom col ${Styles.wrapContent}`}
                          >
                            <span className="font-weight-bold">
                              Item Ordered
                            </span>
                          </div>
                        </div>
                        <div>
                          {orderHistoryDetail.items.cartCurrentResult.map(
                            item => (
                              <>
                                <div
                                  className={`border-bottom col ${Styles.wrapContent}`}
                                >
                                  <div className="d-flex justify-content-between pr-1">
                                    <div>
                                      <div className="d-flex justify-content-between pr-1">
                                        <span>{item.name}</span>
                                      </div>
                                      <div className="d-flex justify-content-between pr-1">
                                        <div>
                                          <span>sku: {item.sku}, </span>
                                          <span>ordered: {item.pos_qty} </span>
                                        </div>
                                      </div>
                                    </div>
                                    <span>
                                      {formatCurrencyCode(item.pos_totalPrice)}
                                    </span>
                                  </div>
                                </div>
                              </>
                            )
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <div>
                          <div
                            className={`border-bottom col ${Styles.wrapContent}`}
                          >
                            <span className="font-weight-bold">Payment</span>
                          </div>
                        </div>
                        <div className={`col ${Styles.wrapContent}`}>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Subtotal: </span>
                            <span>
                              {formatCurrencyCode(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .base_subtotal
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Discount</span>
                            <span>
                              {formatCurrencyCode(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .discount_amount
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Shipping</span>
                            <span>
                              {formatCurrencyCode(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .base_shipping_amount
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Grand Total</span>
                            <span>
                              {formatCurrencyCode(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .grand_total
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Status</span>
                            <span>Not synced</span>
                            {}
                          </div>
                        </div>
                      </div>

                      {/* {paymentMethod} */}
                      <div className="form-group">
                        <div>
                          <div
                            className={`border-bottom col ${Styles.wrapContent}`}
                          >
                            <span className="font-weight-bold">
                              Payment Method
                            </span>
                          </div>
                        </div>
                        <div className={`col ${Styles.wrapContent}`}>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Method</span>
                            <span>
                              {
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.payment_methods
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Amount</span>
                            <span>
                              {formatCurrencyCode(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .grand_total
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping method */}

                      {/* Billing Address */}

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
    // order_id_history: state.mainRd.order_id_historyOffline,
    isOpenDetailOrder: state.mainRd.isOpenDetailOrderOffline,
    isLoadingOrderHistoryDetail:
      state.mainRd.isLoadingOrderHistoryDetailOffline,
    orderHistoryDetail: state.mainRd.dataCheckoutDetailItemHistoryOffline
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getOrderHistoryDetail: id => dispatch(getOrderHistoryDetailOffline(id)),
    toggleModalOrderDetail: payload =>
      dispatch(toggleModalOrderDetailOffline(payload)),
    actionLoadingOrderDetailOffline: payload =>
      dispatch(actionLoadingOrderDetailOffline(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailOrderOffline);
