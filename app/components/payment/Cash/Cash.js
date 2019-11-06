// @flow
import React, { Component } from 'react';
import styles from './cash.scss';

export default class CashPayment extends Component<Props> {
  props: Props;

  render() {
    return <div className={styles.wrapCashPayment}>CASH COMPONENT</div>;
  }
}
