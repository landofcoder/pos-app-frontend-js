// @flow
import produce from 'immer';
import * as types from '../constants/root';
import { HOME_DEFAULT_PRODUCT_LIST } from '../constants/main-panel-types';
import {
  cartCurrentDefaultData,
  testCartCurrentForDefaultReceipt
} from './common';

const initialState = {
  internetConnected: false,
  isLoadingSystemConfig: true,
  isLoadingSearchHandle: false, // Main search loading
  isShowHaveNoSearchResultFound: false,
  posSystemConfig: {}, // General config for pos
  shopInfoConfig: {}, // Shop info config
  mainPanelType: HOME_DEFAULT_PRODUCT_LIST, // Main panel type for switching all main panel
  mainProductListLoading: false, // Main product list loading
  messageSignUpCustomer: null,
  productList: [],
  cartCurrent: cartCurrentDefaultData,
  receipt: {
    orderId: 0, // Last order is inserted
    isOpenReceiptModal: false,
    cartForReceipt: testCartCurrentForDefaultReceipt // When customer checkout succeed, copy current cart to this
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
  detailOutlet: {},
  orderHistory: [],
  orderHistoryDetail: {},
  isOpenFindCustomer: false,
  isOpenSignUpCustomer: false,
  isLoadingSearchCustomer: false,
  isLoadingOrderHistory: false,
  isLoadingSignUpCustomer: false,
  customerSearchResult: [],
  cartHoldList: [],
  orderPreparingCheckout: {
    totals: {
      discount_amount: 0,
      base_subtotal: 0,
      grand_total: 0,
      tax_amount: 0,
      base_shipping_amount: 0
    }
  }, // Detail order for preparing to checkout
  cashLoadingPreparingOrder: false, // Status cash loading for preparing to show cash payment form
  isShowCashPaymentModel: false,
  isLoadingCashPlaceOrder: false,
  productOption: {
    // State product option for all product type configurable, bundle, grouped product
    isLoadingProductOption: false, // Show a loading in screen for product option loading
    isShowingProductOption: false, // Show model for choose product type option
    optionValue: null // Keep detail product clicked
  },
  checkout: {
    // All checkout variables
    offline: {
      isLoadingDiscount: false,
      cartInfo: {
        base_discount_amount: 0,
        base_grand_total: 0,
        base_sub_total: 0,
        quote_id: 0
      }
    }
  }
};

/*eslint-disable*/
// https://immerjs.github.io/immer/docs/typescript
// Note: Immer v1.9+ supports TypeScript v3.1+ only.
// Note: Immer v3.0+ supports TypeScript v3.4+ only.
// Note: Flow support might be removed in future versions and we recommend TypeScript
/*flow-disable*/
const mainRd = (state: Object = initialState, action: Object) =>
  produce(state, draft => {
    switch (action.type) {
      case types.RECEIVED_ORDER_PREPARING_CHECKOUT:
        draft.orderPreparingCheckout = action.payload;
        break;
      case types.RECEIVED_PRODUCT_RESULT:
        draft.productList = action.payload;
        break;
      case types.UPDATE_CASH_LOADING_PREPARING_ORDER:
        draft.cashLoadingPreparingOrder = action.payload;
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
      case types.TOGGLE_MODAL_SIGN_UP_CUSTOMER:
        draft.isOpenSignUpCustomer = action.payload;
        break;
      case types.UPDATE_IS_LOADING_SEARCH_CUSTOMER:
        draft.isLoadingSearchCustomer = action.payload;
        break;
      case types.RECEIVED_CUSTOMER_SEARCH_RESULT:
        draft.customerSearchResult = action.searchResult.items;
        break;
      case types.SELECT_CUSTOMER_FOR_CURRENT_CART:
        draft.cartCurrent.customer = action.payload;
        break;
      case types.UN_SELECT_CUSTOMER_FOR_CURRENT_CART:
        draft.cartCurrent.customer = null;
        break;
      case types.UPDATE_IS_GUEST_CUSTOMER_CURRENT_CART:
        draft.cartCurrent.isGuestCustomer = action.payload;
        break;
      case types.UPDATE_CART_ID_TO_CURRENT_CART:
        draft.cartCurrent.cartId = action.payload;
        break;
      case types.UPDATE_SHOW_CASH_MODAL:
        draft.isShowCashPaymentModel = action.payload;
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
        draft.cartCurrent.data.push(product);
        break;
      }
      case types.UPDATE_MAIN_PRODUCT_LOADING:
        draft.mainProductListLoading = action.payload;
        break;
      case types.RECEIVED_POST_GENERAL_CONFIG:
        // eslint-disable-next-line prefer-destructuring
        draft.posSystemConfig = action.payload[0];
        window.config = action.payload[0];
        break;
      case types.UPDATE_IS_LOADING_SYSTEM_CONFIG:
        draft.isLoadingSystemConfig = action.payload;
        break;
      case types.HOLD_ACTION: {
        // Clone current cart and push to cart hold
        const currentCart = Object.assign({}, draft.cartCurrent);
        draft.cartHoldList.push(currentCart);
        // Clear current cart
        draft.cartCurrent = cartCurrentDefaultData;
        break;
      }
      case types.SWITCH_TO_HOLD_ITEM_CART: {
        const index = action.payload;
        // Get item hold cart and set to current cart
        draft.cartCurrent = Object.assign({}, draft.cartHoldList[index]);
        break;
      }
      case types.EMPTY_CART:
        draft.cartCurrent = cartCurrentDefaultData;
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
      case types.OPEN_RECEIPT_MODAL: {
        draft.receipt.isOpenReceiptModal = true;
        break;
      }
      case types.CLOSE_RECEIPT_MODAL:
        draft.receipt.isOpenReceiptModal = false;
        break;
      case types.RECEIVED_SHOP_INFO_CONFIG:
        draft.shopInfoConfig = action.payload;
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
      case types.TURN_OFF_LOADING_ORDER_HISTORY:
        draft.isLoadingOrderHistory = false;
        break;
      case types.GET_ORDER_HISTORY_ACTION:
        break;
      case types.RECEIVED_ORDER_HISTORY_ACTION:
        draft.orderHistory = action.payload;
        break;
      case types.RECEIVED_ORDER_HISTORY_DETAIL_ACTION:
        draft.orderHistoryDetail = action.payload;
        break;
      case types.RECEIVED_CUSTOM_RECEIPT:
        draft.customReceipt = action.payload;
        break;
      case types.RECEIVED_DETAIL_OUTLET:
        draft.detailOutlet = action.payload;
        break;
      case types.RECEIVED_ALL_CATEGORIES:
        draft.allCategories = action.payload;
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
        break;
      case types.UPDATE_IS_LOADING_GET_CHECKOUT_OFFLINE:
        draft.checkout.offline.isLoadingDiscount = action.payload;
        break;
      case types.RECEIVED_CHECKOUT_OFFLINE_CART_INFO:
        draft.checkout.offline.cartInfo = action.payload[0];
        break;
      default:
        return draft;
    }
  });
/*flow-enable*/
export default mainRd;
