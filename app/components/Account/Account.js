import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as routes from '../../constants/routes.json';
import OrderHistory from './OrderHistory/OrderHistory';
import CashierInfo from './CashierInfo/CashierInfo';
import ConnectDevices from './ConnectDevices/ConnectDevices';
import Styles from './Account.scss';
import SyncManager from './SyncManager/SyncManager';

type Props = {
  syncStatus: boolean
};
class Account extends Component {
  props: Props;

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
      case 'connectDevices':
        return <ConnectDevices />;
      case 'syncManager':
        return <SyncManager />;
      default:
        return null;
    }
  };

  connectDevicesAction = e => {
    e.preventDefault();
    this.setState({ viewSelected: 'connectDevices' });
  };

  syncManagerAction = e => {
    e.preventDefault();
    this.setState({ viewSelected: 'syncManager' });
  };

  render() {
    const { viewSelected } = this.state;
    const { syncStatus } = this.props;
    console.log(syncStatus);
    return (
      <>
        <div data-tid="container" className="pr-0 pl-0 pt-2">
          <div>
            <div className="row ml-0 mr-0 pb-3">
              <div className="col-1">
                <div className="flex-column col-md-1 pl-0 pr-1 mt-2 mb-2">
                  <Link to={routes.POS}>
                    <i
                      className={`fas fa-arrow-left fa-1x pl-3 ${Styles.greyColor}`}
                    ></i>
                  </Link>
                </div>
              </div>
              <div className="col-2"></div>
              <div className="col-9">
                <ul
                  style={{ paddingRight: '15px' }}
                  className="nav nav-pills nav-fill"
                >
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        viewSelected === 'ordersHistory' ? 'active' : ''
                      } ${Styles.radiusButton}`}
                      id="v-pills-profile-tab"
                      data-toggle="pill"
                      href="#"
                      role="tab"
                      aria-controls="v-pills-profile"
                      onClick={e => {
                        e.preventDefault();
                        this.viewSelectedAction('ordersHistory');
                      }}
                    >
                      Order History
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        viewSelected === 'connectDevices' ? 'active' : ''
                      } ${Styles.radiusButton}`}
                      role="tab"
                      href="#"
                      onClick={this.connectDevicesAction}
                    >
                      Connect Devices
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        viewSelected === 'syncManager' ? 'active' : ''
                      } ${Styles.radiusButton}`}
                      role="tab"
                      href="#"
                      onClick={this.syncManagerAction}
                    >
                      Sync Status{' '}
                      {syncStatus ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : null}
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${
                        viewSelected === 'CashierInfo' ? 'active' : ''
                      } ${Styles.radiusButton}`}
                      id="v-pills-home-tab"
                      data-toggle="pill"
                      role="tab"
                      href="#"
                      aria-controls="v-pills-home"
                      onClick={e => {
                        e.preventDefault();
                        this.viewSelectedAction('CashierInfo');
                      }}
                    >
                      Account Setting
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <div className={`${Styles.wrapFullHeightList}`}>
                {this.renderShowUp()}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    syncStatus: state.authenRd.syncManager.syncStatus
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Account);
