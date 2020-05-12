import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateIsShowingProductOption,
  onConfigurableSelectOnChange,
  addToCart
} from '../../actions/homeAction';
import { formatCurrencyCode } from '../../common/settings';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void,
  onConfigurableSelectOnChange: (payload: Object) => void,
  addToCart: (payload: Object) => void,
  currencyCode: string
};

class Configuration extends Component<Props> {
  props: Props;

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { updateIsShowingProductOption } = this.props;
      // Hide any modal
      updateIsShowingProductOption(false);
    }
  };

  addToCart = () => {
    const { addToCart, optionValue, updateIsShowingProductOption } = this.props;
    addToCart(optionValue.usedProduct.product);
    // Hide modal
    updateIsShowingProductOption(false);
  };

  render() {
    const {
      optionValue,
      updateIsShowingProductOption,
      onConfigurableSelectOnChange
    } = this.props;
    const isLoading = !optionValue;
    let parentProduct = null;
    let configurableOptions;
    let variantProductPrice = null;

    if (optionValue) {
      // eslint-disable-next-line prefer-destructuring
      parentProduct = optionValue;
      configurableOptions = parentProduct.configurable_options;
      const usedProduct = parentProduct.usedProduct.product;
      variantProductPrice = usedProduct.price.regularPrice.amount.value;

      // Reformat product price
      const { currencyCode } = this.props;
      variantProductPrice = formatCurrencyCode(
        variantProductPrice,
        currencyCode
      );
    }
    return (
      <>
        <div className="modal-content">
          {isLoading ? (
            <>
              <div className="modal-body">
                <div className="d-flex justify-content-center">
                  <div
                    className="spinner-border text-secondary spinner-border-sm"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <div className="col-md-12">
                  <button
                    type="button"
                    onClick={() => updateIsShowingProductOption(false)}
                    className="btn btn-outline-dark"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="modal-header">
                <h5
                  className="modal-title"
                  id="exampleModalLongTitle"
                  dangerouslySetInnerHTML={{ __html: parentProduct.name }}
                />
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  {variantProductPrice}
                </button>
              </div>
              <div className="modal-body">
                {configurableOptions.map((item, index) => {
                  return (
                    <div key={item.id}>
                      <div className="form-group">
                        <label htmlFor={`option-select-${item.id}`}>
                          {item.label}
                        </label>
                        <select
                          id={`option-select-${item.id}`}
                          value={item.pos_selected}
                          className="custom-select"
                          onChange={event =>
                            onConfigurableSelectOnChange({
                              event,
                              index
                            })
                          }
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
                    className="btn btn-outline-dark btn-block"
                  >
                    CANCEL
                  </button>
                </div>
                <div className="col-md-6 p-0">
                  <button
                    onClick={this.addToCart}
                    type="button"
                    className="btn btn-primary btn-block"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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
      dispatch(updateIsShowingProductOption(payload)),
    onConfigurableSelectOnChange: payload =>
      dispatch(onConfigurableSelectOnChange(payload)),
    addToCart: payload => dispatch(addToCart(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Configuration);
