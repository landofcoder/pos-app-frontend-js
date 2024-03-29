import React, { Component } from 'react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import Styles from './detail-order.scss';
import StylesOrder from '../order-history.scss';
import { formatCurrencyCode } from '../../../../common/settings';
import { actionLoadingOrderDetailOffline } from '../../../../actions/accountAction';

type Props = {
  orderHistoryDetail: {},
  isOpenDetailOrder: boolean,
  isLoadingOrderHistoryDetail: boolean,
  orderHistoryDetail: {},
  actionLoadingOrderDetailOffline: payload => void
};
class DetailOrder extends Component {
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
    let customer;
    if (orderHistoryDetail.items.cartCurrentResult.isGuestCustomer) {
      customer =
        orderHistoryDetail.items.orderPreparingCheckoutResult.shipping_address;
    } else {
      // eslint-disable-next-line prefer-destructuring
      customer = orderHistoryDetail.items.cartCurrentResult.customer;
    }
    const { syncData } = orderHistoryDetail.items;
    let orderId;
    if (syncData) {
      ({ orderId } = syncData);
    }
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
                          <div className="text-danger" role="alert">
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
                                <span>Order ID: </span>
                                <span>{orderId ?? '--'}</span>
                              </div>
                              <div className="d-flex justify-content-between pr-1">
                                <span>Customer: </span>
                                <span>
                                  {customer.firstname} {customer.lastname}
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
                                        {item.pos_refunded ? (
                                          <span>
                                            refunded: {item.pos_refunded}
                                          </span>
                                        ) : null}
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
                            <span>{orderHistoryDetail.status}</span>
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
                              {customer.firstname} {customer.lastname}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between pr-1">
                            <span>Email</span>
                            <span>{customer.email}</span>
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

                      {/* Comments Order */}

                      <div className="form-group">
                        <div>
                          <div
                            className={`border-bottom col ${Styles.wrapContent}`}
                          >
                            <span className="font-weight-bold">
                              Comments Order
                            </span>
                          </div>
                        </div>

                        <div className={`col ${Styles.wrapContent}`}>
                          {orderHistoryDetail.items.cartCurrentResult
                            .comments ? (
                            orderHistoryDetail.items.cartCurrentResult.comments.map(
                              (item, index) => {
                                return (
                                  <div key={index}>
                                    <div className="form-group pb-3 border-bottom">
                                      <p>{item.created_at}</p>
                                      <p>{item.comment}</p>
                                    </div>
                                  </div>
                                );
                              }
                            )
                          ) : (
                            <span>Nothing</span>
                          )}
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
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isLoadingOrderHistoryDetail:
      state.mainRd.isLoadingorderHistoryDetail,
    orderHistoryDetail: state.mainRd.orderHistoryDetail
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
)(DetailOrder);
