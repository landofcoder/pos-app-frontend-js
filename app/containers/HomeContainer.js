// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as CounterActions from '../actions/homeAction';

function mapStateToProps(state) {
  return {
    productList: state.mainRd.productList,
    cartCurrent: state.mainRd.cartCurrent
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
