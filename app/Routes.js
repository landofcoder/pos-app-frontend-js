import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomeContainer';
import PageLogin from './components/login/PageLogin';

function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.LOGIN} component={PageLogin} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
export default Routes;
