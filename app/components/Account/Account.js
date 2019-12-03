import React, { Component } from 'react';
import Styles from './Account.scss';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes.json';
import OrderHistory from './OrderHistory/OrderHistory';
export default class Account extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.state = { cashierSelect: 'active', orderHistorySelect: '' };
  }
  cashierAction = e => {
    e.preventDefault();
    this.setState({ cashierSelect: 'active', orderHistorySelect: '' });
  };
  orderHistoryAction = e => {
    e.preventDefault();
    this.setState({ orderHistorySelect: 'active', cashierSelect: '' });
  };
  render() {
    const { cashierSelect, orderHistorySelect } = this.state;
    console.log('cashier select : ' + cashierSelect);
    const classWrapProductPanel = `pr-3 ${Styles.wrapProductPanel} row`;
    return (
      <>
        <div className="col-md-1 pl-0 pr-1">
          <Link
            className="btn btn-outline-secondary btn-lg btn-block"
            to={routes.HOME}
          >
            HOME
          </Link>
        </div>
        <div
          data-tid="container"
          className={`${Styles.wrapFullHeight} pr-0 pl-0`}
        >
          <div class="row">
            <div class="col-3">
              <div
                class="nav flex-column nav-pills"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <a
                  class={`nav-link ${cashierSelect}`}
                  id="v-pills-home-tab"
                  data-toggle="pill"
                  href="#v-pills-home"
                  role="tab"
                  aria-controls="v-pills-home"
                  onClick={this.cashierAction}
                >
                  Cashier
                </a>
                <a
                  class={`nav-link ${orderHistorySelect}`}
                  id="v-pills-profile-tab"
                  data-toggle="pill"
                  href="#v-pills-profile"
                  role="tab"
                  aria-controls="v-pills-profile"
                  onClick={this.orderHistoryAction}
                >
                  Order History
                </a>
              </div>
            </div>
            <div class="col-9">
              <OrderHistory />
            </div>
          </div>
        </div>
      </>
    );
  }
}
