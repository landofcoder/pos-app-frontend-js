import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {
  toggleModalActionOrder,
  orderAction,
  getOrderAction
} from '../../../../actions/accountAction';
import Close from '../../../commons/x';
import ModalStyle from '../../../styles/modal.scss';
import Styles from './detail-order-action.scss';
import {
  ADD_NOTE_ACTION_ORDER,
  REFUND_ACTION_ORDER,
  PAYMENT_ACTION_ORDER,
  SHIPMENT_ACTION_ORDER,
  CANCEL_ACTION_ORDER
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
  dataActionOrder: boolean,
  isOpenToggleActionOrder: boolean
};

class DetailOrderAction extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      noteValue: '',
      refundOption: {
        items: [],
        notify: true,
        arguments: {
          extension_attributes: {
            return_to_stock_items: []
          }
        }
      },
      shipmentOption: {
        items: [],
        optionShipAll: false
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
      action: typeOpenToggle
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
      case PAYMENT_ACTION_ORDER:
        return 'Payment order';
      case SHIPMENT_ACTION_ORDER:
        return 'Ship items';
      case ADD_NOTE_ACTION_ORDER:
        return 'Add note';
      case REFUND_ACTION_ORDER:
        return 'Refund order';
      case CANCEL_ACTION_ORDER:
        return 'Cancel order';
      default:
        return null;
    }
  };

  showBodyOrderAction = () => {
    const { typeOpenToggle } = this.props;
    switch (typeOpenToggle) {
      case SHIPMENT_ACTION_ORDER:
        return this.showBodyTakeShipment();
      case PAYMENT_ACTION_ORDER:
        return this.showBodyTakePayment();
      case ADD_NOTE_ACTION_ORDER:
        return this.showBodyAddNote();
      case REFUND_ACTION_ORDER:
        return this.showBodyRefund();
      case CANCEL_ACTION_ORDER:
        return this.showBodyCancel();
      default:
        return null;
    }
  };

  onSubmitOrderAction = () => {
    const { orderAction, typeOpenToggle } = this.props;
    const { noteValue, refundOption, shipmentOption } = this.state;
    let payload;
    switch (typeOpenToggle) {
      case ADD_NOTE_ACTION_ORDER:
        payload = noteValue;
        break;
      case REFUND_ACTION_ORDER:
        payload = refundOption;
        break;
      case SHIPMENT_ACTION_ORDER:
        payload = shipmentOption;
        break;
      case CANCEL_ACTION_ORDER:
        break;
      default:
    }
    orderAction({
      action: typeOpenToggle,
      payload
    });
  };

  onQtyReturnItemOnChange = (index, item) => {
    const { refundOption } = this.state;
    if (!item) return;
    refundOption.items[index] = item;
    this.setState({ refundOption });
  };

  onQtyShipItemOnChange = (index, item) => {
    const { shipmentOption } = this.state;
    if (!item) return;
    shipmentOption.items[index] = item;
    this.setState({ shipmentOption });
  };

  conditionToSubmitOrderAction = () => {
    // true mean accept to submit otherwise denial
    const { typeOpenToggle } = this.props;
    const { noteValue, refundOption, shipmentOption } = this.state;
    switch (typeOpenToggle) {
      case ADD_NOTE_ACTION_ORDER:
        if (noteValue) return false;
        return true;
      case REFUND_ACTION_ORDER:
        // eslint-disable-next-line no-restricted-syntax
        for (const item of refundOption.items) {
          if (item && item.qty) return false;
        }
        break;
      case SHIPMENT_ACTION_ORDER:
        // eslint-disable-next-line no-restricted-syntax
        for (const item of shipmentOption.items) {
          if (item && item.qty) return false;
        }
        break;
      case CANCEL_ACTION_ORDER:
        return false;
      default:
        break;
    }
    return true;
  };

  /**
   * pass value of input , index of this item, and this item
   * @param string value
   * @param int index
   * @param object item
   */
  conditionChangeInputRefund = (value, index, item) => {
    const { refundOption } = this.state;

    if (
      value < 0 ||
      value + +item.qty_refunded > +item.qty_shipped ||
      value >
        (refundOption.items[index]
          ? refundOption.items[index].qty_returning
          : 10) // is undefined if empty
    )
      return;
    const newItem = {
      order_item_id: item.item_id,
      qty: value
    };
    this.onQtyReturnItemOnChange(index, newItem);
  };

  renderIsToggleReturnStock = item => {
    const { refundOption } = this.state;
    return (
      refundOption.arguments.extension_attributes.return_to_stock_items.indexOf(
        item
      ) !== -1
    );
  };

  onClickReturnToStockToggle = itemOrder => {
    const { refundOption } = this.state;
    const newReturnStock =
      refundOption.arguments.extension_attributes.return_to_stock_items;
    const getIndex = newReturnStock.indexOf(itemOrder);
    if (getIndex !== -1) {
      newReturnStock.splice(getIndex, 1);
    } else {
      newReturnStock.push(itemOrder);
    }
    refundOption.arguments.extension_attributes.return_to_stock_items = newReturnStock;
    this.setState({ refundOption });
  };

  showBodyRefund = () => {
    const { refundOption } = this.state;
    const { dataActionOrder } = this.props;
    const { items } = dataActionOrder;
    return (
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th>Product</th>
            <th>Price</th>
            <th width="13%">Qty</th>
            <th width="13%">Return to stock</th>
            <th width="10%">Qty to Refund</th>
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
                  <div
                    className={Styles.btnActionToggle}
                    role="button"
                    onClick={() => {
                      this.onClickReturnToStockToggle(item.item_id);
                    }}
                    onKeyPress={() => {}}
                    tabIndex="0"
                  >
                    {this.renderIsToggleReturnStock(item.item_id) ? (
                      <i
                        className="fa fa-toggle-on fa-2x"
                        aria-hidden="true"
                      ></i>
                    ) : (
                      <i
                        className="fa fa-toggle-off fa-2x"
                        aria-hidden="true"
                      ></i>
                    )}
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0"
                    onChange={event => {
                      this.conditionChangeInputRefund(
                        +event.target.value,
                        index,
                        item
                      );
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

  showBodyTakeShipment = () => {
    const { shipmentOption } = this.state;
    const { dataActionOrder } = this.props;
    const { items } = dataActionOrder;
    return (
      <>
        <div className="mb-2 d-flex">
          <span className="pr-3 align-self-center">Select max Qty to Ship</span>
          <div
            className={Styles.btnActionToggle}
            onClick={() => {
              this.onClickShipAllQtyToggle();
            }}
          >
            {this.renderIsToggleShipAll() ? (
              <i className="fa fa-toggle-on fa-2x" aria-hidden="true"></i>
            ) : (
              <i className="fa fa-toggle-off fa-2x" aria-hidden="true"></i>
            )}
          </div>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product</th>
              <th scope="col">Qty left</th>
              <th width="17%">Qty to ship</th>
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
                  <td>
                    {+item.qty_invoiced -
                      +item.qty_shipped -
                      +item.qty_canceled}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      onChange={event => {
                        this.conditionChangeInputShipQty(
                          +event.target.value,
                          index,
                          item
                        );
                      }}
                      value={
                        shipmentOption.items[index]
                          ? shipmentOption.items[index].qty
                          : 0
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  };

  onClickShipAllQtyToggle = () => {
    const { shipmentOption } = this.state;
    const { dataActionOrder } = this.props;
    const { items } = dataActionOrder;

    let { optionShipAll } = shipmentOption;
    shipmentOption.items = [];
    if (optionShipAll) {
      // delete all option ship
      shipmentOption.optionShipAll = false;
    } else {
      shipmentOption.optionShipAll = true;
      items.map((item, index) => {
        const newItem = {
          order_item_id: item.item_id,
          qty: +item.qty_ordered - +item.qty_shipped - +item.qty_canceled
        };
        shipmentOption.items.push(newItem);
      });
      // add all quantity option ship
    }
    this.setState({ shipmentOption });
  };

  conditionChangeInputShipQty = (value, index, item) => {
    const { shipmentOption } = this.state;

    if (
      value < 0 ||
      value + +item.qty_shipped > +item.qty_ordered ||
      value >
        (shipmentOption.items[index]
          ? shipmentOption.items[index].qty_shipped
          : 10) // is undefined if empty
    )
      return;
    const newItem = {
      order_item_id: item.item_id,
      qty: value
    };
    this.onQtyShipItemOnChange(index, newItem);
  };

  renderIsToggleShipAll = item => {
    const { shipmentOption } = this.state;
    const { optionShipAll } = shipmentOption;
    return optionShipAll;
  };

  showBodyCancel = () => {
    return (
      <div>
        <div className="input-group mb-3">
          <span>Are your sure want to cancel this order ?</span>
        </div>
      </div>
    );
  };

  render() {
    const {
      toggleModalActionOrder,
      isLoadingSetOrderAction,
      isLoadingGetOrderAction,
      isOpenToggleActionOrder,
      typeOpenToggle
    } = this.props;
    return (
      <Modal
        overlayClassName={ModalStyle.Overlay}
        shouldCloseOnOverlayClick
        onRequestClose={() => toggleModalActionOrder(false)}
        className={`${ModalStyle.Modal}`}
        isOpen={isOpenToggleActionOrder}
        contentLabel="Example Modal"
      >
        <div
          className={ModalStyle.modalContentLg}
          style={{
            width: typeOpenToggle === CANCEL_ACTION_ORDER ? '400px' : '-1'
          }}
        >
          <div
            className={ModalStyle.close}
            role="presentation"
            onClick={() => toggleModalActionOrder(false)}
          >
            <Close />
          </div>

          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{this.showTitleOrderAction()}</h5>
            </div>
            <div className="modal-body">
              {isLoadingGetOrderAction ? (
                <div
                  style={{ color: '#666' }}
                  className="d-flex justify-content-center"
                >
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                this.showBodyOrderAction()
              )}
            </div>
            <div className="modal-footer">
              {typeOpenToggle === CANCEL_ACTION_ORDER ? (
                <div className="col-md-3 p-0">
                  <button
                    type="button"
                    className="btn btn-secondary btn-block"
                    onClick={() => {
                      toggleModalActionOrder({
                        type: CANCEL_ACTION_ORDER,
                        status: false
                      });
                    }}
                    disabled={!this.conditionToSubmitOrderAction()}
                  >
                    Cancel
                  </button>
                </div>
              ) : null}
              <div className="col-md-3 p-0">
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => {
                    this.onSubmitOrderAction();
                  }}
                  disabled={this.conditionToSubmitOrderAction()}
                >
                  {isLoadingSetOrderAction ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  typeOpenToggle: state.mainRd.toggleActionOrder.typeOpenToggle,
  isLoadingSetOrderAction:
    state.mainRd.toggleActionOrder.isLoadingSetOrderAction,
  isLoadingGetOrderAction:
    state.mainRd.toggleActionOrder.isLoadingGetDataOrderAction,
  dataActionOrder: state.mainRd.toggleActionOrder.dataActionOrder,
  isOpenToggleActionOrder:
    state.mainRd.toggleActionOrder.isOpenToggleActionOrder
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
