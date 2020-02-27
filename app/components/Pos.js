import React, { Component } from 'react';
import { Redirect } from 'react-router';
import ListCart from './ListCart/ListCart';
import Styles from './pos.scss';
import CommonStyle from './styles/common.scss';
import ModalStyle from './styles/modal.scss';
import { HOME_DEFAULT_PRODUCT_LIST } from '../constants/main-panel-types';
import {
  SIMPLE,
  CONFIGURABLE,
  BUNDLE,
  GROUPED,
  CUSTOM
} from '../constants/product-types';
import Configuration from './product-types/Configuration';
import Bundle from './product-types/Bundle';
import Grouped from './product-types/Grouped';
import CartCustomer from './customer/CartCustomer';
import SignUpCustomer from './customer/SignUpCustomer/SignUpCustomer';
import CashPanel from './payment/Cash/Cash';
import CardPayment from './payment/CardPayment/CardPayment';
import Receipt from './payment/Receipt/Receipt';
import EditCart from './ListCart/EditCart/EditCart';
import { sumCartTotalPrice } from '../common/cart';
import Categories from './commons/Categories/Categories';
import routers from '../constants/routes';
import { limitLoop } from '../common/settings';
import Custom from './product-types/Custom';

type Props = {
  productList: Array<Object>,
  addToCart: (payload: Object) => void,
  holdAction: () => void,
  searchProductAction: (payload: string) => void,
  updateIsShowCardPaymentModel: (payload: string) => void,
  cartCurrent: Object,
  mainPanelType: string,
  cashCheckoutAction: () => void,
  getDetailProductConfigurable: (payload: Object) => void,
  getProductBySkuFromScanner: (payload: string) => void,
  getDetailProductBundle: (payload: Object) => void,
  getDetailProductGrouped: (payload: Object) => void,
  loadProductPaging: () => void,
  productOption: Object,
  isShowCashPaymentModel: boolean,
  isShowCardPaymentModal: boolean,
  updateIsShowingProductOption: (payload: boolean) => void,
  autoLoginToGetNewToken: () => void,
  autoSyncGroupCheckout: () => void,
  mainProductListLoading: boolean,
  isOpenReceiptModal: boolean,
  isShowModalItemEditCart: boolean,
  cartHoldList: Array<Object>,
  switchToHoldItemCart: (payload: number) => void,
  updateTriggerScannerBarcodeTriggerToFalse: (payload: boolean) => void,
  emptyCart: () => void,
  currencyCode: string,
  isLoadingSearchHandle: boolean,
  isShowHaveNoSearchResultFound: boolean,
  isOpenSignUpCustomer: boolean,
  internetConnected: boolean,
  toggleModalCalculatorStatus: boolean,
  posCommandIsFetchingProduct: boolean,
  defaultColor: string,
  hidDevice: Object
};

type State = {
  delayTimer: Object,
  typeId: string,
  redirectToAccount: boolean
};

type product = {
  id: number,
  name: string,
  sku: string
};

