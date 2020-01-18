// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Pos from '../components/Pos';
import * as homeActions from '../actions/homeAction';

function mapStateToProps(state) {
  return {
    productList: state.mainRd.productList,
    cartCurrent: state.mainRd.cartCurrent,
    mainPanelType: state.mainRd.mainPanelType,
    isShowCashPaymentModel: state.mainRd.isShowCashPaymentModel,
    productOption: state.mainRd.productOption,
    token: state.authenRd.token,
    mainProductListLoading: state.mainRd.mainProductListLoading,
    isOpenReceiptModal: state.mainRd.receipt.isOpenReceiptModal,
    cartHoldList: state.mainRd.cartHoldList,
    currencyCode: state.mainRd.shopInfoConfig[0],
    isLoadingSearchHandle: state.mainRd.isLoadingSearchHandle,
    internetConnected: state.mainRd.internetConnected,
    isShowHaveNoSearchResultFound: state.mainRd.isShowHaveNoSearchResultFound,
    isLoadingSignUpCustomer: state.mainRd.isLoadingSignUpCustomer,
    isOpenSignUpCustomer: state.mainRd.isOpenSignUpCustomer,
    isShowModalItemEditCart: state.mainRd.itemCartEditing.showModal,
    toggleModalCalculatorStatus: state.mainRd.isOpenCalculator
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(homeActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pos);
