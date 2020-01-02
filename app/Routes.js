import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import PosContainer from './containers/PosContainer';
import PageLogin from './components/login/PageLogin';
import Account from './containers/AccountContainer';
import Test from './containers/TestContainer';

function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.LOGIN} component={PageLogin} />
        <Route path={routes.ACCOUNT} component={Account} />
        <Route path={routes.POS} component={PosContainer} />
        <Route path={routes.TEST} component={Test} />
      </Switch>
    </App>
  );
}
export default Routes;
