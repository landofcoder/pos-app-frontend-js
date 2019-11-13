import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = { loading: boolean };
class Loading extends Component {
  props: Props;

  render() {
    const { loading } = this.props;
    console.log('loading');
    console.log(loading);
    return loading ? (
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
      <>{loading}</>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.authenRd.loading
  };
}
export default connect(
  mapStateToProps,
  null
)(Loading);
