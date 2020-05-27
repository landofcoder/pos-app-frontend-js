import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateIsShowingProductOption,
  onGroupedChangeQty,
  addToCart,
  createCustomizeProduct
} from '../../actions/homeAction';
import { formatCurrencyCode } from '../../common/settings';

type Props = {
  updateIsShowingProductOption: (payload: string) => void,
  onGroupedChangeQty: (payload: string) => void,
  currencyCode: string,
  createCustomizeProduct: (payload: object) => void
};

class CustomizeProduct extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = { name: '', price: '', quantity: '', note: '', tax: 'none' };
  }

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
    const { updateIsShowingProductOption } = this.props;
    const { name, tax, price, quantity, note } = this.state;
    const dateNow = Date.now();
    const product = {
      id: dateNow,
      sku: dateNow.toString(),
      type_id: 'custom_product_type_code',
      name,
      tax,
      note,
      price: { regularPrice: { amount: { value: price, currency: 'USD' } } }
    };
    // move it into saga
    // this.preAddToCart(product, quantity);
    // updateIsShowingProductOption(false);
    this.preAddToCart(product, quantity);
    updateIsShowingProductOption(false);
  };

  /**
   * Pre add to cart
   * @param product
   * @param qty
   */
  preAddToCart = (product, qty) => {
    const productReAssign = Object.assign({}, product);
    const { createCustomizeProduct } = this.props;
    productReAssign.pos_qty = qty;
    createCustomizeProduct(productReAssign);
  };

  qtyOnChange = (index, evt) => {
    const { value } = evt.target;
    const { onGroupedChangeQty } = this.props;
    onGroupedChangeQty({ index, value });
  };

  actionNameValue = e => {
    this.setState({ name: e.target.value });
  };

  actionPriceValue = e => {
    this.setState({ price: e.target.value });
  };

  actionQuantityValue = e => {
    this.setState({ quantity: e.target.value });
  };

  actionTaxSelect = e => {
    this.setState({ tax: e.target.value });
  };

  actionNoteValue = e => {
    this.setState({ note: e.target.value });
  };

  getPriceProductItem = item => {
    const price = item.product.price.regularPrice.amount.value;
    const { currencyCode } = this.props;
    return formatCurrencyCode(price, currencyCode);
  };

  additionalAddToCard = () => {
    const { quantity, name, price, tax } = this.state;
    if (quantity === '' || name === '' || price === '' || tax === '')
      return false;
    return true;
  };

  render() {
    const { updateIsShowingProductOption } = this.props;
    const { quantity, name, price, note, tax } = this.state;
    return (
      <div className="modal-content">
        <div>
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Custom Sale
            </h5>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <div className="row">
                <div className="col-12">
                  <label htmlFor="input-name">Name</label>
                </div>
                <div className="col-12 input-group-sm">
                  <input
                    onChange={this.actionNameValue}
                    className="col form-control"
                    id="input-name"
                    value={name}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-6">
                  <label htmlFor="input-price">Price</label>
                </div>
                <div className="col-6">
                  <label htmlFor="input-quantity">Quantity</label>
                </div>
              </div>
              <div className="row">
                <div className="col-6 input-group-sm">
                  <input
                    type="number"
                    className="col form-control"
                    id="input-price"
                    onChange={this.actionPriceValue}
                    value={price}
                  />
                </div>
                <div className="col-6 input-group-sm">
                  <input
                    type="number"
                    className="col form-control"
                    id="input-quantity"
                    onChange={this.actionQuantityValue}
                    value={quantity}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12">
                  <label htmlFor="input-note">Note</label>
                </div>
                <div className="col-12 input-group-sm">
                  <input
                    className="col form-control"
                    id="input-note"
                    onChange={this.actionNoteValue}
                    value={note}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="col-md-6 pr-0 pl-0">
              <button
                type="button"
                onClick={() => updateIsShowingProductOption(false)}
                className="btn btn-outline-dark btn-block btn-sm"
              >
                Cancel
              </button>
            </div>
            <div className="col-md-6 pr-0 pl-0">
              <button
                onClick={this.addToCart}
                type="button"
                className="btn btn-primary btn-block btn-sm"
                disabled={!this.additionalAddToCard()}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsShowingProductOption: payload =>
      dispatch(updateIsShowingProductOption(payload)),
    onGroupedChangeQty: payload => dispatch(onGroupedChangeQty(payload)),
    addToCart: payload => dispatch(addToCart(payload)),
    createCustomizeProduct: payload => dispatch(createCustomizeProduct(payload))
  };
}
export default connect(
  null,
  mapDispatchToProps
)(CustomizeProduct);
