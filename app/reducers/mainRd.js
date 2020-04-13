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

const initialState = {
  switchingMode: LOADING, // LOADING, LOGIN_FORM, CHILDREN, SYNC_SCREEN
  flagSwitchModeCounter: 1, // When this flag counter up, render in App.js will re-render and backgroundLogin will re-check
  setup: {
    stateFetchingConfig: 0, // 0 = loading, 1 = succeed
    stateSynchronizingCategoriesAndProducts: 0 // 0 = loading, 1 = succeed
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
        discount_code: 0,
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
  isOpenAddNote: false,
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
      case types.RECEIVED_ORDER_PREPARING_CHECKOUT:
        const totals = action.payload.totals;
        const discount_amount = totals.base_discount_amount;
        const base_subtotal = totals.base_subtotal;
        const grand_total = totals.grand_total;
        const tax_amount = totals.tax_amount;
        const base_shipping_amount = totals.base_shipping_amount;

        draft.checkout.orderPreparingCheckout.totals.base_discount_amount = discount_amount;
        draft.checkout.orderPreparingCheckout.totals.base_subtotal = base_subtotal;
        draft.checkout.orderPreparingCheckout.totals.grand_total = grand_total;
        draft.checkout.orderPreparingCheckout.totals.tax_amount = tax_amount;
        draft.checkout.orderPreparingCheckout.totals.base_shipping_amount = base_shipping_amount;
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
      case types.TOGGLE_ACTION_ORDER_ADD_NOTE:
        draft.isOpenAddNote = action.payload;
        break;
      case types.LOADING_NOTE_ORDER_ACTION:
        draft.isLoadingNoteOrderAction = action.payload;
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
        if(action.payload.synced === false)
          draft.cartCurrent.customer = action.payload.payload.customer;
        else
          draft.cartCurrent.customer = action.payload;
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
        {
          const { orderId } = action;
          draft.receipt.orderId = orderId;
          // Copy current cart to cart in receipt
          draft.receipt.cartForReceipt = draft.cartCurrent;
          break;
        }
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
      case types.TURN_ON_LOADING_ORDER_HISTORY:
        draft.isLoadingOrderHistory = true;
        break;
      case types.TURN_OFF_LOADING_ORDER_HISTORY_DETAIL:
        draft.isLoadingOrderHistoryDetail = false;
        break;
      case types.TURN_ON_LOADING_ORDER_HISTORY_DETAIL:
        draft.isLoadingOrderHistoryDetail = true;
        break;
      case types.LOADING_ORDER_HISTORY_DETAIL_OFFLINE:
        draft.isLoadingOrderHistoryDetailOffline = action.payload;
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
      case types.TOGGLE_MODAL_CALCULATOR:
        draft.isOpenCalculator = action.payload;
        break;
      case types.TURN_OFF_LOADING_ORDER_HISTORY:
        draft.isLoadingOrderHistory = false;
        break;
      case types.RECEIVED_ORDER_HISTORY_ACTION:
        // Add status not sync to syncOrders array
        action.syncOrders.forEach(function(element) {
          element.from_local_db = 1;
        });
        const mainArray = action.payload.concat(action.syncOrders);
        draft.orderHistory = mainArray;
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
      case types.RECEIVED_AMOUNT_DISCOUNT_OF_DISCOUNT_CODE:
        draft.checkout.orderPreparingCheckout.totals.amount_discount_code = +action.payload;
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
      case types.LOGOUT_POS_ACTION:
        draft.cartCurrent.data = [];
        draft.cartHoldList = [];
        draft.orderHistory = [];
        draft.customerSearchResult = [];
        draft.cashierInfo = {};
        break;
      case types.RECEIVED_CHECKOUT_CART_INFO:
        const ordersInfo = action.payload[0];
        // Update to preparing checkout
        const baseDiscountAmount = ordersInfo.base_discount_amount;
        const baseGrandTotal = ordersInfo.base_grand_total;
        const baseSubTotal = ordersInfo.base_sub_total;
        const shippingAndTaxAmount = ordersInfo.shipping_and_tax_amount;
        draft.checkout.orderPreparingCheckout.totals.base_discount_amount = baseDiscountAmount;
        draft.checkout.orderPreparingCheckout.totals.base_subtotal = baseSubTotal;
        draft.checkout.orderPreparingCheckout.totals.grand_total = baseGrandTotal;
        draft.checkout.orderPreparingCheckout.totals.tax_amount = shippingAndTaxAmount;
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
        draft.hidDevice.triggerProduct.product = action.payload;
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
        const customerInfo = action.payload.customer;
        const shippingAddress = action.payload.shippingAddress;
        const posSystemConfigResult = action.payload.posSystemConfigResult;
        const { email } = customerInfo;
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
        break;
      }
      case types.ON_CARD_PAYMENT_FIELD_ONCHANGE:
        console.log('field onChange payload:', action.payload);
        draft.checkout.cardPayment.cardInfo[action.payload.field] =
          action.payload.value;
        break;
      case types.UPDATE_PAYMENT_RESULT_CODE:
        console.log('payment result:', action.payload);
        draft.checkout.cardPayment.resultCharge = action.payload;
        break;
      case types.START_CARD_PAYMENT_LOADING:
        draft.checkout.cardPayment.isLoadingCharging = action.payload;
        break;
      default:
        return draft;
    }
  });
export default mainRd;
