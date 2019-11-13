// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void,
  onConfigurableSelectOnChange: (payload: Object) => void,
  addToCart: (payload: Object) => void
};

class Bundle extends Component<Props> {
  props: Props;

  render() {
    const { optionValue } = this.props;
    const isLoading = !optionValue;
    return (
      <div>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div>Bundle option</div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    optionValue: state.mainRd.productOption.optionValue
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bundle);
