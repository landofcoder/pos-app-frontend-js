// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onBundleSelectedSelectChange,
  onBundleProductQtyOnChange
} from '../../../actions/homeAction';
import { findOptionById } from '../../../utils/common';

type Props = {
  item: Object,
  index: number,
  onBundleSelectedSelectChange: (payload: Object) => void,
  onBundleProductQtyOnChange: (payload: Object) => void
};

class Select extends Component<Props> {
  props: Props;

  getSelectedValue = () => {
    const { item } = this.props;
    return item.option_selected[0];
  };

  onSelectChange = e => {
    const { value } = e.target;
    const { onBundleSelectedSelectChange, index } = this.props;
    onBundleSelectedSelectChange({ index, value });
  };

  qtyOnChange = (e, currentActiveItem) => {
    const { value } = e.target;
    const { onBundleProductQtyOnChange, index } = this.props;
    const optionId = currentActiveItem.id;
    onBundleProductQtyOnChange({ index, optionId, value });
  };

  render() {
    const { item } = this.props;
    const { required } = item;
    const currentActiveItem = findOptionById(this.props);
    return (
      <div>
        <p className="font-weight-bold">{item.title}</p>
        <select
          value={this.getSelectedValue()}
          onChange={e => this.onSelectChange(e)}
        >
          {required === false ? (
            <option value="-1">Choose a selection...</option>
          ) : (
            <></>
          )}
          {item.options.map((itemOption, index) => {
            return (
              <option key={index} value={itemOption.id}>
                {itemOption.label}
              </option>
            );
          })}
        </select>
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
    onBundleSelectedSelectChange: payload =>
      dispatch(onBundleSelectedSelectChange(payload)),
    onBundleProductQtyOnChange: payload =>
      dispatch(onBundleProductQtyOnChange(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Select);
