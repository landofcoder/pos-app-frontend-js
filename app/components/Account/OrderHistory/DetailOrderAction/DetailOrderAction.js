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

type Props = {
  toggleModalActionOrder: (payload: boolean) => void,
  typeOpenToggle: string,
  addNoteOrderAction: (payload: string) => void,
  orderAction: (payload: object) => void,
  getOrderAction: (payload: object) => void,
  isLoadingSetOrderAction: boolean,
  isLoadingGetOrderAction: boolean
};

class DetailOrderAction extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      noteValue: ''
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
        return this.showBodyReorder();
      default:
        return null;
    }
  };

  onSubmitOrderAction = () => {
    const { orderAction, typeOpenToggle } = this.props;
    const { noteValue } = this.state;
    switch (typeOpenToggle) {
      case ADD_NOTE_ACTION_ORDER:
        orderAction({
          action: ADD_NOTE_ACTION_ORDER,
          kindOf: 'DETAIL_ORDER_ONLINE',
          payload: noteValue
        });
        break;
      case REFUND_ACTION_ORDER:
        break;
      default:
    }
  };

  showBodyReorder = () => {
    return 'Hello world';
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
    const { noteValue } = this.state;
    const {
      toggleModalActionOrder,
      isLoadingSetOrderAction,
      isLoadingGetOrderAction
    } = this.props;
    return (
      <div>
        <div className={ModalStyle.modal} style={{ display: 'block' }}>
          <div className={ModalStyle.modalContentMd}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isLoadingGetOrderAction ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    this.showTitleOrderAction()
                  )}
                </h5>
              </div>
              <div className="modal-body">{this.showBodyOrderAction()}</div>
              <div className="modal-footer">
                <div className="col-md-3 p-0">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      this.onSubmitOrderAction();
                    }}
                    disabled={!noteValue}
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
                    CLOSE
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
    state.mainRd.toggleActionOrder.isLoadingGetDataOrderAction
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
