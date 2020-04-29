import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Settings from '../components/Account/Account';

function mapStateToProps(state) {
  return {
    cartCurrent: state.mainRd.cartCurrent
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Settings)
);
