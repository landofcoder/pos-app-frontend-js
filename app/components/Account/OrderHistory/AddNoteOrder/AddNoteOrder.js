import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleModalAddNote,
  orderAction
} from '../../../../actions/accountAction';
import ModalStyle from '../../../styles/modal.scss';
import { NOTE_ORDER_ACTION } from '../../../../constants/root';

type Props = {
  toggleModalAddNote: (payload: boolean) => void,
  addNoteOrderAction: (payload: string) => void,
  orderAction: (payload: object) => void,
  isLoadingNoteOrderAction: boolean
};

class AddNoteOrder extends Component<Props> {
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
      const { toggleModalAddNote } = this.props;
      // Hide any modal
      toggleModalAddNote(false);
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
      toggleModalAddNote,
      orderAction,
      isLoadingNoteOrderAction
    } = this.props;
    return (
      <div>
        <div className={ModalStyle.modal} style={{ display: 'block' }}>
          <div className={ModalStyle.modalContent}>
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
                        action: NOTE_ORDER_ACTION,
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
                    onClick={() => toggleModalAddNote(false)}
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
  isOpenAddNote: state.mainRd.isOpenAddNote,
  isLoadingNoteOrderAction: state.mainRd.isLoadingNoteOrderAction
});

const mapDispatchToProps = dispatch => {
  return {
    toggleModalAddNote: payload => dispatch(toggleModalAddNote(payload)),
    orderAction: payload => dispatch(orderAction(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddNoteOrder);
