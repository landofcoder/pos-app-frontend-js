// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './styles/common.scss';
import ListCart from './cart/ListCart';

type Props = {};

export default class Checkout extends Component<Props> {
  props: Props;

  render() {
    return (
      <>
        <div className={styles.backButton} data-tid="backButton">
          <Link to={routes.POS}>
            <i className="fa fa-arrow-left fa-3x" />
          </Link>
        </div>
        <div className="mt-5 row">
          <div className="col-md-8"></div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <ListCart />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
