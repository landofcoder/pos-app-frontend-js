import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  updateIsShowModelEditingCartItem,
  updateQtyEditCart
} from '../../../actions/homeAction';

type Props = {
  itemCartEditing: Object,
  updateIsShowModelEditingCartItem: (payload: Object) => void,
  updateQtyEditCart: (payload: Object) => void
};

type State = {
  posQty: number
};

class EditCart extends Component<Props, State> {
  props: Props;

  state = {
    posQty: 0
  };

  componentDidMount(): void {
    const { itemCartEditing } = this.props;
    const qty = itemCartEditing.pos_qty;
    this.setState({ posQty: qty });
    document.addEventListener('keydown', this.escFunction, false);

    // Auto focus & auto select qty for update new value
    this.qtyInput.focus();
    // Needed run in setTimeout because posQty will change when value map to state in first times
    setTimeout(() => {
      this.qtyInput.select();
    }, 100);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { updateIsShowModelEditingCartItem } = this.props;
      // Hide any modal
      updateIsShowModelEditingCartItem({ open: false });
    }
  };

  counterUpQty = () => {
    const { posQty } = this.state;
    this.setState({ posQty: Number(posQty) + 1 });
  };

  counterDownQty = () => {
    const { posQty } = this.state;
    if (posQty > 1) {
      this.setState({ posQty: Number(posQty) - 1 });
    }
  };

  onQtyOnChange = e => {
    const { value } = e.target;
    this.setState({ posQty: value });
  };

  render() {
    const {
      itemCartEditing,
      updateIsShowModelEditingCartItem,
      updateQtyEditCart
    } = this.props;

    const { posQty } = this.state;
    return (
      <div>
        <div className="modal-content">
          <form onSubmit={() => updateQtyEditCart(posQty)}>
            <div className="modal-header">
              <h5 className="modal-title">{itemCartEditing.name}</h5>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-4 text-right pull-right">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={this.counterDownQty}
                  >
                    -
                  </button>
                </div>
                <div className="col-md-4">
                  <input
                    ref={input => {
                      this.qtyInput = input;
                    }}
                    type="text"
                    className="form-control text-center"
                    placeholder="0"
                    onChange={this.onQtyOnChange}
                    value={posQty}
                    aria-describedby="basic-addon2"
                  />
                </div>
                <div className="col-md-4 text-left pull-left">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={this.counterUpQty}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="col-md-6 p-0">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm btn-block"
                  onClick={() =>
                    updateIsShowModelEditingCartItem({ open: false })
                  }
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-6 p-0">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm btn-block"
                  onClick={() => updateQtyEditCart(posQty)}
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemCartEditing: state.mainRd.itemCartEditing.item
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsShowModelEditingCartItem: payload =>
      dispatch(updateIsShowModelEditingCartItem(payload)),
    updateQtyEditCart: payload => dispatch(updateQtyEditCart(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditCart);
