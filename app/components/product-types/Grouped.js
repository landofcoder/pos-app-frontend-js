import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {
  updateIsShowingProductOption,
  onGroupedChangeQty,
  addToCart
} from '../../actions/homeAction';
import { formatCurrencyCode } from '../../common/settings';
import ModalStyle from '../styles/modal.scss';
import Close from '../commons/x';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void,
  onGroupedChangeQty: (payload: string) => void,
  addToCart: (payload: Object) => void,
  currencyCode: string,
  isShowingProductOption: boolean
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
    productReAssign.pos_qty = qty;
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
    const {
      optionValue,
      updateIsShowingProductOption,
      isShowingProductOption
    } = this.props;
    return (
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
                id="exampleModalLongTitle"
                dangerouslySetInnerHTML={{ __html: optionValue.name }}
              />
              {optionValue.items.map((item, index) => {
                return (
                  <div className="form-group" key={index}>
                    <div className="row">
                      <div
                        className="col-md-6"
                        dangerouslySetInnerHTML={{
                          __html: item.product.name
                        }}
                      />
                      <div className="col-md-6">
                        <div className="form-group input-group-sm">
                          <input
                            className="form-control"
                            value={item.qty}
                            onChange={evt => this.qtyOnChange(index, evt)}
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <span className="font-weight-bold">
                          {this.getPriceProductItem(item)}
                        </span>
                      </div>
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
    onGroupedChangeQty: payload => dispatch(onGroupedChangeQty(payload)),
    addToCart: payload => dispatch(addToCart(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grouped);
