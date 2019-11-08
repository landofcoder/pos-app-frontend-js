// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//  import { HOME_DEFAULT_PRODUCT_LIST } from '../../../constants/main-panel-types';
import * as CheckoutActions from '../../../actions/checkoutActions';
import {} from '../../../actions/homeAction';
import commonStyle from '../../common.scss';
import styles from './cash.scss';

// type Props = {
//   cashLoadingPreparingOrder: boolean,
//   orderPreparingCheckout: Object,
//   updateMainPanelTypeAction: (payload: string) => void,
//   cashPlaceOrderAction: () => void
// };

class CashPayment extends Component<Props> {
  props: Props;

  render() {
    // const {
    //   cashLoadingPreparingOrder,
    //   orderPreparingCheckout,
    //   updateMainPanelTypeAction,
    //   cashPlaceOrderAction
    // } = this.props;
    return (
      <div className={`mr-3 ml-3 pl-4 ${commonStyle.wrapStaticPageContent}`}>
        <div className={commonStyle.wrapCenterContent}>
          <div className={styles.contentColumn}>
            <i
              className={`fa fa-money-bill-wave fa-3x ${commonStyle.headerIcon}`}
            />
            <span className={`${commonStyle.colorText}`}>Total</span>
            <span className={`${commonStyle.sizeFont}`}>$233.53</span>
            <div className={`col-md-12 ${styles.wrapTable} row`}>
              <span className={`${commonStyle.colorText} ${styles.forLeft}`}>
                Amount
              </span>
              <span className={`${commonStyle.sizeFont} ${styles.forRight}`}>
                $233.53
              </span>
            </div>
          </div>
          <button
            type="button"
            className={`btn btn-lg btn-secondary ${commonStyle.buttonBody}`}
          >
            $233.53
          </button>
          <button
            type="button"
            className={`btn btn-lg btn-secondary ${commonStyle.buttonBody}`}
          >
            $250.00
          </button>
          <button
            type="button"
            className={`btn btn-lg btn-secondary ${commonStyle.buttonBody}`}
          >
            $260.00
          </button>
          <button
            type="button"
            className={`btn btn-lg btn-secondary ${commonStyle.buttonBody}`}
          >
            $300.00
          </button>
        </div>
        <div className={commonStyle.footerButton}>
          <div className="col-md-2 pr-0">
            <button
              type="button"
              className="btn btn-lg btn-secondary btn-block"
            >
              Back
            </button>
          </div>

          <div className="col-md-3 pr-0">
            <button type="button" className="btn btn-lg btn-primary btn-block">
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cashLoadingPreparingOrder: state.mainRd.cashLoadingPreparingOrder,
    orderPreparingCheckout: state.mainRd.orderPreparingCheckout
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CheckoutActions }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashPayment);
