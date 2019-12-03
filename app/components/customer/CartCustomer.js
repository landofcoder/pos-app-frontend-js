// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleModalCustomer,
  searchCustomer,
  selectCustomerForCurrentCart,
  unSelectCustomerForCurrentCart
} from '../../actions/homeAction';
import Styles from './cart-customer.scss';
import ModalStyle from '../styles/modal.scss';

type Props = {
  customer: Object,
  isOpenFindCustomer: boolean,
  toggleModalCustomer: (payload: boolean) => void,
  searchCustomer: () => void,
  isLoadingSearchCustomer: boolean,
  customerSearchResult: Array,
  selectCustomerForCurrentCart: (payload: Object) => void,
  unSelectCustomerForCurrentCart: (payload: Object) => void
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
    const {
      customer,
      isOpenFindCustomer,
      toggleModalCustomer,
      isLoadingSearchCustomer,
      customerSearchResult,
      selectCustomerForCurrentCart,
      unSelectCustomerForCurrentCart
    } = this.props;

    return (
      <div className={Styles.wrapCartCustomer}>
        {isOpenFindCustomer === true ? (
          <div
            className={ModalStyle.modal}
            style={{ display: isOpenFindCustomer ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContent}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Find customer</h5>
                </div>
                <div className="modal-body">
                  <div>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by: id or email"
                        aria-label="Recipient's username"
                        onChange={this.onSearchAction}
                        aria-describedby="button-addon2"
                      />
                    </div>
                  </div>

                  {isLoadingSearchCustomer ? (
                    <div className="d-flex justify-content-center">
                      <div
                        className="spinner-border text-secondary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <ul className="list-group">
                      {customerSearchResult.map((item, index) => {
                        return (
                          <button
                            key={index}
                            onClick={() => selectCustomerForCurrentCart(item)}
                            type="button"
                            className="list-group-item list-group-item-action"
                          >
                            {item.firstname} {item.lastname}
                          </button>
                        );
                      })}
                      {customerSearchResult.length === 0 ? (
                        <div>
                          <p className="text-muted">No result found</p>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </ul>
                  )}
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
        <button
          type="button"
          className="btn btn-outline-dark btn-lg btn-block"
          onClick={() => toggleModalCustomer(true)}
        >
          Customer
        </button>
        {/* {customer == null ? ( */}
        {/*  <div className={Styles.wrapLabel}> */}
        {/*    <span className={Styles.customerName}>Guest customer</span> */}
        {/*  </div> */}
        {/* ) : ( */}
        {/*  <div className={Styles.wrapLabel}> */}
        {/*    <span className={Styles.customerName}> */}
        {/*      <a href="#" className="badge badge-secondary"> */}
        {/*        {customer.firstname} {customer.lastname} */}
        {/*      </a> */}
        {/*      <button */}
        {/*        type="button" */}
        {/*        className="close" */}
        {/*        aria-label="Close" */}
        {/*        onClick={unSelectCustomerForCurrentCart} */}
        {/*      > */}
        {/*        <span aria-hidden="true">&times;</span> */}
        {/*      </button> */}
        {/*    </span> */}
        {/*  </div> */}
        {/* )} */}

        {/* <div className={Styles.wrapValue}> */}
        {/*  <button */}
        {/*    type="button" */}
        {/*    onClick={() => toggleModalCustomer(true)} */}
        {/*    className="btn btn-link btn-sm" */}
        {/*  > */}
        {/*    Customers */}
        {/*  </button> */}
        {/* </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  customer: state.mainRd.cartCurrent.customer,
  isOpenFindCustomer: state.mainRd.isOpenFindCustomer,
  isLoadingSearchCustomer: state.mainRd.isLoadingSearchCustomer,
  customerSearchResult: state.mainRd.customerSearchResult
});

const mapDispatchToProps = dispatch => {
  return {
    toggleModalCustomer: payload => dispatch(toggleModalCustomer(payload)),
    searchCustomer: payload => dispatch(searchCustomer(payload)),
    selectCustomerForCurrentCart: payload =>
      dispatch(selectCustomerForCurrentCart(payload)),
    unSelectCustomerForCurrentCart: payload =>
      dispatch(unSelectCustomerForCurrentCart(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartCustomer);
