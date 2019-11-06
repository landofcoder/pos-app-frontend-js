// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListCart from './Cart/ListCart';
import routes from '../constants/routes';
import Styles from './Home.scss';
import CommonStyle from './common.scss';
import CashPayment from './payment/Cash/Cash';

type Props = {
  productList: Array,
  addToCart: (payload: Object) => void,
  holdAction: () => void,
  searchAction: () => void,
  getDefaultProductAction: () => void,
  cartCurrent: Array
};

export default class Home extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      paymentType: ''
    };
  }

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

  sumTotalPrice = () => {
    const { cartCurrent } = this.props;
    let totalPrice = 0;
    cartCurrent.data.forEach(item => {
      totalPrice += item.price;
    });
    return totalPrice;
  };

  renderSwitchPanel = productList => {
    const { addToCart } = this.props;
    const { paymentType } = this.state;
    switch (paymentType) {
      case '':
        return productList.map(item => (
          <div
            className={`col-md-3 mb-4 ${Styles.wrapProductItem}`}
            key={item.id}
          >
            <div className="card">
              <div className="card-body">
                <a role="presentation" onClick={() => addToCart(item)}>
                  <img
                    alt="name"
                    className={Styles.wrapImage}
                    src={this.getFirstMedia(item)}
                  />
                  <h5 className="card-title">{item.name}</h5>
                </a>
              </div>
            </div>
          </div>
        ));
      case 'cash':
        return <CashPayment />;
      default:
        return <></>;
    }
  };

  switchToPaymentType = paymentType => {
    this.setState({ paymentType });
  };

  render() {
    const classWrapProductPanel = `${Styles.wrapProductPanel} row`;
    const { productList, holdAction, searchAction } = this.props;
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
                {this.renderSwitchPanel(productList)}
              </div>
            </div>
            <div className="col-md-3">
              <div className={CommonStyle.wrapLevel1}>
                <div className={CommonStyle.wrapCartPanelPosition}>
                  <ListCart />
                  <div className={CommonStyle.subTotalContainer}>
                    <div className={CommonStyle.wrapSubTotal}>
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
                          <span>{this.sumTotalPrice()}</span>
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
                onClick={() => this.switchToPaymentType('cash')}
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
