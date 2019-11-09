// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateIsShowingProductOption } from '../../actions/homeAction';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void
};

class Configuration extends Component<Props> {
  props: Props;

  render() {
    const { optionValue, updateIsShowingProductOption } = this.props;
    const isLoading = !optionValue.data;
    let productDetail = null;
    let configurableOptions;
    if (optionValue.data) {
      // eslint-disable-next-line prefer-destructuring
      productDetail = optionValue.data.products.items[0];
      configurableOptions = productDetail.configurable_options;
    }
    console.log('configurable:', configurableOptions);
    return (
      <>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  {productDetail.name}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  onClick={() => updateIsShowingProductOption(false)}
                  aria-label="Close"
                >
                  $40
                </button>
              </div>
              <div className="modal-body">
                {configurableOptions.map(item => {
                  return (
                    <div key={item.id}>
                      <div className="form-group">
                        <label>{item.label}</label>
                        <select
                          id={`option-select-${item.id}`}
                          className="custom-select"
                        >
                          {item.values.map(option => {
                            return (
                              <option
                                key={option.value_index}
                                value={option.value_index}
                              >
                                {option.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="modal-footer">
                <div className="col-md-6 p-0">
                  <button
                    type="button"
                    onClick={() => updateIsShowingProductOption(false)}
                    className="btn btn-secondary btn-lg btn-block"
                  >
                    CANCEL
                  </button>
                </div>
                <div className="col-md-6 p-0">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg btn-block"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    optionValue: state.mainRd.productOption.optionValue
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsShowingProductOption: payload =>
      dispatch(updateIsShowingProductOption(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Configuration);
