import produce from 'immer';
import * as types from '../constants/root';
import {
  CHILDREN,
  HOME_DEFAULT_PRODUCT_LIST,
  LOADING,
  LOGIN_FORM,
  WORK_PLACE_FORM
} from '../constants/main-panel-types';
import { testCartCurrentForDefaultReceipt } from './common';
import { getShippingMethodCode } from '../common/settings';

const cartCurrentDefaultData = {
  cartId: '',
  customerToken: '',
  data: [],
  customer: null, // Current customer for current cart
  isGuestCustomer: true
};

const toggleActionOrderDefaultData = {
  dataActionOrder: {},
  isOpenToggleActionOrder: false,
  isLoadingSetOrderAction: false,
  isLoadingGetDataOrderAction: true,
  typeOpenToggle: null
};

const initialState = {
  switchingMode: LOADING, // LOADING, LOGIN_FORM, CHILDREN, SYNC_SCREEN
  flagSwitchModeCounter: 1, // When this flag counter up, render in App.js will re-render and backgroundLogin will re-check
  setup: {
    stateFetchingConfig: 0, // 0 = loading, 1 = succeed
    stateSynchronizingCategoriesAndProducts: 0, // 0 = loading, 1 = succeed
    stateSyncProductBarCodeInventory: 0,
    stateSyncProductInventory: 0
  },
  currentPosCommand: {
    query: {
      categoryId: 0, // For product type
      searchValue: '', // For search type
      currentPage: '',
      type: ''
    },
    isFetchingProduct: false,
    lockPagingForFetching: false,
    reachedLimit: false
  }, // Current POS product filter by to paging
  internetConnected: false,
  isLoadingSearchHandle: false, // Main search loading
  isShowHaveNoSearchResultFound: false,
  isLoadingRequireStep: false,
  isLoadingBackToLogin: false,
  isShowLogsMessages: false,
  typeShowLogsMessages: null,
  posSystemConfig: {}, // General config for pos <= must remove soon
  generalConfig: {},
  mainPanelType: HOME_DEFAULT_PRODUCT_LIST, // Main panel type for switching all main panel
  mainProductListLoading: false, // Main product list loading
  messageSignUpCustomer: null,
  productList: [],
  cartCurrent: cartCurrentDefaultData,
  switchHoldCartIndex: -1,
  receipt: {
    orderId: 0, // Last order is inserted
    isOpenReceiptModal: false,
    cartForReceipt: testCartCurrentForDefaultReceipt // When customer checkout succeed, copy current cart to this
  },
  checkout: {
    isShowCashPaymentModel: false,
    isShowCardPaymentModal: false,
    loadingPreparingOrder: false, // Status cash loading for preparing to show cash payment form
    orderPreparingCheckout: {
      currency_id: '',
      email: '',
      posSystemConfigResult: {},
      detailOutletResult: {},
      shipping_address: {
        country_id: '',
        street: [],
        company: '',
        telephone: '',
        postcode: '',
        city: '',
        firstname: '',
        lastname: '',
        email: '',
        sameAsBilling: 1,
        shipping_method: '',
        method: ''
      },
      totals: {
        base_discount_amount: 0,
        init_discount_amount: 0,
        base_subtotal: 0,
        grand_total: 0,
        tax_amount: 0,
        base_shipping_amount: 0,
        discount_code: '',
        listGiftCard_code: [],
        amount_discount_code: 0
      }
    },
    cardPayment: {
      type: 'stripe', // cash, stripe, authorize
      cardInfo: {
        nameOnCard: '',
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvc: ''
      },
      resultCharge: 0, // Default is 0, and with payment.json types
      isLoadingCharging: false
    },
    rewardPoint: {
      isShowRewardPoint: false,
      isLoadingRewardPointInfo: true,
      info: {
        // Res from api includes points balance, list rules
        list_rules: {
          items: []
        }
      }
    }
  },
  cartHoldList: [],
  itemCartEditing: {
    index: 0,
    showModal: false,
    item: {}
  },
  allCategories: null, // Main store categories
  customReceipt: {
    cashier_label: null,
    cashier_name_display: '0',
    change_amount_display: '0',
    change_label: null,
    credit_amount_display: '0',
    credit_label: null,
    customer_display: '0',
    date_display: '0',
    discount_display: '0',
    discount_label: null,
    footer_content: null,
    grand_total_label: null,
    header_content: null,
    icon: null,
    image: null,
    logo_alt: null,
    logo_display: '0',
    logo_height: null,
    logo_width: null,
    order_id_display: '0',
    order_id_label: null,
    outlet_address_display: '0',
    outlet_name_display: '0',
    receipt_id: '1',
    receipt_title: 'receipt',
    status: '1',
    subtotal_display: '0',
    subtotal_label: null,
    tax_display: '0',
    tax_label: null
  },
  orderHistory: [],
  orderHistoryDetail: {},
  orderHistoryDetailOffline: {},
  order_id_history: null,
  isOpenFindCustomer: false,
  isOpenCategoriesModel: false,
  toggleActionOrder: toggleActionOrderDefaultData,
  isOpenSignUpCustomer: false,
  isOpenCalculator: false,
  isOpenDetailOrder: false,
  isOpenDetailOrderOffline: false,
  isLoadingSearchCustomer: false,
  isLoadingOrderHistory: false,
  isLoadingNoteOrderAction: false,
  isLoadingOrderHistoryDetail: true,
  isLoadingOrderHistoryDetailOffline: true,
  isLoadingSignUpCustomer: false,
  customerSearchResult: [],
  isLoadingCashPlaceOrder: false,
  productOption: {
    // State product option for all product type configurable, bundle, grouped product
    isLoadingProductOption: false, // Show a loading in screen for product option loading
    isShowingProductOption: false, // Show model for choose product type option
    isShowingProductCustom: false,
    optionValue: null // Keep detail product clicked
  },
  // For scanner device
  hidDevice: {
    allDevices: [], // All devices HID
    errorConnect: false,
    connectedDeviceStatus: false,
    connectedDeviceItem: {},
    waitForConnect: {
      isWaitingForListingDataEvent: false
    },
    triggerProduct: {
      status: false,
      product: {}
    }
  }
};

