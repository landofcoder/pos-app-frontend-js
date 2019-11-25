// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from './bundle-components/Select';
import Multi from './bundle-components/Multi';
import Radio from './bundle-components/Radio';
import Checkbox from './bundle-components/Checkbox';
import {
  addToCart,
  updateIsShowingProductOption
} from '../../actions/homeAction';

const RADIO = 'radio';
const CHECKBOX = 'checkbox';
const MULTI = 'multi';
const SELECT = 'select';

type Props = {
  optionValue: Object,
  updateIsShowingProductOption: (payload: string) => void,
  addToCart: (payload: Object) => void
};

class Bundle extends Component<Props> {
  props: Props;

  renderViewByComponent = (item, index) => {
    switch (item.type) {
      case SELECT:
        return <Select item={item} index={index} />;
      case RADIO:
        return <Radio item={item} index={index} />;
      case CHECKBOX:
        return <Checkbox item={item} index={index} />;
      case MULTI:
        return <Multi item={item} index={index} />;
      default:
        return <Select item={item} index={index} />;
    }
  };

  addToCart = () => {
    const { optionValue, addToCart, updateIsShowingProductOption } = this.props;
    addToCart(optionValue);

    // Hide modal
    updateIsShowingProductOption(false);
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
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                {optionValue.items.map((item, index) => {
                  return (
                    <div key={index}>
                      {this.renderViewByComponent(item, index)}
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
    addToCart: payload => dispatch(addToCart(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bundle);
