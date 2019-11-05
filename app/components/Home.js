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
  cashCheckoutAction: () => void,
  searchAction: () => void,
  getDefaultProductAction: () => void
};

export default class Home extends Component<Props> {
  props: Props;

  componentDidMount(): * {
    const { getDefaultProductAction } = this.props;
    getDefaultProductAction();
  }

  getFirstMedia = item => {
    const gallery = item.media_gallery_entries
      ? item.media_gallery_entries
      : [];
    if (gallery.length > 0) {
      const image = gallery[0].file;
      return `http://magento2.local1/pub/media/catalog/product/${image}`;
    }
    // Return default image
    return `http://magento2.local1/pub/media/catalog/product/`;
  };

  render() {
    const classWrapProductPanel = `${Styles.wrapProductPanel} row`;
    const {
      productList,
      addToCart,
      holdAction,
      cashCheckoutAction,
      searchAction
    } = this.props;
    console.log('product list:', productList);
    return (
      <>
        <div data-tid="container">
          <div className="row" id={Styles.wrapPostContainerId}>
            <div className="col-md-9">
              <div className={classWrapProductPanel}>
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
                      onChange={searchAction}
                      placeholder="name, sku"
                      aria-label="Username"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
                </div>
                {productList.map(item => (
                  <div
                    className={`col-md-3 mb-4 ${Styles.wrapProductItem}`}
                    key={item.id}
                  >
                    <div className="card">
                      <div className="card-body">
                        <img
                          className={Styles.wrapImage}
                          alt="product image"
                          src={this.getFirstMedia(item)}
                        />
                        <h5 className="card-title">{item.name}</h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-3">
              <div className={CommonStyle.wrapLevel1}>
                <div className={CommonStyle.wrapCartPanelPosition}>
                  <ListCart/>
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
              <button
                type="button"
                onClick={holdAction}
                className="btn btn-secondary btn-lg btn-block"
              >
                Hold
              </button>
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
              <button
                type="button"
                className="btn btn-primary btn-lg btn-block"
                onClick={cashCheckoutAction}
              >
                CASH
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
