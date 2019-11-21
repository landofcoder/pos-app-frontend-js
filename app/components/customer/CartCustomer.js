// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toggleModalCustomer, searchCustomer } from '../../actions/homeAction';
import Styles from './cart-customer.scss';
import ModalStyle from '../styles/modal.scss';

type Props = {
  customer: Object,
  isOpenFindCustomer: boolean,
  toggleModalCustomer: (payload: boolean) => void,
  searchCustomer: () => void
};

class CartCustomer extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      delayTimer: null
    };
  }

  onSearchAction = e => {
    const { searchCustomer } = this.props;
    const { value } = e.target;
    const { delayTimer } = this.state;
    clearTimeout(delayTimer);
    const delayTimerRes = setTimeout(() => {
      // Do the ajax stuff
      searchCustomer(value);
    }, 300); // Will do the ajax stuff after 1000 ms, or 1 s
    this.setState({ delayTimer: delayTimerRes });
  };

  render() {
    const { customer, isOpenFindCustomer, toggleModalCustomer } = this.props;
    return (
      <div className={Styles.wrapCartCustomer}>
        {isOpenFindCustomer === true ? (
          <div
            className={ModalStyle.modal}
            style={{ display: isOpenFindCustomer ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContent}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Find customer</h5>
                  <div>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Eg: james blunt"
                        aria-label="Recipient's username"
                        onChange={this.onSearchAction}
                        aria-describedby="button-addon2"
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          id="button-addon2"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                  <ul className="list-group">
                    <li className="list-group-item active">Cras justo odio</li>
                    <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Morbi leo risus</li>
                    <li className="list-group-item">Porta ac consectetur ac</li>
                    <li className="list-group-item">Vestibulum at eros</li>
                  </ul>
                </div>
                <div className="modal-footer">
                  <div className="col-md-2 p-0">
                    <button
                      type="button"
                      onClick={() => toggleModalCustomer(false)}
                      className="btn btn-secondary btn-block"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="row">
          {customer == null ? (
            <div className="col-md-6 text-center">
              <span className={Styles.customerName}>Guest customer</span>
            </div>
          ) : (
            <div className="col-md-6">Customer</div>
          )}
          <div className="col-md-6 text-right">
            <button
              type="button"
              onClick={() => toggleModalCustomer(true)}
              className="btn btn-link btn-sm"
            >
              Customers
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: state.mainRd.cartCurrent.customer,
  isOpenFindCustomer: state.mainRd.isOpenFindCustomer
});

const mapDispatchToProps = dispatch => {
  return {
    toggleModalCustomer: payload => dispatch(toggleModalCustomer(payload)),
    searchCustomer: payload => dispatch(searchCustomer(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartCustomer);
