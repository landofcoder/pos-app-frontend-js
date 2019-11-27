// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Receipt extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        Receipt here
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Receipt);
