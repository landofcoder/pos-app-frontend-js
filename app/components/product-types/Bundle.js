// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  optionValue: Object
};

class Bundle extends Component<Props> {
  props: Props;

  render() {
    const { optionValue } = this.props;
    const isLoading = !optionValue;

    console.log('option value:', optionValue);
    return (
      <div>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  {optionValue.name}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body"></div>
            </div>
          </div>
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

export default connect(
  mapStateToProps,
  null
)(Bundle);
