import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {
  updateIsShowModelEditingCartItem,
  updateQtyEditCart
} from '../../../actions/homeAction';
import ModalStyle from '../../styles/modal.scss';
import Close from '../../commons/x';

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

    // Needed run in setTimeout because posQty will change when value map to state in first times
    setTimeout(() => {
      // Auto focus & auto select qty for update new value
      this.qtyInput.focus();
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
      <Modal
        overlayClassName={ModalStyle.Overlay}
        shouldCloseOnOverlayClick
        onRequestClose={() => updateIsShowModelEditingCartItem(false)}
        className={`${ModalStyle.Modal}`}
        isOpen
        contentLabel="Example Modal"
      >
        <div className={ModalStyle.modalContent}>
          <div
            className={ModalStyle.close}
            role="presentation"
            onClick={() => updateIsShowModelEditingCartItem(false)}
          >
            <Close />
          </div>
          <div className="card">
            <form onSubmit={() => updateQtyEditCart(posQty)}>
              <div className="card-body">
                <h5
                  className="card-title"
                  dangerouslySetInnerHTML={{ __html: itemCartEditing.name }}
                />
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
                      type="number"
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
              <div className="card-footer text-muted">
                <button
                  type="submit"
                  className="btn btn-outline-primary btn-block"
                  onClick={() => updateQtyEditCart(posQty)}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemCartEditing: state.mainRd.itemCartEditing.item,
    isShowModalItemEditCart: state.mainRd.itemCartEditing.showModal
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
