import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomeContainer';
import CheckoutPage from './containers/CheckoutPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.CHECKOUT} component={CheckoutPage} />
      <Route path={routes.HOME} component={HomePage} />
    </Switch>
  </App>
);