/*eslint-disable*/
const mainRd = (state: Object = initialState, action: Object) =>
  produce(state, draft => {
    switch (action.type) {
      case types.RECEIVED_GENERAL_CONFIG:
        draft.generalConfig = action.payload;
        break;
      case types.SETUP_UPDATE_STATE_FETCHING_CONFIG:
        draft.setup.stateFetchingConfig = action.payload;
        break;
      case types.SETUP_UPDATE_STATE_SYNCHRONIZING_CATEGORIES_AND_PRODUCTS:
        draft.setup.stateSynchronizingCategoriesAndProducts = action.payload;
        break;
      case types.SETUP_UPDATE_STATE_SYNC_PRODUCT_BAR_CODE_INVENTORY:
        draft.setup.stateSyncProductBarCodeInventory = action.payload;
        break;
      case types.SETUP_UPDATE_STATE_SYNC_PRODUCT_INVENTORY:
        draft.setup.stateSyncProductInventory = action.payload;
        break;
      case types.UPDATE_IS_SHOW_CARD_PAYMENT_MODAL:
        draft.checkout.isShowCardPaymentModal = action.payload;
        break;
      case types.RECEIVED_PRODUCT_RESULT:
        draft.productList = action.payload;
        break;
      case types.JOIN_PRODUCT_RESULT:
        draft.productList = draft.productList.concat(action.payload);
        break;
      case types.UPDATE_LOADING_PREPARING_ORDER:
        draft.checkout.loadingPreparingOrder = action.payload;
        break;
      case types.UPDATE_MAIN_PANEL_TYPE:
        draft.mainPanelType = action.payload;
        break;
      case types.UPDATE_CART_TOKEN_TO_CURRENT_CART:
        draft.cartCurrent.customerToken = action.payload;
        break;
      case types.UPDATE_IS_LOADING_PRODUCT_OPTION:
        draft.productOption.isLoadingProductOption = action.payload;
        break;
      case types.UPDATE_IS_SHOWING_PRODUCT_OPTION:
        draft.productOption.isShowingProductOption = action.payload;
        // Reset option value after close modal
        if (action.payload === false) {
          draft.productOption.optionValue = null;
        }
        break;
      case types.UPDATE_PRODUCT_OPTION_VALUE: {
        draft.productOption.optionValue = action.payload;
        break;
      }
      case types.REMOVE_ITEM_OUT_CART:
        draft.cartCurrent.data.splice(action.payload, 1);
        break;
      case types.UPDATE_CONFIGURABLE_PRODUCT_OPTION: {
        const { index } = action.payload.payload;
        const { value } = action.payload.payload.event.target;
        draft.productOption.optionValue.configurable_options[
          index
        ].pos_selected = value;
        break;
      }
      case types.ON_BUNDLE_SELECTED_RADIO_ONCHANGE: {
        const { index } = action.payload;
        const { id } = action.payload;
        draft.productOption.optionValue.items[index].option_selected = [id];
        break;
      }
      case types.ON_BUNDLE_SELECTED_SELECT_ONCHANGE: {
        const { index } = action.payload;
        const { value } = action.payload;
        draft.productOption.optionValue.items[index].option_selected = [
          Number(value)
        ];
        break;
      }
      case types.ON_BUNDLE_SELECTED_CHECKBOX_ONCHANGE: {
        const { index, arraySelected } = action.payload;
        draft.productOption.optionValue.items[
          index
        ].option_selected = arraySelected;
        break;
      }
      case types.ON_BUNDLE_SELECTED_MULTIPLE_ONCHANGE: {
        const { index, arraySelected } = action.payload;
        draft.productOption.optionValue.items[
          index
        ].option_selected = arraySelected;
        break;
      }
      case types.ON_BUNDLE_SELECTED_MULTIPLE_REMOVE_ITEM_ONCHANGE: {
        const { index, indexOf } = action.payload;
        draft.productOption.optionValue.items[index].option_selected.splice(
          indexOf,
          1
        );
        break;
      }
      case types.ON_BUNDLE_SELECTED_MULTIPLE_PUSH_ITEM_ONCHANGE: {
        const { index, id } = action.payload;
        draft.productOption.optionValue.items[index].option_selected.push(id);
        break;
      }
      case types.ON_GROUPED_QTY_CHANGE: {
        const { index, value } = action.payload;
        draft.productOption.optionValue.items[index].qty = value;
        break;
      }
      case types.ON_BUNDLE_PRODUCT_QTY_ONCHANGE: {
        const { index, optionId, value } = action.payload;
        draft.productOption.optionValue.items[
          index
        ].options = draft.productOption.optionValue.items[index].options.map(
          item => {
            if (item.id === optionId) {
              item.qty = Number(value);
              return item;
            }
            return item;
          }
        );
        break;
      }
      case types.TOGGLE_MODAL_CUSTOMER:
        draft.isOpenFindCustomer = action.payload;
        break;
      case types.RECEIVED_GET_ACTION_ORDER:
        // bug in case is if we trans toggle to another while data is calling it will wrong show display and stop app when data come back
        if (action.payload.type === draft.toggleActionOrder.typeOpenToggle) {
          draft.toggleActionOrder.dataActionOrder = action.payload.data;
        }
        break;
      case types.TOGGLE_MODAL_ACTION_ORDER:
        if (action.payload.status) {
          draft.toggleActionOrder.isOpenToggleActionOrder = true;
          draft.toggleActionOrder.typeOpenToggle = action.payload.type;
        } else {
          draft.toggleActionOrder = toggleActionOrderDefaultData;
        }
        break;
      case types.TOGGLE_MODAL_SIGN_UP_CUSTOMER:
        draft.isOpenSignUpCustomer = action.payload;
        break;
      case types.UPDATE_IS_LOADING_SEARCH_CUSTOMER:
        draft.isLoadingSearchCustomer = action.payload;
        break;
      case types.RECEIVED_CUSTOMER_SEARCH_RESULT:
        draft.customerSearchResult = action.searchResult.items;
        break;
      case types.REFRESH_DISCOUNT_CODE:
        draft.checkout.orderPreparingCheckout.totals.amount_discount_code = 0;
        draft.checkout.orderPreparingCheckout.totals.discount_code = 0;
        break;
      case types.SELECT_CUSTOMER_FOR_CURRENT_CART:
        if (action.payload.synced === false)
          draft.cartCurrent.customer = action.payload.payload.customer;
        else draft.cartCurrent.customer = action.payload;
        draft.cartCurrent.isGuestCustomer = false;
        break;
      case types.UN_SELECT_CUSTOMER_FOR_CURRENT_CART:
        draft.cartCurrent.customer = null;
        draft.cartCurrent.isGuestCustomer = true;
        break;
      case types.UPDATE_IS_GUEST_CUSTOMER_CURRENT_CART:
        draft.cartCurrent.isGuestCustomer = action.payload;
        break;
      case types.UPDATE_CART_ID_TO_CURRENT_CART:
        draft.cartCurrent.cartId = action.payload;
        break;
      case types.UPDATE_SHOW_CASH_MODAL:
        draft.checkout.isShowCashPaymentModel = action.payload;
        break;
      case types.UPDATE_CASH_PLACE_ORDER_LOADING:
        draft.isLoadingCashPlaceOrder = action.payload;
        break;
      case types.UPDATE_ITEM_CART:
        {
          const { index, item } = action.payload;
          draft.cartCurrent.data[index] = item;
        }
        break;
      case types.ADD_ITEM_TO_CART: {
        const product = Object.assign({}, action.payload);
        draft.cartCurrent.data.unshift(product);
        break;
      }
      case types.UPDATE_MAIN_PRODUCT_LOADING:
        draft.mainProductListLoading = action.payload;
        break;
      case types.HOLD_ACTION: {
        // Clone current cart and push to cart hold
        const currentCart = Object.assign({}, draft.cartCurrent);
        draft.cartHoldList.push(currentCart);
        // Clear current cart
        draft.cartCurrent = cartCurrentDefaultData;
        draft.switchHoldCartIndex = -1;
        break;
      }
      case types.SWITCH_TO_HOLD_ITEM_CART: {
        const index = action.payload;
        // Get item hold cart and set to current cart
        draft.cartCurrent = Object.assign({}, draft.cartHoldList[index]);
        draft.switchHoldCartIndex = index;
        break;
      }
      case types.EMPTY_CART:
        draft.cartCurrent = cartCurrentDefaultData;

        // we need delete hold cart select
        const index = draft.switchHoldCartIndex;
        if (index + 1) {
          draft.cartHoldList.splice(index, 1);
        }
        break;
      case types.PLACE_ORDER_SUCCESS: {
        const { orderId } = action;
        draft.receipt.orderId = orderId;
        // Copy current cart to cart in receipt
        draft.receipt.cartForReceipt = draft.cartCurrent;
        break;
      }
      case types.COPY_CART_CURRENT_TO_RECEIPT:
        draft.receipt.cartForReceipt = draft.cartCurrent;
        break;
      case types.OPEN_RECEIPT_MODAL: {
        draft.receipt.isOpenReceiptModal = true;
        break;
      }
      case types.CLOSE_RECEIPT_MODAL:
        draft.receipt.isOpenReceiptModal = false;
        break;
      case types.UPDATE_IS_LOADING_SEARCH_HANDLE:
        draft.isLoadingSearchHandle = action.payload;
        break;
      case types.UPDATE_IS_SHOW_HAVE_NO_SEARCH_RESULT_FOUND:
        draft.isShowHaveNoSearchResultFound = action.payload;
        break;
      case types.LOADING_ORDER_HISTORY_DETAIL:
        draft.isLoadingOrderHistoryDetail = action.payload;
        break;
      case types.LOADING_ORDER_HISTORY_DETAIL_OFFLINE:
        draft.isLoadingOrderHistoryDetailOffline = action.payload;
        break;
      case types.LOADING_GET_ACTION_ORDER:
        draft.toggleActionOrder.isLoadingGetDataOrderAction = action.payload;
        break;
      case types.TOGGLE_MODAL_ORDER_DETAIL:
        draft.isOpenDetailOrder = action.payload.isShow;
        draft.isOpenDetailOrderOffline = false;
        draft.order_id_history = action.payload.order_id;
        draft.orderHistoryDetailOffline = {};
        draft.orderHistoryDetail = {};
        break;
      case types.TOGGLE_MODAL_ORDER_DETAIL_OFFLINE:
        draft.isOpenDetailOrderOffline = action.payload.isShow;
        draft.isOpenDetailOrder = false;
        draft.orderHistoryDetailOffline = action.payload.dataItem;
        draft.orderHistoryDetail = {};
        break;
      case types.CLOSE_TOGGLE_MODAL_DETAIL_ORDER:
        draft.isOpenDetailOrderOffline = false;
        draft.isOpenDetailOrder = false;
        break;
      case types.TOGGLE_MODAL_CALCULATOR:
        draft.isOpenCalculator = action.payload;
        break;
      case types.LOADING_ORDER_HISTORY:
        draft.isLoadingOrderHistory = action.payload;
        break;
      case types.RECEIVED_ORDER_HISTORY_ACTION:
        draft.orderHistory = action.payload;
        break;
      case types.RECEIVED_ORDER_HISTORY_DETAIL_ACTION:
        draft.orderHistoryDetail = action.payload;
        break;
      case types.RECEIVED_ORDER_HISTORY_DETAIL_OFFLINE_ACTION:
        draft.orderHistoryDetailOffline = action.payload;
        break;
      case types.RECEIVED_ALL_CATEGORIES:
        draft.allCategories = action.payload;
        break;
      case types.SET_DISCOUNT_CODE_ACTION:
        draft.checkout.orderPreparingCheckout.totals.discount_code =
          action.payload;
        draft.checkout.orderPreparingCheckout.totals.amount_discount_code = 0;
        break;
      case types.SET_GIFT_CARD_ACTION:
        let initListGC = Array.from(
          draft.checkout.orderPreparingCheckout.totals.listGiftCard_code
        );
        // condition for multi GC
        const indexGC =
          action.payload.id !== undefined
            ? action.payload.id
            : initListGC.length;
        const replace = indexGC === initListGC.length ? false : true;
        console.log(replace);
        if (action.payload.code.length > 0) {
          initListGC.splice(indexGC, replace ? 1 : 0, action.payload.code);
          draft.checkout.orderPreparingCheckout.totals.listGiftCard_code = initListGC;
        }
        break;
      case types.IS_INTERNET_CONNECTED:
        draft.internetConnected = action.payload;
        break;
      case types.CHANGE_SIGN_UP_LOADING_CUSTOMER:
        draft.isLoadingSignUpCustomer = action.payload;
        break;
      case types.MESSAGE_SIGN_UP_CUSTOMER:
        draft.messageSignUpCustomer = action.payload;
        break;
      case types.RECEIVED_CHECKOUT_CART_INFO:
        const ordersInfo = action.payload;
        // Update to preparing checkout
        const cartId = ordersInfo.cartId;
        const baseDiscountAmount = ordersInfo.cartTotals.discount_amount;
        const baseGrandTotal = ordersInfo.cartTotals.grand_total;
        const baseSubTotal = ordersInfo.cartTotals.subtotal;
        const taxAmount = ordersInfo.cartTotals.tax_amount;
        draft.cartCurrent.cartId = cartId;
        draft.checkout.orderPreparingCheckout.totals.base_discount_amount = baseDiscountAmount;
        draft.checkout.orderPreparingCheckout.totals.base_subtotal = baseSubTotal;
        draft.checkout.orderPreparingCheckout.totals.grand_total = baseGrandTotal;
        draft.checkout.orderPreparingCheckout.totals.tax_amount = taxAmount;
        break;
      case types.BACK_TO_WORK_PLACE:
        draft.switchingMode = WORK_PLACE_FORM;
        break;
      case types.UPDATE_SWITCHING_MODE:
        draft.switchingMode = action.payload;
        break;
      case types.BACK_TO_LOGIN:
        draft.isLoadingBackToLogin = true;
        draft.switchingMode = LOGIN_FORM;
        break;
      case types.UPDATE_FLAG_SWITCHING_MODE:
        draft.flagSwitchModeCounter = draft.flagSwitchModeCounter + 1;
        break;
      case types.GO_TO_POS_PANEL:
        draft.switchingMode = CHILDREN;
        break;
      case types.UPDATE_IS_SHOW_MODEL_EDITING_CART_ITEM: {
        const open = action.payload.open;
        const item = action.payload.item;
        if (open === true) {
          draft.itemCartEditing.item = item;
        }
        draft.itemCartEditing.showModal = open;
        draft.itemCartEditing.index = action.payload.index;
        break;
      }
      case types.RESET_ITEM_CART_EDITING: {
        draft.itemCartEditing.index = 0;
        draft.itemCartEditing.showModal = false;
        draft.itemCartEditing.item = {};
        break;
      }
      case types.CLEAN_CART_CURRENT:
        draft.cartCurrent = cartCurrentDefaultData;
        break;
      case types.UPDATE_RE_CHECK_REQUIRE_STEP_LOADING:
        draft.isLoadingRequireStep = action.payload;
        break;
      case types.RESET_CURRENT_POS_COMMAND:
        draft.currentPosCommand.query.categoryId = 0;
        draft.currentPosCommand.query.currentPage = 0;
        draft.currentPosCommand.query.type = '';
        draft.currentPosCommand.isFetchingProduct = false;
        draft.currentPosCommand.lockPagingForFetching = false;
        draft.currentPosCommand.reachedLimit = false;
        break;
      case types.UPDATE_CURRENT_POS_COMMAND:
        // Update payload to current query
        draft.currentPosCommand.query = action.payload;
        break;
      case types.UPDATE_POS_COMMAND_FETCHING_PRODUCT:
        draft.currentPosCommand.isFetchingProduct = action.payload;
        break;
      case types.UPDATE_IS_LOCK_PAGING_FOR_FETCHING:
        draft.currentPosCommand.lockPagingForFetching = action.payload;
        break;
      case types.UPDATE_REACHED_LIMIT:
        draft.currentPosCommand.reachedLimit = action.payload;
        break;
      case types.RECEIVED_ALL_DEVICES:
        draft.hidDevice.allDevices = action.payload;
        break;
      case types.UPDATE_ERROR_CONNECT:
        draft.hidDevice.errorConnect = action.payload;
        break;
      case types.CONNECT_DEVICE_SUCCESS:
        draft.hidDevice.connectedDeviceStatus = true;
        draft.hidDevice.connectedDeviceItem = action.payload;
        break;
      case types.CHANGE_SCANNER_DEVICE:
        draft.hidDevice.connectedDeviceStatus = false;
        draft.hidDevice.connectedDeviceItem = {};
        break;
      case types.SCANNER_WAITING_FOR_CONNECT_LISTENING:
        draft.hidDevice.waitForConnect.isWaitingForListingDataEvent = true;
        break;
      case types.TRIGGER_ADD_ITEM_TO_CART_FROM_SCANNER_BAR_CODE:
        draft.hidDevice.triggerProduct.status = true;
        draft.hidDevice.triggerProduct.product = action.payload.product;
        // Update qty from barcode_index, if merchant installed multiple barcode module, qty number may have other value
        draft.hidDevice.triggerProduct.product.pos_qty = action.payload.qty;
        break;
      case types.UPDATE_TRIGGER_SCANNER_PRODUCT_TO_FALSE:
        draft.hidDevice.triggerProduct.status = false;
        break;
      case types.UPDATE_CARD_PAYMENT_TYPE:
        draft.checkout.cardPayment.type = action.payload;
        break;
      case types.REMOVE_ORDER_LIST:
        let orderList = draft.orderHistory;
        orderList.splice(action.payload, 1);
        draft.orderHistory = orderList;
        draft.isOpenDetailOrderOffline = false;
        break;
      case types.UPDATE_CUSTOMER_INFO_AND_SHIPPING_ADDRESS_PREPARING_CHECKOUT: {
        const {
          customer,
          posSystemConfigResult,
          shippingAddress,
          detailOutletResult
        } = action.payload;
        const { email } = customer;
        const shippingMethod = getShippingMethodCode(
          posSystemConfigResult.shipping_method
        );
        const paymentForPos = posSystemConfigResult.payment_for_pos;
        draft.checkout.orderPreparingCheckout.email = email;
        draft.checkout.orderPreparingCheckout.shipping_address.country_id =
          shippingAddress.country_id;
        draft.checkout.orderPreparingCheckout.shipping_address.street = [];
        draft.checkout.orderPreparingCheckout.shipping_address.company = '';
        draft.checkout.orderPreparingCheckout.shipping_address.telephone =
          shippingAddress.telephone;
        draft.checkout.orderPreparingCheckout.shipping_address.postcode =
          shippingAddress.post_code;
        draft.checkout.orderPreparingCheckout.shipping_address.city =
          shippingAddress.city;
        draft.checkout.orderPreparingCheckout.shipping_address.firstname =
          shippingAddress.firstname;
        draft.checkout.orderPreparingCheckout.shipping_address.lastname =
          shippingAddress.lastname;
        draft.checkout.orderPreparingCheckout.shipping_address.sameAsBilling = 1;
        draft.checkout.orderPreparingCheckout.shipping_address.shipping_method = shippingMethod;
        draft.checkout.orderPreparingCheckout.shipping_address.method = paymentForPos;
        draft.checkout.orderPreparingCheckout.posSystemConfigResult = posSystemConfigResult;
        draft.checkout.orderPreparingCheckout.detailOutletResult = detailOutletResult;
        break;
      }
      case types.ON_CARD_PAYMENT_FIELD_ONCHANGE:
        draft.checkout.cardPayment.cardInfo[action.payload.field] =
          action.payload.value;
        break;
      case types.UPDATE_PAYMENT_RESULT_CODE:
        draft.checkout.cardPayment.resultCharge = action.payload;
        break;
      case types.START_CARD_PAYMENT_LOADING:
        draft.checkout.cardPayment.isLoadingCharging = action.payload;
        break;
      case types.TOOGLE_MODAL_SHOW_SYNC_LOGS:
        const { payload } = action;
        draft.isShowLogsMessages = payload.status;
        draft.typeShowLogsMessages = payload.type;
        break;
      case types.UPDATE_REWARD_POINT_BOX_LOADING:
        draft.checkout.rewardPoint.isShowRewardPoint = action.payload;
        draft.checkout.rewardPoint.isLoadingRewardPointInfo = action.payload;
        break;
      case types.RECEIVED_REWARD_POINT_INFO:
        draft.checkout.rewardPoint.info = action.payload;
        draft.checkout.rewardPoint.isLoadingRewardPointInfo = false;
        break;
      case types.TOGGLE_MODEL_CATEGORIES:
        draft.isOpenCategoriesModel = action.payload;
        break;
      default:
        break;
    }
  });
export default mainRd;
