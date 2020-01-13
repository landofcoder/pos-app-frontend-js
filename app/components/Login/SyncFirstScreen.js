import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {};

class SyncFirstScreen extends Component {
  props: Props;

  render() {
    const loading = true;
    return loading ? (
      <div className="container center-loading">
        <h1>
          <small className="text-muted">Products are synchronizing: 190 </small>
        </h1>
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    ) : (
      <>{loading}</>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  null
)(SyncFirstScreen);
