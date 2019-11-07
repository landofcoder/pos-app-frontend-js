// @flow
import React, { Component } from 'react';
import commonStyle from '../../common.scss';
import styles from './cash.scss';

export default class CashPayment extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={`${commonStyle.wrapCashPayment}`}>
        <div className={commonStyle.wrapCenterCash}>
          <i
            className={`fa fa-money-bill-wave fa-3x ${commonStyle.headerIcon}`}
          />
          <br />
          <span className={`${commonStyle.colorText}`}>Total</span>
          <br />
          <span className={`${commonStyle.sizeFont}`}>$233.53</span>
          <br />
          <div className={`${styles.wrapTable} row`}>
            <span className={`${commonStyle.colorText} ${styles.forLeft}`}>
              Amount
            </span>
            <span className={`${commonStyle.sizeFont} ${styles.forRight}`}>
              $233.53
            </span>
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
