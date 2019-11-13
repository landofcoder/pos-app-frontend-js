// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Radio extends Component<Props> {
  props: Props;

  render() {
    return <div>Check box</div>;
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
)(Radio);
