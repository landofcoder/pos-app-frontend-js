import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateIsShowingProductOption,
  onGroupedChangeQty,
  addToCart
} from '../../actions/homeAction';
import { formatCurrencyCode } from '../../common/settings';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void,
  onGroupedChangeQty: (payload: string) => void,
  addToCart: (payload: Object) => void,
  currencyCode: string
};

class Grouped extends Component<Props> {
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
    const { optionValue, updateIsShowingProductOption } = this.props;
    const { items } = optionValue;

    for (let i = 0; i < items.length; i += 1) {
      const { product, qty } = items[i];
      if (qty > 0) {
        this.preAddToCart(product, qty);
      }
    }

    // Hide modal
    updateIsShowingProductOption(false);
  };

  /**
   * Pre add to cart
   * @param product
   * @param qty
   */
  preAddToCart = (product, qty) => {
    const productReAssign = Object.assign({}, product);
    const { addToCart } = this.props;
    productReAssign.qty = qty;
    addToCart(productReAssign);
  };

  qtyOnChange = (index, evt) => {
    const { value } = evt.target;
    const { onGroupedChangeQty } = this.props;
    onGroupedChangeQty({ index, value });
  };

  getPriceProductItem = item => {
    const price = item.product.price.regularPrice.amount.value;
    const { currencyCode } = this.props;
    return formatCurrencyCode(price, currencyCode);
  };

  render() {
    const { optionValue, updateIsShowingProductOption } = this.props;
    const isLoading = !optionValue;
    return (
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
                  className="btn btn-outline-secondary"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                {optionValue.name}
              </h5>
            </div>
            <div className="modal-body">
              {optionValue.items.map((item, index) => {
                return (
                  <div className="form-group" key={index}>
                    <div className="row">
                      <div className="col-md-6">{item.product.name}</div>
                      <div className="col-md-6">
                        <input
                          className="form-control"
                          value={item.qty}
                          onChange={evt => this.qtyOnChange(index, evt)}
                        />
                      </div>
                      <div className="col-md-12">
                        <p className="font-weight-bold">
                          {this.getPriceProductItem(item)}
                        </p>
                      </div>
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
                  className="btn btn-outline-secondary btn-lg btn-block"
                >
                  CANCEL
                </button>
              </div>
              <div className="col-md-6 p-0">
                <button
                  onClick={this.addToCart}
                  type="button"
                  className="btn btn-primary btn-lg btn-block"
                >
                  ADD TO CART
                </button>
              </div>
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

function mapDispatchToProps(dispatch) {
  return {
    updateIsShowingProductOption: payload =>
      dispatch(updateIsShowingProductOption(payload)),
    onGroupedChangeQty: payload => dispatch(onGroupedChangeQty(payload)),
    addToCart: payload => dispatch(addToCart(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grouped);
