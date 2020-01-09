import React, { Component } from 'react';
import { connect } from 'react-redux';

class ModuleInstalled extends Component {
  render() {
    return <div>Module installed</div>;
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleInstalled);
