import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes.json';
import OrderHistory from './OrderHistory/OrderHistory';
import CashierInfo from './CashierInfo/CashierInfo';
import Styles from './account.scss';

export default class Account extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = { cashierSelect: '', orderHistorySelect: 'active' };
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
    console.log(`cashier select : ${cashierSelect}`);
    return (
      <>
        <div data-tid="container" className="pr-0 pl-0 pt-2">
          <div className={`${Styles.wrapFullHeight}`}>
            <div className="row">
              <div className="col-3">
                <div className="flex-column col-md-1 pl-0 pr-1 mt-2 mb-2">
                  <Link to={routes.HOME}>
                    <i
                      className={`fas fa-arrow-left fa-1x pl-3 ${Styles.greyColor}`}
                    ></i>
                  </Link>
                </div>
                <div
                  className="card nav flex-column nav-pills ml-2"
                  id="v-pills-tab"
                  role="tablist"
                  aria-orientation="vertical"
                >
                  {/* {<div className="card-header"></div>} */}
                  <a
                    className={`nav-link ${orderHistorySelect} ${Styles.radiusButton}`}
                    id="v-pills-profile-tab"
                    data-toggle="pill"
                    href="#v-pills-profile"
                    role="tab"
                    aria-controls="v-pills-profile"
                    onClick={this.orderHistoryAction}
                  >
                    Order History
                  </a>
                  <a
                    className={`nav-link ${cashierSelect} ${Styles.radiusButton}`}
                    id="v-pills-home-tab"
                    data-toggle="pill"
                    href="#v-pills-home"
                    role="tab"
                    aria-controls="v-pills-home"
                    onClick={this.cashierAction}
                  >
                    Account Setting
                  </a>
                </div>
              </div>
              <div className="col-9 mt-2">
                {orderHistorySelect ? <OrderHistory /> : null}
                {cashierSelect ? <CashierInfo /> : null}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
