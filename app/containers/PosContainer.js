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
    cartHoldList: state.mainRd.cartHoldList
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(homeActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Pos);