// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListCart from './Cart/ListCart';
import routes from '../constants/routes';
import Styles from './Home.scss';
import CommonStyle from './common.scss';
import CashPayment from './payment/Cash/Cash';
import {
  HOME_DEFAULT_PRODUCT_LIST,
  CASH_PANEL
} from '../constants/main-panel-types';
import { baseUrl } from '../params';

type Props = {
  productList: Array,
  addToCart: (payload: Object) => void,
  holdAction: () => void,
  searchAction: () => void,
  getDefaultProductAction: () => void,
  cartCurrent: Array,
  mainPanelType: string,
  updateMainPanelType: (payload: string) => void,
  cashCheckoutAction: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount(): * {
    const { getDefaultProductAction } = this.props;
    getDefaultProductAction();
  }

  getFirstMedia = item => {
    const gallery = item.media_gallery_entries
      ? item.media_gallery_entries
      : [];
    if (gallery.length > 0) {
      const image = gallery[0].file;
      return `${baseUrl}pub/media/catalog/product/${image}`;
    }
    // Return default image
    return `${baseUrl}pub/media/catalog/product/`;
  };

  sumTotalPrice = () => {
    const { cartCurrent } = this.props;
    let totalPrice = 0;
    cartCurrent.data.forEach(item => {
      totalPrice += item.price;
    });
    return totalPrice;
  };

  /**
   * Rendering left panel, or product list or payment types
   * @param productList
   * @returns {*}
   */
  renderSwitchPanel = productList => {
    const { addToCart, mainPanelType } = this.props;

    switch (mainPanelType) {
      case HOME_DEFAULT_PRODUCT_LIST:
        return productList.map(item => (
          <div
            className={`col-md-3 mb-4 ${Styles.wrapProductItem}`}
            key={item.id}
          >
            <div className="card">
              <div className="card-body">
                <a role="presentation" onClick={() => addToCart(item)}>
                  <img
                    alt="name"
                    className={Styles.wrapImage}
                    src={this.getFirstMedia(item)}
                  />
                  <h5 className="card-title">{item.name}</h5>
                </a>
              </div>
            </div>
          </div>
        ));
      case CASH_PANEL:
        return <CashPayment></CashPayment>;
      default:
        return <></>;
    }
  };

  /**
   * Change payment type for switching left panel
   * @param paymentType
   */
  switchToPaymentType = paymentType => {
    // Switch main panel type
    const { updateMainPanelType } = this.props;
    updateMainPanelType(paymentType);

    // After switch to payment, run cashCheckoutAction to load discount to quote
    const { cashCheckoutAction } = this.props;
    cashCheckoutAction();
  };

  /**
   * Render discount and tax
   * @returns {*}
   */
  renderDiscountAndTax = () => {
    return (
      <>
        <div className={CommonStyle.wrapRow}>
          <div className={CommonStyle.wrapLabel}>
            <span>Subtotal</span>
          </div>
          <div className={CommonStyle.wrapValue}>
            <span>{this.sumTotalPrice()}</span>
          </div>
        </div>
        <div className={CommonStyle.wrapRow}>
          <div className={CommonStyle.wrapLabel}>
            <span>Discount</span>
          </div>
          <div className={CommonStyle.wrapValue}>
            <span>--</span>
          </div>
        </div>
      </>
    );
  };

  render() {
    const classWrapProductPanel = `${Styles.wrapProductPanel} row`;
    const { productList, holdAction, searchAction, cartCurrent } = this.props;
    // Enable checkout button or disable
    const disableCheckout = cartCurrent.data.length <= 0;
    return (
      <>
        <div data-tid="container">
          <div className="row" id={Styles.wrapPostContainerId}>
            <div className="col-md-9">
              <div className={classWrapProductPanel}>
                <div className="col-md-12 mb-4">
                  <div className="input-group flex-nowrap">
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="addon-wrapping">
                        Search
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      onChange={searchAction}
                      placeholder="name, sku"
                      aria-label="Username"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
                </div>
                {this.renderSwitchPanel(productList)}
              </div>
            </div>
            <div className="col-md-3">
              <div className={CommonStyle.wrapLevel1}>
                <div className={CommonStyle.wrapCartPanelPosition}>
                  <ListCart />
                  <div className={CommonStyle.subTotalContainer}>
                    <div className={CommonStyle.wrapSubTotal}>
                      {this.renderDiscountAndTax()}
                      <div className={CommonStyle.wrapRow}>
                        <div
                          className={CommonStyle.wrapLabel}
                          data-grand-total="1"
                        >
                          <span>GRAND TOTAL</span>
                        </div>
                        <div
                          className={CommonStyle.wrapValue}
                          data-grand-total="1"
                        >
                          <span>{this.sumTotalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.wrapFooterAction}>
          <div className={Styles.wrapAction}>
            <div className="col-md-2 pr-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-secondary btn-lg btn-block"
              >
                Hold
              </button>
            </div>
            <div className="col-md-2">
              <Link
                className="btn btn-danger btn-lg btn-block"
                to={routes.CHECKOUT}
              >
                Empty cart
              </Link>
            </div>
            <div className="col-md-3 pl-0 pr-0">
              <button
                type="button"
                disabled={disableCheckout}
                className="btn btn-primary btn-lg btn-block"
                onClick={() => this.switchToPaymentType(CASH_PANEL)}
              >
                CASH
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
