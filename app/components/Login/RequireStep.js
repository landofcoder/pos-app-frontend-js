import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  gotoChildrenPanel,
  reCheckRequireStep,
  backToLogin
} from '../../actions/homeAction';

class RequireStep extends Component {
  props: Props;

  render() {
    const {
      reCheckRequireStep,
      isLoadingRequireStep,
      backToLogin
    } = this.props;
    return (
      <div>
        <div className="container center-loading">
          <div className="card border-warning">
            <div className="card-header">
              Make sure the following configuration is set
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Link cashier to an outlet</li>
                <li className="list-group-item">Link cashier to an admin</li>
                <li className="list-group-item">Cashier is enabled</li>
              </ul>
            </div>
            <div className="card-footer">
              <div className="row">
                <div className="col-md-6">
                  <button
                    type="button"
                    onClick={backToLogin}
                    className="btn btn-light  "
                    disabled={!!isLoadingRequireStep}
                  >
                    {isLoadingRequireStep ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <></>
                    )}
                    Back to login
                  </button>
                </div>
                <div className="col-md-6 pull-right text-right">
                  <button
                    type="button"
                    onClick={reCheckRequireStep}
                    className="btn btn-primary"
                    disabled={!!isLoadingRequireStep}
                  >
                    {isLoadingRequireStep ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <></>
                    )}
                    Re-check
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoadingRequireStep: state.mainRd.isLoadingRequireStep
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gotoChildrenPanel: () => dispatch(gotoChildrenPanel()),
    reCheckRequireStep: () => dispatch(reCheckRequireStep()),
    backToLogin: () => dispatch(backToLogin())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequireStep);
