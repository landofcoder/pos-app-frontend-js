import React, { Component } from 'react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import Styles from '../DetailOrder/detail-order.scss';
import StylesOrder from '../order-history.scss';
import { formatCurrencyCode } from '../../../../common/settings';
import { actionLoadingOrderDetailOffline } from '../../../../actions/accountAction';
type Props = {
  orderHistoryDetail: {},
  // order_id_history: number,
  isOpenDetailOrder: boolean,
  isLoadingOrderHistoryDetail: boolean,
  // getOrderHistoryDetail: id => void,
  orderHistoryDetail: {},
  actionLoadingOrderDetailOffline: payload => void
};
class DetailOrderOffline extends Component {
  props: Props;

  componentDidMount() {
    const { actionLoadingOrderDetailOffline } = this.props;
    actionLoadingOrderDetailOffline(false);
  }

  formatSymbolMoney = amount => {
    return formatCurrencyCode(amount);
  };

  showShippingMethod = () => {
    const { orderHistoryDetail } = this.props;
    const obj = Object.entries(
      orderHistoryDetail.items.orderPreparingCheckoutResult.shipping_address
        .shipping_method
    );
    const data = obj.map(index => index[1]);
    return data;
  };

  render() {
    const {
      isOpenDetailOrder,
      isLoadingOrderHistoryDetail,
      orderHistoryDetail
    } = this.props;
    return (
      <>
        <div className={`${StylesOrder.toogleBodyContent}`}>
          <div
            style={{
              display: isOpenDetailOrder ? 'block' : 'none'
            }}
          >
            <div className={Styles.contentSize}>
              <div className={`${Styles.colorBg}`}>
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
                        {orderHistoryDetail.message ? (
                          <div className="alert alert-danger" role="alert">
                            <i
                              className="fas fa-exclamation-circle"
                              style={{ color: '#666' }}
                            />{' '}
                            &nbsp;{orderHistoryDetail.message}
                          </div>
                        ) : null}
                        <div className="form-group">
                          <div className="pl-0">
                            <div className={Styles.wrapContent}>
                              <div className="d-flex justify-content-between pr-1">
                                <span>Order Date: </span>
                                <span>
                                  {format(
                                    new Date(orderHistoryDetail.created_at),
                                    'yyyy-MM-dd hh:m:s'
                                  )}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between pr-1">
                                <span>Location: </span>
                              </div>
                              <div className="d-flex justify-content-between pr-1">
                                <span>Customer: </span>
                                <span>
                                  {
                                    orderHistoryDetail.items
                                      .orderPreparingCheckoutResult
                                      .shipping_address.firstname
                                  }{' '}
                                  {
                                    orderHistoryDetail.items
                                      .orderPreparingCheckoutResult
                                      .shipping_address.lastname
                                  }
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
                          {orderHistoryDetail.items.cartCurrentResult.data.map(
                            (item, index) => (
                              <div
                                key={index}
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
                                    {this.formatSymbolMoney(
                                      item.pos_totalPrice
                                    )}
                                  </span>
                                </div>
                              </div>
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
                              {this.formatSymbolMoney(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .base_subtotal
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Discount</span>
                            <span>
                              {this.formatSymbolMoney(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .base_discount_amount
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Shipping</span>
                            <span>
                              {this.formatSymbolMoney(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .base_shipping_amount
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Grand Total</span>
                            <span>
                              {this.formatSymbolMoney(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .grand_total
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Status</span>
                            <span>not synced</span>
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
                                  .orderPreparingCheckoutResult.shipping_address
                                  .method.default_payment_method
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Amount</span>
                            <span>
                              {this.formatSymbolMoney(
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.totals
                                  .grand_total
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Shipping method */}
                      <div className="form-group">
                        <div>
                          <div
                            className={`border-bottom col ${Styles.wrapContent}`}
                          >
                            <div className="d-flex justify-content-between pr-1"></div>
                            <span className="font-weight-bold">
                              Shipping Method
                            </span>
                          </div>
                        </div>
                        <div className={`col ${Styles.wrapContent}`}>
                          <div className="d-flex justify-content-between pr-1">
                            <span>{this.showShippingMethod()}</span>
                          </div>
                        </div>
                      </div>
                      {/* Billing Address */}
                      <div className="form-group">
                        <div>
                          <div
                            className={`border-bottom col ${Styles.wrapContent}`}
                          >
                            <span className="font-weight-bold">
                              Billing Address
                            </span>
                          </div>
                        </div>
                        <div className={`col ${Styles.wrapContent}`}>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Full name</span>
                            <span>
                              {
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.shipping_address
                                  .firstname
                              }{' '}
                              {
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.shipping_address
                                  .lastname
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Email</span>
                            <span>
                              {
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.email
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Telephone</span>
                            <span>
                              {
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.shipping_address
                                  .telephone
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Address</span>
                            <span>
                              {orderHistoryDetail.items.orderPreparingCheckoutResult.shipping_address.street.map(
                                index => index
                              )}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>City</span>
                            <span>
                              {
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.shipping_address
                                  .city
                              }
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Country</span>
                            <span>
                              {
                                orderHistoryDetail.items
                                  .orderPreparingCheckoutResult.shipping_address
                                  .country_id
                              }
                            </span>
                          </div>
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
    orderHistoryDetail: state.mainRd.orderHistoryDetailOffline
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actionLoadingOrderDetailOffline: payload =>
      dispatch(actionLoadingOrderDetailOffline(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailOrderOffline);
