// @flow
import React, { Component } from 'react';

type Props = {
  productList: Array,
  cartCurrent: Object,
  addToCart: (payload: Object) => void
};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    const { productList, cartCurrent, addToCart } = this.props;
    const cartCurrentData = cartCurrent.data;
    return (
      <div className="container-fluid" data-tid="container">
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
                <ul className="list-group">
                  {cartCurrentData.map(item => (
                    <li key={item.id} className="list-group-item">
                      Cras justo odio
                    </li>
                  ))}
                </ul>
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
                      <a href="#" className="btn btn-primary btn-lg btn-block">
                        Checkout
                      </a>
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
