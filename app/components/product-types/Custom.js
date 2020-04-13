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
    const product = {
      id: Date.now(),
      type_id: 'CUSTOM',
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
    productReAssign.qty = qty;
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
                <div className="col-12">
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
                <div className="col-6">
                  <input
                    type="number"
                    className="col form-control"
                    id="input-price"
                    onChange={this.actionPriceValue}
                    value={price}
                  />
                </div>
                <div className="col-6">
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
                  <label htmlFor="select-tax">Tax</label>
                </div>
                <div className="col-12">
                  <select
                    id="select-tax"
                    className="custom-select"
                    onChange={this.actionTaxSelect}
                    value={tax}
                  >
                    <option key="None" value="none">
                      None
                    </option>
                    <option key="Taxable Goods" value="taxable-goods">
                      Taxable Goods
                    </option>
                    <option key="Refund Adjustments" value="refund-adjustments">
                      Refund Adjustments
                    </option>
                    <option key="Gift Options" value="gift-options">
                      Gift Options
                    </option>
                    <option
                      key="Order Gift Wrapping"
                      value="order-gift-wrapping"
                    >
                      Order Gift Wrapping
                    </option>
                    <option key="Item Gift Wrapping" value="item-gift-wrapping">
                      Item Gift Wrapping
                    </option>
                    <option key="Printed Gift Card" value="printed-gift-card">
                      Printed Gift Card
                    </option>
                    <option key="Reward Points" value="reward-points">
                      Reward Points
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-12">
                  <label htmlFor="input-note">Note</label>
                </div>
                <div className="col-12">
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
                disabled={!this.additionalAddToCard()}
              >
                ADD TO CART
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
