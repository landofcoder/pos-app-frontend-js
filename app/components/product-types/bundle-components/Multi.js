import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  onBundleMultipleCheckboxOnChange,
  onBundleMultipleCheckboxRemoveItem
} from '../../../actions/homeAction';
import { formatCurrencyCode } from '../../../common/settings';

type Props = {
  item: Object,
  index: number,
  onBundleMultipleCheckboxOnChange: (payload: Object) => void,
  currencyCode: string
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

  renderOptionPrice = item => {
    const { currencyCode } = this.props;
    const { product } = item;
    const price = product.price.regularPrice.amount.value;
    return formatCurrencyCode(price, currencyCode);
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
                {itemOption.label} + {this.renderOptionPrice(itemOption)}
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
    optionValue: state.mainRd.productOption.optionValue,
    currencyCode: state.mainRd.shopInfoConfig[0]
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
