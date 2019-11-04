// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkout from '../components/Checkout';
import * as checkoutActions from '../actions/checkoutActions';

function mapStateToProps(state) {
  return {
    cartCurrent: state.mainRd.cartCurrent
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(checkoutActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkout);
