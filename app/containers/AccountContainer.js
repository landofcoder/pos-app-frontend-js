import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Settings from '../components/Account/Account';

function mapStateToProps(state) {
  return {
    cartCurrent: state.mainRd.cartCurrent
  };
}

function mapDispatchToProp(dispatch) {
  return {};
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProp
  )(Settings)
);
