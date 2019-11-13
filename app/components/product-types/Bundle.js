// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from './bundle-components/Select';
import Multi from './bundle-components/Multi';
import Radio from './bundle-components/Radio';
import Checkbox from './bundle-components/Checkbox';

const RADIO = 'radio';
const CHECKBOX = 'checkbox';
const MULTI = 'multi';
const SELECT = 'select';

type Props = {
  optionValue: Object
};

class Bundle extends Component<Props> {
  props: Props;

  render() {
    const { optionValue } = this.props;
    const isLoading = !optionValue;

    console.log('option value:', optionValue);
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
                ></button>
              </div>
              <div className="modal-body">
                {optionValue.items.map(item => {
                  console.log('type:', item.type);
                  switch (item.type) {
                    case SELECT:
                      return <Select />;
                    case RADIO:
                      return <Radio />;
                    case CHECKBOX:
                      return <Checkbox />;
                    case MULTI:
                      return <Multi />;
                    default:
                      return <Select />;
                  }
                })}
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

export default connect(
  mapStateToProps,
  null
)(Bundle);
