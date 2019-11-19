// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onBundleProductQtyOnChange,
  onBundleSelectedChange
} from '../../../actions/homeAction';
import { findOptionById } from '../../../utils/common';

type Props = {
  item: Object,
  index: number,
  onBundleSelectedChange: (payload: Object) => void,
  onBundleProductQtyOnChange: (payload: Object) => void
};

class Radio extends Component<Props> {
  props: Props;

  /**
   * Get option selected
   * @returns {boolean}
   */
  getOptionSelected = (id, listOptionSelected) => {
    return listOptionSelected.indexOf(id) !== -1;
  };

  radioOnChange = id => {
    const { index, onBundleSelectedChange } = this.props;
    onBundleSelectedChange({ index, id });
  };

  qtyOnChange = (e, currentActiveItem) => {
    const { value } = e.target;
    const { onBundleProductQtyOnChange, index } = this.props;
    const optionId = currentActiveItem.id;
    onBundleProductQtyOnChange({ index, optionId, value });
  };

  render() {
    const { item } = this.props;
    const currentActiveItem = findOptionById(this.props);
    return (
      <div>
        <p className="font-weight-bold">{item.title}</p>
        {item.options.map((itemOption, index) => {
          return (
            <div key={index}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`exampleRadios${itemOption.id}${index}`}
                  id={`exampleRadios${itemOption.id}${index}`}
                  onChange={() => this.radioOnChange(itemOption.id)}
                  value="option1"
                  checked={this.getOptionSelected(
                    itemOption.id,
                    item.option_selected
                  )}
                />
                <label
                  className="form-check-label"
                  htmlFor={`exampleRadios${itemOption.id}${index}`}
                >
                  {itemOption.label}
                </label>
              </div>
            </div>
          );
        })}

        <div className="form-group">
          <label htmlFor="exampleFormControlInput1">Quantity</label>
          <input
            onChange={e => this.qtyOnChange(e, currentActiveItem)}
            type="text"
            className="form-control col-md-1"
            id="exampleFormControlInput1"
            value={currentActiveItem ? currentActiveItem.qty : 0}
          />
        </div>
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
    onBundleSelectedChange: payload =>
      dispatch(onBundleSelectedChange(payload)),
    onBundleProductQtyOnChange: payload =>
      dispatch(onBundleProductQtyOnChange(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radio);
