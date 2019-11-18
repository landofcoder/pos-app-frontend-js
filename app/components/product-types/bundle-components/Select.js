// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onBundleSelectedSelectChange } from '../../../actions/homeAction';

type Props = {
  item: Object,
  index: number,
  onBundleSelectedSelectChange: (payload: Object) => void
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

  render() {
    const { item } = this.props;
    const { required } = item;
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
      dispatch(onBundleSelectedSelectChange(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Select);
