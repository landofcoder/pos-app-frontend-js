// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onBundleMultipleCheckboxOnChange,
  onBundleMultipleCheckboxRemoveItem
} from '../../../actions/homeAction';

type Props = {
  item: Object,
  index: number,
  onBundleMultipleCheckboxOnChange: (payload: Object) => void
};

class Multi extends Component<Props> {
  props: Props;

  getSelectedValue = () => {
    const { item } = this.props;
    return item.option_selected;
  };

  onSelectChange = evt => {
    const id = Number(evt.target.value);
    const { index, onBundleMultipleCheckboxOnChange, item } = this.props;
    const arraySelected = Array.from(item.option_selected);
    const indexOf = arraySelected.indexOf(id);
    if (indexOf !== -1) {
      arraySelected.splice(indexOf, 1);
    } else {
      arraySelected.push(id);
    }
    onBundleMultipleCheckboxOnChange({ index, arraySelected });
  };

  render() {
    const { item } = this.props;
    const { required } = item;
    return (
      <div>
        <p className="font-weight-bold">{item.title}</p>
        <select
          multiple="multiple"
          value={this.getSelectedValue()}
          onChange={this.onSelectChange}
        >
          {required === false ? <option value="-1">None</option> : <></>}
          {item.options.map((itemOption, index) => {
            return (
              <option key={index} value={itemOption.id}>
                {itemOption.label}
              </option>
            );
          })}
        </select>
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
    onBundleMultipleCheckboxOnChange: payload =>
      dispatch(onBundleMultipleCheckboxOnChange(payload)),
    onBundleMultipleCheckboxRemoveItem: payload =>
      dispatch(onBundleMultipleCheckboxRemoveItem(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Multi);
