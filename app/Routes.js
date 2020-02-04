import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import PosContainer from './containers/PosContainer';
import Account from './containers/AccountContainer';

function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.ACCOUNT} component={Account} />
        <Route path={routes.POS} component={PosContainer} />
      </Switch>
    </App>
  );
}
export default Routes;
