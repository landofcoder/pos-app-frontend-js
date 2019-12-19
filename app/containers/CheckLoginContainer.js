// @flow
import { connect } from 'react-redux';
import CheckLogin from '../components/CheckLogin';

function mapStateToProps(state) {
  return {
    cartCurrent: state.mainRd.cartCurrent
  };
}

function mapDispatchToProp(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProp
)(CheckLogin);
