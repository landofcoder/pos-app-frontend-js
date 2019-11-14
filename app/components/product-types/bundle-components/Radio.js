// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  item: Object
};

class Radio extends Component<Props> {
  props: Props;

  render() {
    const { item } = this.props;
    console.log('item:', item);
    return (
      <div>
        <p className="font-weight-bold">{item.title}</p>
        {item.options.map((item, index) => {
          return (
            <div key={index}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  id={`radio-${index}`}
                  value="option1"
                  checked
                />
                <label className="form-check-label" htmlFor={`radio-${index}`}>
                  {item.label}
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

export default connect(
  mapStateToProps,
  null
)(Radio);
