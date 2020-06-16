import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from './detail-order.scss';
import { formatCurrencyCode } from '../../../../common/settings';
import { toggleModalOrderDetail } from '../../../../actions/accountAction';

type Props = {
  orderHistoryDetail: {},
  isOpenDetailOrder: boolean,
  isLoadingOrderHistoryDetail: boolean
};
class DetailOrder extends Component {
  props: Props;

  formatSymbolMoney = amount => {
    return formatCurrencyCode(amount);
  };

  render() {
    const {
      isOpenDetailOrder,
      isLoadingOrderHistoryDetail,
      orderHistoryDetail
    } = this.props;
    console.log(orderHistoryDetail);
    return (
      <>
        {isLoadingOrderHistoryDetail ? (
          <div className="d-flex justify-content-center mt-5 mb-5">
            <div className="spinner-border text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className={Styles.wrapDetailOrder}>
            <div style={{ display: isOpenDetailOrder ? 'block' : 'none' }}>
              <div className={Styles.contentSize}>
                <div className={`${Styles.colorBg} modal-content`}>
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
                                {orderHistoryDetail.customer_firstname}{' '}
                                {orderHistoryDetail.customer_lastname}
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
                          <span className="font-weight-bold">Item Ordered</span>
                        </div>
                      </div>
                      <div>
                        {orderHistoryDetail.items.map((item, index) => (
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
                                    <span>Ordered: {item.qty_ordered} </span>
                                    <span>Invoiced: {item.qty_invoiced} </span>
                                    <span>Shipped: {item.qty_shipped} </span>
                                    {item.qty_refunded ? (
                                      <span>
                                        Refunded: {item.qty_refunded}{' '}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <span>
                                {this.formatSymbolMoney(item.price_incl_tax)}
                              </span>
                            </div>
                          </div>
                        ))}
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
                              orderHistoryDetail.base_subtotal_incl_tax
                            )}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Discount</span>
                          <span>
                            {this.formatSymbolMoney(
                              orderHistoryDetail.base_discount_amount
                            )}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Shipping</span>
                          <span>
                            {this.formatSymbolMoney(
                              orderHistoryDetail.base_shipping_amount
                            )}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Grand Total</span>
                          <span>
                            {this.formatSymbolMoney(
                              orderHistoryDetail.grand_total
                            )}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Total Paid</span>
                          <span>
                            {this.formatSymbolMoney(
                              orderHistoryDetail.total_paid
                            )}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Status</span>
                          <span>{orderHistoryDetail.status}</span>
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
                          <span>{orderHistoryDetail.payment.method}</span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Amount</span>
                          <span>
                            {this.formatSymbolMoney(
                              orderHistoryDetail.payment.amount_ordered
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
                          <span>{orderHistoryDetail.shipping_description}</span>
                          <span>
                            {this.formatSymbolMoney(
                              orderHistoryDetail.shipping_incl_tax
                            )}
                          </span>
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
                            {orderHistoryDetail.billing_address.firstname}{' '}
                            {orderHistoryDetail.billing_address.lastname}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Email</span>
                          <span>
                            {orderHistoryDetail.billing_address.email}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Telephone</span>
                          <span>
                            {orderHistoryDetail.billing_address.telephone}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Address</span>
                          <span>
                            {orderHistoryDetail.billing_address.street}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>City</span>
                          <span>{orderHistoryDetail.billing_address.city}</span>
                        </div>
                        <div className="d-flex justify-content-between pr-1">
                          <span>Country</span>
                          <span>
                            {orderHistoryDetail.billing_address.country_id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    order_id_history: state.mainRd.order_id_history,
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isLoadingOrderHistoryDetail: state.mainRd.isLoadingOrderHistoryDetail,
    orderHistoryDetail: state.mainRd.orderHistoryDetail
  };
}
function mapDispatchToProps(dispatch) {
  return {
    toggleModalOrderDetail: payload => dispatch(toggleModalOrderDetail(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailOrder);
