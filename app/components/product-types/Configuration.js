import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {
  updateIsShowingProductOption,
  onConfigurableSelectOnChange,
  addToCart
} from '../../actions/homeAction';
import { formatCurrencyCode } from '../../common/settings';
import ModalStyle from '../styles/modal.scss';
import Close from '../commons/x';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void,
  onConfigurableSelectOnChange: (payload: Object) => void,
  addToCart: (payload: Object) => void,
  isShowingProductOption: boolean,
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
      onConfigurableSelectOnChange,
      isShowingProductOption
    } = this.props;
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
        <Modal
          overlayClassName={ModalStyle.Overlay}
          shouldCloseOnOverlayClick
          onRequestClose={() => updateIsShowingProductOption(false)}
          className={`${ModalStyle.Modal}`}
          isOpen={isShowingProductOption}
          contentLabel="Example Modal"
        >
          <div className={ModalStyle.modalContent}>
            <div
              className={ModalStyle.close}
              role="presentation"
              onClick={() => updateIsShowingProductOption(false)}
            >
              <Close />
            </div>
            <div className="card">
              <div className="card-body">
                <h5
                  className="card-title"
                  dangerouslySetInnerHTML={{ __html: parentProduct.name }}
                />
                <div className="mb-2">
                  <span className="font-weight-bolder">
                    {variantProductPrice}
                  </span>
                </div>
                <hr />
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
                          className="custom-select custom-select-sm"
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
              <div className="card-footer text-muted">
                <button
                  onClick={this.addToCart}
                  type="button"
                  className="btn btn-outline-primary btn-block"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    optionValue: state.mainRd.productOption.optionValue,
    isShowingProductOption: state.mainRd.productOption.isShowingProductOption
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
