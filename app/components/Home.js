// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container} data-tid="container">
        <h2>Home</h2>
        <div className="row">
          <div className="col-md-12"></div>
        </div>
        <Link to={routes.COUNTER}>to Counter</Link>
      </div>
    );
  }
}
