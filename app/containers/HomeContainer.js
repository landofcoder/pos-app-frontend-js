// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as homeActions from '../actions/homeAction';

function mapStateToProps(state) {
  return {
    productList: state.mainRd.productList,
    cartCurrent: state.mainRd.cartCurrent,
    mainPanelType: state.mainRd.mainPanelType
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(homeActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
