import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Pos from '../components/Pos';
import * as homeActions from '../actions/homeAction';

function mapStateToProps(state) {
  return {
    appInfo: state.authenRd.appInfo,
    appLicense: state.authenRd.appLicense,
    productList: state.mainRd.productList,
    cartCurrent: state.mainRd.cartCurrent,
    mainPanelType: state.mainRd.mainPanelType,
    isShowCashPaymentModel: state.mainRd.checkout.isShowCashPaymentModel,
    isShowCardPaymentModal: state.mainRd.checkout.isShowCardPaymentModal,
    productOption: state.mainRd.productOption,
    token: state.authenRd.token,
    mainProductListLoading: state.mainRd.mainProductListLoading,
    isOpenReceiptModal: state.mainRd.receipt.isOpenReceiptModal,
    cartHoldList: state.mainRd.cartHoldList,
    isLoadingSearchHandle: state.mainRd.isLoadingSearchHandle,
    internetConnected: state.mainRd.internetConnected,
    isShowHaveNoSearchResultFound: state.mainRd.isShowHaveNoSearchResultFound,
    isLoadingSignUpCustomer: state.mainRd.isLoadingSignUpCustomer,
    isOpenSignUpCustomer: state.mainRd.isOpenSignUpCustomer,
    isOpenCategoriesModel: state.mainRd.isOpenCategoriesModel,
    isShowModalItemEditCart: state.mainRd.itemCartEditing.showModal,
    toggleModalCalculatorStatus: state.mainRd.isOpenCalculator,
    posCommandIsFetchingProduct:
      state.mainRd.currentPosCommand.isFetchingProduct,
    defaultColor: state.mainRd.posSystemConfig,
    hidDevice: state.mainRd.hidDevice
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(homeActions, dispatch);
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Pos)
);
