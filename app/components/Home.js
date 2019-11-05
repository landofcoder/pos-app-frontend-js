// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListCart from './Cart/ListCart';
import routes from '../constants/routes';
import Styles from './Home.scss';
import CommonStyle from './common.scss';

type Props = {
  productList: Array,
  addToCart: (payload: Object) => void,
  holdAction: () => void,
  cashCheckoutAction: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const {
      productList,
      addToCart,
      holdAction,
      cashCheckoutAction
    } = this.props;
    return (
      <>
        <div data-tid="container">
          <div className="row pt-4">
            <div className="col-md-9">
              <div className="col-md-12 mb-4">
                <div className="input-group flex-nowrap">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="addon-wrapping">
                      Search
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="name, sku"
                    aria-label="Username"
                    aria-describedby="addon-wrapping"
                  />
                </div>
              </div>
              <div className="row">
                {productList.map(item => (
                  <div className="col-md-4 mb-4" key={item.id}>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <h6 className="card-subtitle mb-2 text-muted">
                          Card subtitle
                        </h6>
                        <p className="card-text">
                          Some quick example text to build on the card title and
                          make up make up make up the bulk of the card content.
                        </p>
                        <a
                          href="#"
                          className="card-link"
                          onClick={() => addToCart(item)}
                        >
                          Add to cart
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-3">
              <div className={CommonStyle.wrapLevel1}>
                <div className={CommonStyle.wrapCartPanelPosition}>
                  <ListCart />
                  <div className={CommonStyle.subTotalContainer}>
                    <div className={CommonStyle.wrapSubTotal}>
                      <div className={CommonStyle.wrapRow}>
                        <div className={CommonStyle.wrapLabel}>
                          <span>Subtotal</span>
                        </div>
                        <div className={CommonStyle.wrapValue}>
                          <span>$113.00</span>
                        </div>
                      </div>
                      <div className={CommonStyle.wrapRow}>
                        <div className={CommonStyle.wrapLabel}>
                          <span>Tax</span>
                        </div>
                        <div className={CommonStyle.wrapValue}>
                          <span>$0.00</span>
                        </div>
                      </div>
                      <div className={CommonStyle.wrapRow}>
                        <div className={CommonStyle.wrapLabel}>
                          <span>Discount</span>
                        </div>
                        <div className={CommonStyle.wrapValue}>
                          <span>$0.00</span>
                        </div>
                      </div>
                      <div className={CommonStyle.wrapRow}>
                        <div
                          className={CommonStyle.wrapLabel}
                          data-grand-total="1"
                        >
                          <span>GRAND TOTAL</span>
                        </div>
                        <div
                          className={CommonStyle.wrapValue}
                          data-grand-total="1"
                        >
                          <span>$113.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.wrapFooterAction}>
          <div className={Styles.wrapAction}>
            <div className="col-md-2 pr-0">
              <Link
                onClick={holdAction}
                className="btn btn-secondary btn-lg btn-block"
              >
                Hold
              </Link>
            </div>
            <div className="col-md-2">
              <Link
                className="btn btn-danger btn-lg btn-block"
                to={routes.CHECKOUT}
              >
                Empty cart
              </Link>
            </div>
            <div className="col-md-3 pl-0 pr-0">
              <Link
                className="btn btn-primary btn-lg btn-block"
                onClick={cashCheckoutAction}
              >
                CASH
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}
