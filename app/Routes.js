import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/PosContainer';
import PageLogin from './components/login/PageLogin';
import Account from './containers/AccountContainer';

function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.HOME} component={HomePage} />
        <Route path={routes.ACCOUNT} component={Account} />
        <Route path={routes.LOGIN} component={PageLogin} />
      </Switch>
    </App>
  );
}
export default Routes;
