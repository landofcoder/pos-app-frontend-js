// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListCart from './Cart/ListCart';
import routes from '../constants/routes';

type Props = {
  productList: Array,
  addToCart: (payload: Object) => void
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { productList, addToCart } = this.props;
    return (
      <div data-tid="container">
        <div className="row pt-4">
          <div className="col-md-8">
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
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <ListCart />
                <div className="mt-4">
                  <div className="row">
                    <div className="col-md-3">
                      <a
                        href="#"
                        className="btn btn-secondary btn-lg btn-block"
                      >
                        Hold
                      </a>
                    </div>
                    <div className="col-md-9">
                      <Link
                        className="btn btn-primary btn-lg btn-block"
                        to={routes.CHECKOUT}
                      >
                        Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
