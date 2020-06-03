import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleModalActionOrder,
  orderAction
} from '../../../../actions/accountAction';
import ModalStyle from '../../../styles/modal.scss';
import { ADD_NOTE_ACTION_ORDER } from '../../../../constants/root';

type Props = {
  toggleModalActionOrder: (payload: boolean) => void,
  addNoteOrderAction: (payload: string) => void,
  orderAction: (payload: object) => void,
  isLoadingNoteOrderAction: boolean
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
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

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

  render() {
    const { noteValue } = this.state;
    const {
      toggleModalActionOrder,
      orderAction,
      isLoadingNoteOrderAction
    } = this.props;
    return (
      <div>
        <div className={ModalStyle.modal} style={{ display: 'block' }}>
          <div className={ModalStyle.modalContentMd}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Note</h5>
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <div className="col-md-3 p-0">
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      orderAction({
                        action: ADD_NOTE_ACTION_ORDER,
                        kindOf: 'DETAIL_ORDER_ONLINE',
                        payload: noteValue
                      });
                    }}
                    disabled={!noteValue}
                  >
                    Add Note{' '}
                    {isLoadingNoteOrderAction ? (
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
  toggleActionOrder: state.mainRd.toggleActionOrder
});

const mapDispatchToProps = dispatch => {
  return {
    toggleModalActionOrder: payload =>
      dispatch(toggleModalActionOrder(payload)),
    orderAction: payload => dispatch(orderAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailOrderAction);
