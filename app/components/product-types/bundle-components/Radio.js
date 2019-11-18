// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onBundleSelectedChange } from '../../../actions/homeAction';

type Props = {
  item: Object,
  index: number,
  onBundleSelectedChange: (payload: Object) => void
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
                  type="radio"
                  name="exampleRadios"
                  id={`radio-${index}`}
                  onChange={() => this.radioOnChange(itemOption.id)}
                  value="option1"
                  checked={this.getOptionSelected(
                    itemOption.id,
                    item.option_selected
                  )}
                />
                <label className="form-check-label" htmlFor={`radio-${index}`}>
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
    onBundleSelectedChange: payload => dispatch(onBundleSelectedChange(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Radio);
