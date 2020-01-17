import React, { Component } from 'react';
import { connect } from 'react-redux';
import { gotoChildrenPanel } from '../../actions/homeAction';

class RequireStep extends Component {
  props: Props;

  render() {
    return (
      <div>
        <div className="container center-loading">
          <div className="card border-warning">
            <div className="card-header">Action require</div>
            <div className="card-body text-warning">
              <p className="card-text">Please link this cashier to an outlet</p>
            </div>
            <div className="card-footer">
              <a href="#" className="btn btn-primary">Re-check</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    gotoChildrenPanel: () => dispatch(gotoChildrenPanel())
  };
}

export default connect(
  null,
  mapDispatchToProps
)(RequireStep);
