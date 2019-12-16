// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../../actions/authenAction';

type Props = {
  allCategories: () => void
};

class Categories extends Component<Props> {
  props: Props;

  render() {
    const { allCategories } = this.props;
    /* eslint-disable */
    const { children_data } = allCategories;
    /* eslint-enable */
    console.log('all categories:', children_data);
    return <div>
      Categories
    </div>;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    login: payload => dispatch(login(payload))
  };
}
function mapStateToProps(state) {
  return {
    allCategories: state.mainRd.allCategories
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
