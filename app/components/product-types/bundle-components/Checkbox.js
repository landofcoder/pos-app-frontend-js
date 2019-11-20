// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onBundleCheckBoxOnChange } from '../../../actions/homeAction';

type Props = {
  item: Object,
  index: number,
  onBundleCheckBoxOnChange: (payload: Object) => void
};

class Checkbox extends Component<Props> {
  props: Props;

  getOptionSelected = (id, listOptionSelected) => {
    return listOptionSelected.indexOf(id) !== -1;
  };

  checkBoxOnChange = id => {
    const { index, onBundleCheckBoxOnChange, item } = this.props;
    const arraySelected = Array.from(item.option_selected);
    const indexOf = arraySelected.indexOf(id);
    if (indexOf !== -1) {
      arraySelected.splice(indexOf, 1);
    } else {
      arraySelected.push(id);
    }
    onBundleCheckBoxOnChange({ index, arraySelected });
  };

  render() {
    const { item } = this.props;
    return (
      <div>
        <p className="font-weight-bold">{item.title}</p>
        {item.options.map((itemOption, index) => {
          return (
            <div key={index}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  checked={this.getOptionSelected(
                    itemOption.id,
                    item.option_selected
                  )}
                  type="checkbox"
                  value=""
                  id={`chk-option${item.option_id}${index}`}
                  onChange={() => this.checkBoxOnChange(itemOption.id)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`chk-option${item.option_id}${index}`}
                >
                  {itemOption.label}
                </label>
              </div>
            </div>
          );
        })}
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
    onBundleCheckBoxOnChange: payload =>
      dispatch(onBundleCheckBoxOnChange(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkbox);
