// @flow
import React, { Component } from 'react';
import styles from './cash.scss';

export default class CashPayment extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={`${styles.wrapCashPayment}`}>
        <div className={styles.center}>
          <i className={`fa fa-money-bill-wave fa-3x ${styles.dollar}`} />
          <br />
          <span className={`${styles.colorText}`}>Total</span>
          <br />
          <span className={`${styles.size}`}>$233.53</span>
          <br />
          <div className={`${styles.tableMount} row`}>
            <span className={`${styles.colorText} ${styles.paddingLeft}`}>
              Amount
            </span>
            <span className={`${styles.size} ${styles.paddingRight}`}>
              $233.53
            </span>
          </div>
          <button type="button" className="btn btn-lg btn-secondary">
            $233.53
          </button>
          <button type="button" className="btn btn-lg btn-secondary">
            $250.00
          </button>
          <button type="button" className="btn btn-lg btn-secondary">
            $260.00
          </button>
          <button type="button" className="btn btn-lg btn-secondary">
            $300.00
          </button>
        </div>
        <div className={styles.footerButton}>
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