export default class Pos extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      delayTimer: {},
      typeId: '',
      redirectToAccount: false,
      mainWrapProductPanel: 'main-wrap-product-panel'
    };
  }

  componentDidMount(): void {
    const {
      autoLoginToGetNewToken,
      autoSyncGroupCheckout,
      hidDevice
    } = this.props;
    const loopStep = 5000;
    limitLoop(
      () => {
        autoLoginToGetNewToken();
        autoSyncGroupCheckout(loopStep);
      },
      30,
      loopStep
    );

    // Uncomment below code for testing scanner device working
    // const { getProductBySkuFromScanner } = this.props;
    // getProductBySkuFromScanner('MH11');

    const { isWaitingForListingDataEvent } = hidDevice.waitForConnect;
    if (isWaitingForListingDataEvent) {
      window.scanner.on('data', data => {
        const { getProductBySkuFromScanner } = this.props;
        getProductBySkuFromScanner(data);
      });
      window.scanner.startScanning();
    }
  }

  componentDidUpdate() {
    // eslint-disable-next-line react/destructuring-assignment
    const { product, status } = this.props.hidDevice.triggerProduct;
    if (status) {
      // Update trigger product status to false
      const { updateTriggerScannerBarcodeTriggerToFalse } = this.props;
      updateTriggerScannerBarcodeTriggerToFalse(false);
      this.preAddToCart(product);
    }
  }

  addCustomProduct = () => {
    const item = { type_id: 'CUSTOM' };
    this.preAddToCart(item);
  };

  testAction = () => {
    const { getProductBySkuFromScanner } = this.props;
    getProductBySkuFromScanner('24-MG04');
  };

  getFirstMedia = (item: Object) => {
    const gallery = item.media_gallery_entries
      ? item.media_gallery_entries
      : [];
    if (gallery.length > 0) {
      const image = gallery[0].file;
      return `${window.mainUrl}pub/media/catalog/product/${image}`;
    }
    // Return default image
    return `${window.mainUrl}pub/media/catalog/product/`;
  };

  /**
   * Handle total price
   * @returns {number}
   */
  sumTotalPrice = () => {
    const { cartCurrent, currencyCode } = this.props;
    return sumCartTotalPrice(cartCurrent, currencyCode);
  };

  /**
   * Redirect to account view
   */
  handleRedirectToAccount = () => {
    this.setState({ redirectToAccount: true });
  };

  /**
   * Pre add to cart
   * @param item
   */
  preAddToCart = (item: Object) => {
    const {
      addToCart,
      getDetailProductConfigurable,
      getDetailProductBundle,
      getDetailProductGrouped
    } = this.props;
    // Set type_id to state for switchingProductSettings render settings form
    this.setState({ typeId: item.type_id });

    if (item.type_id !== 'simple' && item.type_id !== 'downloadable') {
      // Show product option
      const { updateIsShowingProductOption } = this.props;
      updateIsShowingProductOption(true);
    }
    switch (item.type_id) {
      case CONFIGURABLE:
        {
          const { sku } = item;
          getDetailProductConfigurable({ item, sku });
        }
        break;
      case SIMPLE:
        addToCart(item);
        break;
      case BUNDLE:
        {
          const { sku } = item;
          getDetailProductBundle({ item, sku });
        }
        break;
      case GROUPED:
        {
          const { sku } = item;
          getDetailProductGrouped({ item, sku });
        }
        break;
      case CUSTOM:
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
      case CUSTOM:
        return <Custom />;
      default:
        break;
    }
  };

  /**
   * Rendering left panel, or product list or payment types
   * @param productList
   * @returns {*}
   */
  renderSwitchPanel = (productList: Array<product>): any => {
    const { mainPanelType } = this.props;

    if (mainPanelType === HOME_DEFAULT_PRODUCT_LIST) {
      return productList.map(item => {
        if (!item) return null;
        return (
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
        );
      });
    }

    return <></>;
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
  searchTyping = (e: Object) => {
    const { value } = e.target;
    const { delayTimer } = this.state;
    const { searchProductAction } = this.props;
    clearTimeout(delayTimer);
    const delayTimerRes = setTimeout(() => {
      // Do the ajax stuff
      searchProductAction(value);
    }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
    this.setState({ delayTimer: delayTimerRes });
  };

  handleScroll = e => {
    const { loadProductPaging } = this.props;
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      loadProductPaging();
    }
  };

  gotoPayView = () => {
    const { updateIsShowCardPaymentModel } = this.props;
    updateIsShowCardPaymentModel(true);
  };

  render() {
    const {
      mainProductListLoading,
      cartHoldList,
      switchToHoldItemCart,
      emptyCart,
      isLoadingSearchHandle,
      isShowHaveNoSearchResultFound,
      internetConnected,
      isOpenSignUpCustomer,
      productList,
      holdAction,
      cartCurrent,
      cashCheckoutAction,
      isShowModalItemEditCart,
      productOption,
      isShowCashPaymentModel,
      isShowCardPaymentModal,
      isOpenReceiptModal,
      toggleModalCalculatorStatus,
      posCommandIsFetchingProduct,
      defaultColor
    } = this.props;
    const { redirectToAccount, mainWrapProductPanel } = this.state;
    // Check Redirect To Layout Account
    if (redirectToAccount) {
      return <Redirect to={routers.ACCOUNT} />;
    }

    const classWrapProductPanel = `pr-3 ${Styles.wrapProductPanel} row`;
    // Enable checkout button or disable
    const disableCheckout = cartCurrent.data.length <= 0;
    const { isShowingProductOption } = productOption;

    return (
      <>
        <div
          data-tid="container"
          data-theme={
            defaultColor.general_configuration !== undefined
              ? defaultColor.general_configuration.web_pos_color
              : 'default'
          }
        >
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
            <div
              className={
                toggleModalCalculatorStatus
                  ? ModalStyle.modalContentLg
                  : ModalStyle.modalContent
              }
            >
              {isShowCashPaymentModel ? <CashPanel /> : <></>}
            </div>
          </div>
          {/* PAYMENT MODAL */}
          <div
            className={ModalStyle.modal}
            id="payModal"
            style={{ display: isShowCardPaymentModal ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContentLg}>
              {isShowCardPaymentModal ? <CardPayment /> : <></>}
            </div>
          </div>

          {/* RECEIPT MODAL */}
          <div
            id="receiptModal"
            className={ModalStyle.modal}
            style={{ display: isOpenReceiptModal ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContent} style={{ width: '450px' }}>
              {isOpenReceiptModal ? <Receipt /> : <></>}
            </div>
          </div>
          {/* Edit cart item model */}
          {isShowModalItemEditCart ? (
            <>
              <div
                id="editCartModelModal"
                className={ModalStyle.modal}
                style={{ display: 'block' }}
              >
                <div
                  className={ModalStyle.modalContent}
                  style={{ width: '450px' }}
                >
                  <EditCart />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="row" id={Styles.wrapPostContainerId}>
            <div className="col-md-9">
              <div
                className={classWrapProductPanel}
                id={mainWrapProductPanel}
                data-id="mainPosProduct"
                onScroll={this.handleScroll}
              >
                <div className="col-md-2">
                  <Categories />
                </div>
                <div className="col-md-9 mb-0 pr-0">
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
                        onInput={this.searchTyping}
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                      />
                      {isLoadingSearchHandle ? (
                        <div id={Styles.wrapSearchLoading}>
                          <div className="d-flex justify-content-center">
                            <div
                              className="spinner-border text-secondary spinner-border-sm"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {isShowHaveNoSearchResultFound ? (
                    <>
                      <p className="text-center text-muted">
                        Have no item found
                      </p>
                    </>
                  ) : (
                    <></>
                  )}
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
                <div className="col-md-12">
                  {posCommandIsFetchingProduct ? (
                    <div className="d-flex justify-content-center">
                      <div
                        className="spinner-border text-secondary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
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
                          <span>ORDER TOTAL</span>
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
        <div
          data-theme={
            defaultColor.general_configuration !== undefined
              ? defaultColor.general_configuration.web_pos_color
              : 'default'
          }
          className={Styles.wrapFooterAction}
        >
          <div className={Styles.wrapActionFirstLine}>
            {cartHoldList.map((item, index) => {
              return (
                <div key={index} className="col-md-1 pr-1 pl-0">
                  <button
                    type="button"
                    onClick={() => switchToHoldItemCart(index)}
                    className="btn btn-outline-secondary btn-lg btn-block"
                  >
                    {index + 1}
                  </button>
                </div>
              );
            })}
            <div className="col-md-2 pr-1 pl-0">
              <button
                type="button"
                onClick={holdAction}
                disabled={cartCurrent.data.length <= 0}
                className="btn btn-outline-dark btn-lg btn-block"
              >
                Hold
              </button>
            </div>
          </div>
          <div className={Styles.wrapActionSecondLine}>
            <div className="col-md-1 pl-0 pr-1">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg btn-block"
                onClick={this.handleRedirectToAccount}
              >
                Account
              </button>
            </div>
            <div className="col-md-2 pl-0 pr-1">
              <button
                type="button"
                disabled={cartCurrent.data.length <= 0}
                className="btn btn-outline-danger btn-lg btn-block"
                onClick={emptyCart}
              >
                Empty cart
              </button>
            </div>
            <div className="col-md-2 pr-1 pl-0">
              <CartCustomer />
              {isOpenSignUpCustomer ? <SignUpCustomer /> : null}
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
                onClick={this.gotoPayView}
                className="btn btn-outline-primary btn-lg btn-block"
              >
                Pay
              </button>
            </div>
          </div>
          <div className={`${Styles.wrapFooterLine} theme-line`}>
            <div className={Styles.wrapLeft}>&nbsp;</div>
            <div className={Styles.wrapRight}>
              <div className={Styles.wrapStatusOnline} />
              <div className={Styles.wrapClock}>
                <span>
                  {' '}
                  {internetConnected ? (
                    <span className="text-success text-bold font-weight-bolder theme-line">
                      Online
                    </span>
                  ) : (
                    <span className="text-danger text-bold font-weight-bolder">
                      Offline
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
