import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../../constants/routes.json';
import OrderHistory from './OrderHistory/OrderHistory';
import CashierInfo from './CashierInfo/CashierInfo';
import Styles from './Account.scss';

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewSelected: 'ordersHistory'
    };
  }

  viewSelectedAction = payload => {
    switch (payload) {
      case 'ordersHistory':
        this.setState({ viewSelected: 'ordersHistory' });
        break;
      case 'CashierInfo':
        this.setState({ viewSelected: 'CashierInfo' });
        break;
      default:
        break;
    }
  };

  renderShowUp = () => {
    const { viewSelected } = this.state;
    switch (viewSelected) {
      case 'ordersHistory':
        return <OrderHistory />;
      case 'CashierInfo':
        return <CashierInfo />;
      default:
        return null;
    }
  };

  render() {
    const { viewSelected } = this.state;
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
                    className={`nav-link ${
                      viewSelected === 'ordersHistory' ? 'active' : ''
                    } ${Styles.radiusButton}`}
                    id="v-pills-profile-tab"
                    data-toggle="pill"
                    href="#v-pills-profile"
                    role="tab"
                    aria-controls="v-pills-profile"
                    onClick={e => {
                      e.preventDefault();
                      this.viewSelectedAction('ordersHistory');
                    }}
                  >
                    Order History
                  </a>
                  <a
                    className={`nav-link ${
                      viewSelected === 'CashierInfo' ? 'active' : ''
                    } ${Styles.radiusButton}`}
                    id="v-pills-home-tab"
                    data-toggle="pill"
                    href="#v-pills-home"
                    role="tab"
                    aria-controls="v-pills-home"
                    onClick={e => {
                      e.preventDefault();
                      this.viewSelectedAction('CashierInfo');
                    }}
                  >
                    Account Setting
                  </a>
                </div>
              </div>
              <div className={`col-9 ${Styles.wrapFullHeightList}`}>
                {this.renderShowUp()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
