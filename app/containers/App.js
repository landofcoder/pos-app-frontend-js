// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { getPostGeneralConfig } from '../actions/homeAction';

type Props = {
  children: React.Node,
  getPostGeneralConfig: () => void,
  isLoadingSystemConfig: boolean
};

class App extends React.Component<Props> {
  props: Props;

  componentDidMount() {
    const { getPostGeneralConfig } = this.props;
    getPostGeneralConfig();
  }

  render() {
    const { children, isLoadingSystemConfig } = this.props;
    return (
      <React.Fragment>
        {isLoadingSystemConfig ? (
          <>
            <div className="mt-5">
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-secondary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="container-fluid">{children}</div>
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoadingSystemConfig: state.mainRd.isLoadingSystemConfig
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPostGeneralConfig: () => dispatch(getPostGeneralConfig())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
