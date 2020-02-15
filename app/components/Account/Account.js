import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes.json';
import OrderHistory from './OrderHistory/OrderHistory';
import CashierInfo from './CashierInfo/CashierInfo';
import ConnectDevices from './ConnectDevices/ConnectDevices';
import Styles from './Account.scss';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = { viewSelected: 'orderHistory' };
  }

  cashierAction = e => {
    e.preventDefault();
    this.setState({ viewSelected: 'cashierInfo' });
  };

  orderHistoryAction = e => {
    e.preventDefault();
    this.setState({ viewSelected: 'orderHistory' });
  };

  connectDevicesAction = e => {
    e.preventDefault();
    this.setState({ viewSelected: 'connectDevices' });
  };

  render() {
    const { cashierSelect, orderHistorySelect, viewSelected } = this.state;
    return (
      <>
        <div data-tid="container" className="pr-0 pl-0 pt-2">
          <div>
            <div className="row">
              <div className="flex-column col-md-1 pl-0 pr-1 mt-2 mb-2">
                <Link to={routes.POS}>
                  <i
                    className={`fas fa-arrow-left fa-1x pl-3 ${Styles.greyColor}`}
                  ></i>
                </Link>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <div
                  className="card nav flex-column nav-pills ml-2"
                  id="v-pills-tab"
                  role="tablist"
                  aria-orientation="vertical"
                >
                  <a
                    className={`nav-link ${orderHistorySelect} ${Styles.radiusButton}`}
                    id="v-pills-profile-tab"
                    data-toggle="pill"
                    href="#"
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
                    role="tab"
                    href="#"
                    aria-controls="v-pills-home"
                    onClick={this.cashierAction}
                  >
                    Account Setting
                  </a>
                  <a
                    className="nav-link"
                    role="tab"
                    href="#"
                    onClick={this.connectDevicesAction}
                  >
                    Connect Devices
                  </a>
                </div>
              </div>
              <div className={`col-9 ${Styles.wrapFullHeightList}`}>
                {(() => {
                  switch (viewSelected) {
                    case 'orderHistory':
                      return <OrderHistory />;
                    case 'cashierInfo':
                      return <CashierInfo />;
                    case 'connectDevices':
                      return <ConnectDevices />;
                    default:
                      return null;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
