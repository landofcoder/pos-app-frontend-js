import React, { Component } from 'react';
import Modal from 'react-modal';
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
import CashPanel from './payment/Cash/Cash';
import CardPayment from './payment/CardPayment/CardPayment';
import Receipt from './payment/Receipt/Receipt';
import EditCart from './ListCart/EditCart/EditCart';
import { sumCartTotalPrice } from '../common/cart';
import Categories from './commons/Categories/Categories';
import Custom from './product-types/Custom';
import routes from '../constants/routes';
import Menu from './commons/menu';
import Plus from './commons/plus';
import License from './License';
import StockDisplay from './commons/StockDisplay/StockDisplay';
import Settings from './commons/settings';

type Props = {
  productList: Array<Object>,
  addToCart: (payload: Object) => void,
  appLicense: Object,
  holdAction: () => void,
  searchProductAction: (payload: string) => void,
  updateIsShowCardPaymentModel: (payload: string) => void,
  cartCurrent: Object,
  mainPanelType: string,
  checkoutAction: () => void,
  getDetailProductConfigurable: (payload: Object) => void,
  toggleModelCategories: (payload: boolean) => void,
  getProductByBarcodeFromScanner: (payload: string) => void,
  getDetailProductBundle: (payload: Object) => void,
  getDetailProductGrouped: (payload: Object) => void,
  loadProductPaging: () => void,
  productOption: Object,
  isShowCashPaymentModel: boolean,
  isShowCardPaymentModal: boolean,
  updateIsShowingProductOption: (payload: boolean) => void,
  mainProductListLoading: boolean,
  isOpenReceiptModal: boolean,
  isShowModalItemEditCart: boolean,
  cartHoldList: Array<Object>,
  switchToHoldItemCart: (payload: number) => void,
  updateTriggerScannerBarcodeTriggerToFalse: (payload: boolean) => void,
  startCashCheckoutAction: () => void,
  emptyCart: () => void,
  isLoadingSearchHandle: boolean,
  isShowHaveNoSearchResultFound: boolean,
  internetConnected: boolean,
  posCommandIsFetchingProduct: boolean,
  isOpenCategoriesModel: boolean,
  defaultColor: string,
  hidDevice: Object,
  history: (payload: string) => void,
  appInfo: Object
};

