import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleModalActionOrder,
  orderAction,
  getOrderAction
} from '../../../../actions/accountAction';
import ModalStyle from '../../../styles/modal.scss';
import {
  ADD_NOTE_ACTION_ORDER,
  REFUND_ACTION_ORDER
} from '../../../../constants/root';
import { formatCurrencyCode } from '../../../../common/settings';

type Props = {
  toggleModalActionOrder: (payload: boolean) => void,
  typeOpenToggle: string,
  addNoteOrderAction: (payload: string) => void,
  orderAction: (payload: object) => void,
  getOrderAction: (payload: object) => void,
  isLoadingSetOrderAction: boolean,
  isLoadingGetOrderAction: boolean,
  dataActionOrder: boolean
};

class DetailOrderAction extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      noteValue: '',
      refundOption: {
        items: []
      }
    };
  }

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
    this.getDataOrderAction();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  getDataOrderAction = () => {
    const { typeOpenToggle, getOrderAction } = this.props;
    getOrderAction({
      action: typeOpenToggle,
      kindOf: 'DETAIL_ORDER_ONLINE'
    });
  };

  escFunction = event => {
    if (event.keyCode === 27) {
      // Do whatever when esc is pressed
      const { toggleModalActionOrder } = this.props;
      // Hide any modal
      toggleModalActionOrder({ type: ADD_NOTE_ACTION_ORDER, status: false });
    }
  };

  noteInputAction = event => {
    const input = event.target.value;
    this.setState({ noteValue: input });
  };

  addValueNoteAction = () => {
    const { addNoteOrderAction } = this.props;
    const { noteValue } = this.state;
    addNoteOrderAction(noteValue);
  };

  showTitleOrderAction = () => {
    const { typeOpenToggle } = this.props;
    switch (typeOpenToggle) {
      case ADD_NOTE_ACTION_ORDER:
        return 'Add note';
      case REFUND_ACTION_ORDER:
        return 'Refund order';
      default:
        return null;
    }
  };

  showBodyOrderAction = () => {
    const { typeOpenToggle } = this.props;
    console.log(typeOpenToggle);
    switch (typeOpenToggle) {
      case ADD_NOTE_ACTION_ORDER:
        return this.showBodyAddNote();
      case REFUND_ACTION_ORDER:
        return this.showBodyRefund();
      default:
        return null;
    }
  };

  onSubmitOrderAction = () => {
    const { orderAction, typeOpenToggle } = this.props;
    const { noteValue, refundOption } = this.state;
    let payload;
    switch (typeOpenToggle) {
      case ADD_NOTE_ACTION_ORDER:
        payload = noteValue;
        break;
      case REFUND_ACTION_ORDER:
        payload = refundOption;
        break;
      default:
    }
    orderAction({
      action: typeOpenToggle,
      kindOf: 'DETAIL_ORDER_OFFLINE',
      payload
    });
  };

  onQtyReturnItemOnChange = (index, item) => {
    const { refundOption } = this.state;
    if (!item) return;
    refundOption.items[index] = item;
    this.setState({ refundOption });
  };

  conditionToSubmitOrderAction = () => {
    // true mean accept to submit otherwise denial
    const { typeOpenToggle } = this.props;
    const { noteValue, refundOption } = this.state;
    switch (typeOpenToggle) {
      case ADD_NOTE_ACTION_ORDER:
        if (!noteValue) return true;
        break;
      case REFUND_ACTION_ORDER:
        // eslint-disable-next-line no-restricted-syntax
        for (const item of refundOption.items) {
          if (item && item.qty) return true;
        }
        break;
      default:
        break;
    }
    return false;
  };

  showBodyRefund = () => {
    const { refundOption } = this.state;
    const { dataActionOrder } = this.props;
    const { items } = dataActionOrder;
    let newItem;
    console.log(refundOption.items);
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Qty to Refund</th>
            <th>Subtotal</th>
            <th>Tax Amount</th>
            <th>Discount Amount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  <div className="row">
                    <span className="col-12">{item.name}</span>
                    <span className="col-12">SKU: {item.sku}</span>
                  </div>
                </td>
                <td>{formatCurrencyCode(item.price)}</td>
                <td>
                  <div className="row">
                    <span className="col-12">Ordered {item.qty_ordered}</span>
                    <span className="col-12">Invoiced {item.qty_invoiced}</span>
                    <span className="col-12">Shipped {item.qty_shipped}</span>
                    {item.qty_refunded ? (
                      <span className="col-12">
                        Refunded {item.qty_refunded}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={event => {
                      if (
                        +event.target.value < 0 ||
                        +event.target.value + +item.qty_refunded >
                          +item.qty_shipped ||
                        +event.target.value >
                          (refundOption.items[index]
                            ? refundOption.items[index].qty_returning
                            : 10) // is undefined if empty
                      )
                        return false;
                      newItem = {
                        order_item_id: item.item_id,
                        qty: +event.target.value
                      };
                      this.onQtyReturnItemOnChange(index, newItem);
                    }}
                    value={
                      refundOption.items[index]
                        ? refundOption.items[index].qty
                        : 0
                    }
                  />
                </td>
                <td>{formatCurrencyCode(item.row_invoiced)}</td>
                <td>{formatCurrencyCode(item.tax_amount)}</td>
                <td>{formatCurrencyCode(item.discount_amount)}</td>
                <td>{formatCurrencyCode(item.row_total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  showBodyAddNote = () => {
    const { noteValue } = this.state;
    return (
      <div>
        <div className="input-group mb-3">
          <textarea
            className="form-control"
            value={noteValue}
            placeholder="Note Comments"
            onChange={this.noteInputAction}
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>
      </div>
    );
  };

  render() {
    const {
      toggleModalActionOrder,
      isLoadingSetOrderAction,
      isLoadingGetOrderAction
    } = this.props;
    return (
      <div>
        <div className={ModalStyle.modal} style={{ display: 'block' }}>
          <div className={ModalStyle.modalContentLg}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.showTitleOrderAction()}</h5>
              </div>
              <div className="modal-body">
                {isLoadingGetOrderAction ? (
                  <div
                    className="spinner-border spinner-border-sm text-center"
                    role="status"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  this.showBodyOrderAction()
                )}
              </div>
              <div className="modal-footer">
                <div className="col-md-3 p-0">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      this.onSubmitOrderAction();
                    }}
                    disabled={!this.conditionToSubmitOrderAction()}
                  >
                    Submit{' '}
                    {isLoadingSetOrderAction ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : null}
                  </button>
                </div>
                <div className="col-md-2 p-0">
                  <button
                    type="button"
                    onClick={() => toggleModalActionOrder(false)}
                    className="btn btn-secondary btn-block"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  typeOpenToggle: state.mainRd.toggleActionOrder.typeOpenToggle,
  isLoadingSetOrderAction:
    state.mainRd.toggleActionOrder.isLoadingSetOrderAction,
  isLoadingGetOrderAction:
    state.mainRd.toggleActionOrder.isLoadingGetDataOrderAction,
  dataActionOrder: state.mainRd.toggleActionOrder.dataActionOrder
});

const mapDispatchToProps = dispatch => {
  return {
    toggleModalActionOrder: payload =>
      dispatch(toggleModalActionOrder(payload)),
    orderAction: payload => dispatch(orderAction(payload)),
    getOrderAction: payload => dispatch(getOrderAction(payload))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailOrderAction);