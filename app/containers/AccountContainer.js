import { connect } from 'react-redux';
import Settings from '../components/Account/Account';

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
)(Settings);
