// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListCart from './cart/ListCart';
import routes from '../constants/routes';
import Styles from './pos.scss';
import CommonStyle from './styles/common.scss';
import ModalStyle from './styles/modal.scss';
import { HOME_DEFAULT_PRODUCT_LIST } from '../constants/main-panel-types';
import {
  SIMPLE,
  CONFIGURABLE,
  BUNDLE,
  GROUPED
} from '../constants/product-types';
import { baseUrl } from '../params';
import Configuration from './product-types/Configuration';
import Bundle from './product-types/Bundle';
import Grouped from './product-types/Grouped';
import CartCustomer from './customer/CartCustomer';
import CashPanel from './payment/Cash/Cash';
import Receipt from './payment/Receipt/Receipt';

type Props = {
  productList: Array,
  addToCart: (payload: Object) => void,
  holdAction: () => void,
  searchAction: (payload: string) => void,
  getDefaultProductAction: () => void,
  cartCurrent: Array,
  mainPanelType: string,
  cashCheckoutAction: () => void,
  getDetailProductConfigurable: (sku: string) => void,
  getDetailProductBundle: (sku: string) => void,
  getDetailProductGrouped: (sku: string) => void,
  productOption: Object,
  isShowCashPaymentModel: boolean,
  token: string,
  updateIsShowingProductOption: () => void,
  mainProductListLoading: boolean,
  isOpenReceiptModal: Object
};