type State = {
  delayTimer: Object,
  typeId: string
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
      mainWrapProductPanel: 'main-wrap-product-panel'
    };
  }

  componentDidMount(): void {
    const { hidDevice } = this.props;
    // Uncomment below code for testing scanner device working
    // const { getProductByBarcodeFromScanner } = this.props;
    // getProductByBarcodeFromScanner('1-NgJAq6C1');

    const { isWaitingForListingDataEvent } = hidDevice.waitForConnect;
    if (isWaitingForListingDataEvent) {
      window.scanner.on('data', data => {
        const { getProductByBarcodeFromScanner } = this.props;
        getProductByBarcodeFromScanner(data);
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
    const item = { type_id: 'custom_product_type_code' };
    this.preAddToCart(item);
  };

  testAction = () => {
    const { getProductByBarcodeFromScanner } = this.props;
    getProductByBarcodeFromScanner('7-1C4PASWT');
  };

  getSmallImage = (item: Object) => {
    const { appInfo } = this.props;
    // eslint-disable-next-line camelcase
    const baseImage = appInfo.product_image_base_url;
    const gallery = item.media_gallery_entries
      ? item.media_gallery_entries
      : [];
    if (gallery.length > 0) {
      const image = gallery[0].file;
      return `${baseImage}/pub/media/catalog/product/${image}`;
    }
    // Return default image
    return `${baseImage}/pub/media/catalog/product/`;
  };

  /**
   * Handle total price
   * @returns {number}
   */
  sumTotalPrice = () => {
    const { cartCurrent } = this.props;
    return sumCartTotalPrice(cartCurrent);
  };

  /**
   * Redirect to account view
   */
  handleRedirectToAccount = () => {
    const { history } = this.props;
    history.push(routes.ACCOUNT);
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
              <div
                className="card-body"
                style={{ paddingTop: '5px', paddingBottom: '5px' }}
              >
                <StockDisplay item={item} />
                <a
                  role="presentation"
                  className={Styles.wrapImageBlock}
                  onClick={() => this.preAddToCart(item)}
                >
                  <div className={Styles.wrapProductImage}>
                    <div className={Styles.inside}>
                      <img alt="name" src={this.getSmallImage(item)} />
                    </div>
                  </div>
                  <div className={Styles.wrapProductInfo}>
                    <span
                      className={Styles.wrapProductName}
                      dangerouslySetInnerHTML={{ __html: item.name }}
                    />
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

  showPaymentView = () => {
    const { updateIsShowCardPaymentModel, checkoutAction } = this.props;

    // Show card payment modal
    updateIsShowCardPaymentModel(true);

    // Trigger to checkout action
    checkoutAction();
  };

  closeCategoriesModal = () => {
    const { toggleModelCategories } = this.props;
    toggleModelCategories(false);
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
      productList,
      holdAction,
      cartCurrent,
      isShowModalItemEditCart,
      productOption,
      isShowCashPaymentModel,
      isShowCardPaymentModal,
      isOpenReceiptModal,
      posCommandIsFetchingProduct,
      defaultColor,
      startCashCheckoutAction,
      isOpenCategoriesModel,
      toggleModelCategories,
      appLicense
    } = this.props;
    const { mainWrapProductPanel } = this.state;
    // Check Redirect To Layout Account
    const classWrapProductPanel = `pr-3 ${Styles.wrapProductPanel}`;
    // Disable checkout when have no cart current or expired the trial
    const { lock } = appLicense;
    let disableCheckout = true;
    if (!lock && cartCurrent.data.length > 0) {
      disableCheckout = false;
    }
    const { isShowingProductOption } = productOption;
    return (
      <>
        <Modal
          overlayClassName={ModalStyle.Overlay}
          shouldCloseOnOverlayClick
          onRequestClose={this.closeCategoriesModal}
          className={`${ModalStyle.Modal} ${ModalStyle.CategoryModal}`}
          isOpen={isOpenCategoriesModel}
          contentLabel="Example Modal"
        >
          <Categories />
        </Modal>
        <div
          data-tid="container"
          data-theme={
            defaultColor.general_configuration !== undefined
              ? defaultColor.general_configuration.web_pos_color
              : 'default'
          }
        >
          {isShowingProductOption ? this.switchingProductSettings() : <></>}
          {isShowCashPaymentModel ? <CashPanel /> : <></>}
          {isShowCardPaymentModal ? <CardPayment /> : <></>}
          {isShowModalItemEditCart ? <EditCart /> : <></>}
          {isOpenReceiptModal ? <Receipt /> : <></>}
          {/* RECEIPT MODAL */}

          <div className="row" id={Styles.wrapPostContainerId}>
            <div className="col-md-9 pt-3 pl-0 pr-0">
              <div
                className={classWrapProductPanel}
                id={mainWrapProductPanel}
                data-id="mainPosProduct"
                onScroll={this.handleScroll}
              >
                {/* Header action begin */}
                <div className={`row ${Styles.wrapTop}`}>
                  <div className={`${Styles.wrapTopActions} col-md-2`}>
                    <span
                      role="presentation"
                      onClick={() => toggleModelCategories(true)}
                      className={CommonStyle.btnActionPadding}
                    >
                      <Menu />
                    </span>
                    <span
                      role="presentation"
                      className={CommonStyle.btnActionPadding}
                      onClick={() => {
                        this.addCustomProduct();
                      }}
                    >
                      <Plus />
                    </span>
                  </div>
                  <div className="col-md-5 mb-0 pr-0">
                    <div className="input-group flex-nowrap">
                      <div className="input-group input-group-sm mb-3">
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
                  <div className="col-md-5 text-right">
                    <License />
                  </div>
                </div>
                {/* Header action end */}

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
                  <div className="row pl-2 pr-2">
                    {this.renderSwitchPanel(productList)}
                  </div>
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
            <div className="col-md-3 pl-0 pr-0">
              <div className={`${CommonStyle.wrapLevel1} pt-3`}>
                <div className={CommonStyle.wrapCartPanelPosition}>
                  <ListCart />
                  <div className={CommonStyle.subTotalContainer}>
                    <div className={`${CommonStyle.wrapSubTotal} pr-3`}>
                      <div className={CommonStyle.wrapRow}>
                        <div
                          className={CommonStyle.wrapLabel}
                          data-grand-total="1"
                        >
                          <span>Subtotal:</span>
                        </div>
                        <div
                          className={CommonStyle.wrapValue}
                          data-grand-total="1"
                        >
                          <span className="font-weight-bold">
                            {this.sumTotalPrice()}
                          </span>
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
          <div className={`${Styles.wrapActionFirstLine} pt-2`}>
            {cartHoldList.map((item, index) => {
              return (
                <div key={index} className="col-md-1 pr-1 pl-0">
                  <button
                    type="button"
                    onClick={() => switchToHoldItemCart(index)}
                    className="btn btn-outline-dark btn-block"
                  >
                    {index + 1}
                  </button>
                </div>
              );
            })}
            <div className="col-md-2 pr-0 pl-0">
              <button
                type="button"
                onClick={holdAction}
                disabled={cartCurrent.data.length <= 0}
                className="btn btn-outline-dark btn-block"
              >
                Hold
              </button>
            </div>
          </div>
          <div className={Styles.wrapActionSecondLine}>
            <div className="col-md-1 pl-0 pr-1 text-right">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={this.handleRedirectToAccount}
              >
                <Settings />
              </button>
            </div>
            <div className="col-md-2 pl-0 pr-1">
              <button
                type="button"
                disabled={cartCurrent.data.length <= 0}
                className="btn btn-outline-danger btn-block"
                onClick={emptyCart}
              >
                Empty cart
              </button>
            </div>
            <div className="col-md-2 pr-1 pl-0">
              <CartCustomer />
            </div>
            <div className="col-md-3 pl-0 pr-0">
              {lock ? (
                <div
                  style={{ opacity: 1 }}
                  className="tooltip bs-tooltip-top"
                  role="tooltip"
                >
                  <div className="arrow"></div>
                  <div className="tooltip-inner">
                    Please upgrade to use this feature
                  </div>
                </div>
              ) : (
                <></>
              )}
              <button
                type="button"
                disabled={disableCheckout}
                className="btn btn-primary btn-block"
                onClick={startCashCheckoutAction}
              >
                Cash
              </button>
            </div>
            <div className="col-md-2 pl-1 pr-0">
              {lock ? (
                <div
                  style={{ opacity: 1 }}
                  className="tooltip bs-tooltip-top"
                  role="tooltip"
                >
                  <div className="arrow"></div>
                  <div className="tooltip-inner">
                    Please upgrade to use this feature
                  </div>
                </div>
              ) : (
                <></>
              )}
              <button
                type="button"
                disabled={disableCheckout}
                onClick={this.showPaymentView}
                className="btn btn-outline-primary btn-block"
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
                    <span className="text-muted font-weight-bolder theme-line">
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
