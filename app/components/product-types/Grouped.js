// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateIsShowingProductOption,
  onGroupedChangeQty
} from '../../actions/homeAction';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void,
  onGroupedChangeQty: (payload: string) => void
};

class Grouped extends Component<Props> {
  props: Props;

  addToCart = () => {
    console.log('add to cart');
  };

  qtyOnChange = (index, evt) => {
    const { value } = evt.target;
    const { onGroupedChangeQty } = this.props;
    onGroupedChangeQty({index, value});
  };

  getPriceProductItem = item => {
    return item.product.price.regularPrice.amount.value;
  };

  render() {
    const { optionValue, updateIsShowingProductOption } = this.props;
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
          <div>
            <div className="modal-content">
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
                    className="btn btn-secondary btn-lg btn-block"
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
    onGroupedChangeQty: payload => dispatch(onGroupedChangeQty(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grouped);