export default class POS extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      delayTimer: null,
      typeId: ''
    };
    localStorage.setItem('posAppData', '');
    console.log('set cookie to null');
    console.log(localStorage.getItem('posAppData'));
  }

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

  /**
   * Handle total price
   * @returns {number}
   */
  sumTotalPrice = () => {
    const { cartCurrent } = this.props;
    let totalPrice = 0;
    cartCurrent.data.forEach(item => {
      if (!item.type_id || item.type_id !== 'bundle') {
        totalPrice += item.price.regularPrice.amount.value;
      } else {
        totalPrice += this.sumBundlePrice(item);
      }
    });

    return totalPrice;
  };

  /**
   * Sum bundle price
   * @param item
   */
  sumBundlePrice = item => {
    // Bundle type
    let price = 0;
    const { items } = item;
    items.forEach(itemBundle => {
      const listOptionSelected = this.findOptionSelected(
        itemBundle.option_selected,
        itemBundle.options
      );
      if (listOptionSelected.length > 0) {
        // Get product
        listOptionSelected.forEach(itemOption => {
          price += itemOption.product.price.regularPrice.amount.value;
        });
      }
    });
    return price;
  };

  /**
   * Find option selected
   * @param optionSelected
   * @param options
   */
  findOptionSelected = (optionSelected, options) => {
    const listProductSelected = [];
    options.forEach(item => {
      if (optionSelected.indexOf(item.id) !== -1) {
        // Exists item
        listProductSelected.push(item);
      }
    });
    return listProductSelected;
  };

  /**
   * Pre add to cart
   * @param item
   */
  preAddToCart = item => {
    const {
      addToCart,
      getDetailProductConfigurable,
      getDetailProductBundle,
      getDetailProductGrouped
    } = this.props;
    // Set type_id to state for switchingProductSettings render settings form
    this.setState({ typeId: item.type_id });

    if (item.type_id !== 'simple') {
      // Show product option
      const { updateIsShowingProductOption } = this.props;
      updateIsShowingProductOption(true);
    }

    switch (item.type_id) {
      case CONFIGURABLE:
        {
          const { sku } = item;
          getDetailProductConfigurable(sku);
        }
        break;
      case SIMPLE:
        addToCart(item);
        break;
      case BUNDLE:
        {
          const { sku } = item;
          getDetailProductBundle(sku);
        }
        break;
      case GROUPED:
        {
          const { sku } = item;
          getDetailProductGrouped(sku);
        }
        break;
      default:
        addToCart(item);
        break;
    }
  };

  /**
   * Switching product config render
   * @returns {*}
   */
  switchingProductSettings = () => {
    const { typeId } = this.state;
    switch (typeId) {
      case CONFIGURABLE:
        return <Configuration />;
      case BUNDLE:
        return <Bundle />;
      case GROUPED:
        return <Grouped />;
      default:
        break;
    }
  };

  /**
   * Rendering left panel, or product list or payment types
   * @param productList
   * @returns {*}
   */
  renderSwitchPanel = productList => {
    const { mainPanelType } = this.props;

    switch (mainPanelType) {
      case HOME_DEFAULT_PRODUCT_LIST:
        return productList.map(item => (
          <div
            className={`col-md-3 mb-3 pr-0 ${Styles.wrapProductItem} ${Styles.itemSameHeight}`}
            key={item.id}
          >
            <div className={`card ${Styles.itemCart}`}>
              <div className="card-body">
                <a
                  role="presentation"
                  className={CommonStyle.pointer}
                  onClick={() => this.preAddToCart(item)}
                >
                  <div className={Styles.wrapProductImage}>
                    <div className={Styles.inside}>
                      <img alt="name" src={this.getFirstMedia(item)} />
                    </div>
                  </div>
                  <div className={Styles.wrapProductInfo}>
                    <span className={Styles.wrapProductName}>{item.name}</span>
                    <span className={Styles.wrapSku}>{item.sku}</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        ));
      default:
        return <></>;
    }
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

  /**
   * When cashier input search
   * @param e
   */
  searchTyping = e => {
    const { value } = e.target;
    const { delayTimer } = this.state;
    const { searchAction } = this.props;
    clearTimeout(delayTimer);
    const delayTimerRes = setTimeout(() => {
      // Do the ajax stuff
      searchAction(value);
    }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
    this.setState({ delayTimer: delayTimerRes });
  };

  render() {
    const { token, mainProductListLoading } = this.props;
    // Check login
    if (token === '') {
      // return <Redirect to={routes.LOGIN} />;
    }
    const classWrapProductPanel = `pr-3 ${Styles.wrapProductPanel} row`;
    const {
      productList,
      holdAction,
      cartCurrent,
      cashCheckoutAction
    } = this.props;
    // Enable checkout button or disable
    const disableCheckout = cartCurrent.data.length <= 0;
    const {
      productOption,
      isShowCashPaymentModel,
      isOpenReceiptModal
    } = this.props;
    const { isShowingProductOption } = productOption;

    return (
      <>
        <div data-tid="container">
          {/* OPTION MODEL (PRODUCT CONFIGURABLE, PRODUCT BUNDLE, PRODUCT GROUPED) */}
          <div
            id="modalProductOption"
            style={{ display: isShowingProductOption ? 'block' : 'none' }}
            className={ModalStyle.modal}
          >
            <div className={ModalStyle.modalContent}>
              {this.switchingProductSettings()}
            </div>
          </div>
          {/* CASH PAYMENT MODAL */}
          <div
            className={ModalStyle.modal}
            id="cashPaymentModal"
            style={{ display: isShowCashPaymentModel ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContent}>
              {isShowCashPaymentModel ? <CashPanel /> : <></>}
            </div>
          </div>
          {/* RECEIPT MODAL */}
          <div
            id="receiptModal"
            className={ModalStyle.modal}
            style={{ display: isOpenReceiptModal ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContent}>
              <Receipt />
            </div>
          </div>
          <div className="row" id={Styles.wrapPostContainerId}>
            <div className="col-md-9">
              <div className={classWrapProductPanel}>
                <div className="col-md-12 mb-0 pr-0">
                  <div className="input-group flex-nowrap">
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="basic-addon1">
                          Search
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="sku, product name"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                    </div>
                  </div>
                </div>
                {mainProductListLoading ? (
                  <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                      <div
                        className="spinner-border text-secondary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  this.renderSwitchPanel(productList)
                )}
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
          <div className={Styles.wrapActionFirstLine}>
            <div className="col-md-1 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                7
              </button>
            </div>
            <div className="col-md-1 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                6
              </button>
            </div>
            <div className="col-md-1 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                5
              </button>
            </div>
            <div className="col-md-1 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                4
              </button>
            </div>
            <div className="col-md-1 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                3
              </button>
            </div>
            <div className="col-md-1 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                2
              </button>
            </div>
            <div className="col-md-1 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-secondary btn-lg btn-block"
              >
                1
              </button>
            </div>
            <div className="col-md-2 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-outline-dark btn-lg btn-block"
              >
                Hold
              </button>
            </div>
          </div>
          <div className={Styles.wrapActionSecondLine}>
            <div className="col-md-1 pl-0 pr-1">
              <Link
                className="btn btn-outline-secondary btn-lg btn-block"
                to={routes.CHECKOUT}
              >
                Account
              </Link>
            </div>
            <div className="col-md-2 pl-0 pr-1">
              <Link
                className="btn btn-outline-danger btn-lg btn-block"
                to={routes.CHECKOUT}
              >
                Empty cart
              </Link>
            </div>
            <div className="col-md-2 pr-1 pl-0">
              <CartCustomer />
            </div>
            <div className="col-md-3 pl-0 pr-0">
              <button
                type="button"
                disabled={disableCheckout}
                className="btn btn-primary btn-lg btn-block"
                onClick={cashCheckoutAction}
              >
                CASH
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn-lg btn-block"
              >
                Card
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
