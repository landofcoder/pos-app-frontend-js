// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListCart from './cart/ListCart';
import routes from '../constants/routes';
import Styles from './Home.scss';
import CommonStyle from './styles/common.scss';
import ModalStyle from './styles/modal.scss';
import {
  HOME_DEFAULT_PRODUCT_LIST,
  CASH_PANEL
} from '../constants/main-panel-types';
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

type Props = {
  productList: Array,
  addToCart: (payload: Object) => void,
  holdAction: () => void,
  searchAction: (payload: string) => void,
  getDefaultProductAction: () => void,
  cartCurrent: Array,
  mainPanelType: string,
  updateMainPanelType: (payload: string) => void,
  cashCheckoutAction: () => void,
  getDetailProductConfigurable: (sku: string) => void,
  getDetailProductBundle: (sku: string) => void,
  getDetailProductGrouped: (sku: string) => void,
  productOption: Object,
  isShowCashPaymentModel: boolean,
  token: string,
  showCashModal: (payload: boolean) => void
};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      delayTimer: null,
      typeId: '',
      sideBarShow: false
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
    const { mainPanelType, productOption } = this.props;
    const { isLoadingProductOption } = productOption;

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
                  {isLoadingProductOption ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <></>
                  )}
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
   * Change payment type for switching left panel
   * @param paymentType
   */
  switchToPaymentType = paymentType => {
    // Switch main panel type
    // const { updateMainPanelType } = this.props;
    // updateMainPanelType(paymentType);

    console.log('payment type:', paymentType);

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

  actionSideBar = () => {
    const { sideBarShow } = this.state;
    if (sideBarShow) {
      this.setState({ sideBarShow: false });
    } else this.setState({ sideBarShow: true });
  };

  setActionNavBar = action => {
    this.setState({ sideBarShow: action });
  };

  render() {
    //  ================Check login======================
    const { token } = this.props;
    if (token === '') {
      // return <Redirect to={routes.LOGIN} />;
    }

    //  ================Check login======================
    const classWrapProductPanel = `pr-3 ${Styles.wrapProductPanel} row`;
    const { productList, holdAction, cartCurrent } = this.props;
    // Enable checkout button or disable
    const disableCheckout = cartCurrent.data.length <= 0;
    const { productOption, isShowCashPaymentModel } = this.props;
    const { sideBarShow } = this.state;
    const { isShowingProductOption } = productOption;
    return (
      <>
        <div data-tid="container">
          <div
            id="myModal"
            style={{ display: isShowingProductOption ? 'block' : 'none' }}
            className={ModalStyle.modal}
          >
            <div className={ModalStyle.modalContent}>
              {this.switchingProductSettings()}
            </div>
          </div>

          <div
            className={ModalStyle.modal}
            id="cashPaymentModal"
            style={{ display: isShowCashPaymentModel ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContent}>
              {isShowCashPaymentModel ? <CashPanel /> : <></>}
            </div>
          </div>

          <div
            style={{ display: sideBarShow ? 'block' : 'none' }}
            role="button"
            tabIndex="0"
            onClick={() => this.actionSideBar(false)}
            onKeyDown={() => this.actionSideBar(false)}
            className={ModalStyle.modal}
          ></div>
          <div className="row" id={Styles.wrapPostContainerId}>
            {/* <SideBar statusAction={sideBarShow} /> */}
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
                {this.renderSwitchPanel(productList)}
              </div>
            </div>
            <div className="col-md-3">
              <div className={CommonStyle.wrapLevel1}>
                <div className={CommonStyle.wrapCartPanelPosition}>
                  <div className={CommonStyle.wrapCustomerOrder}>
                    <button
                      type="button"
                      onClick={this.actionSideBar}
                      style={{ display: 'none' }}
                      className={`btn btn-info ${Styles.fixIndex}`}
                    >
                      SideBar
                    </button>
                  </div>
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
                onClick={() => this.switchToPaymentType(CASH_PANEL)}
              >
                CASH
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              <button
                type="button"
                className="btn btn-outline-primary btn-lg btn-block"
                onClick={() => this.switchToPaymentType(CASH_PANEL)}
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
