// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Multi extends Component<Props> {
  props: Props;

  render() {
    return <div>Multiple</div>;
  }
}

function mapStateToProps(state) {
  return {
    optionValue: state.mainRd.productOption.optionValue
  };
}

export default connect(
  mapStateToProps,
  null
)(Multi);
