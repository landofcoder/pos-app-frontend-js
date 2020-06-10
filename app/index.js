import React, { Fragment } from 'react';
import { render } from 'react-dom';
import Modal from 'react-modal';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import db from './reducers/db/db';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

// Open database
db.open();

const store = configureStore();

// Global config
window.liveToken = '';
window.mainUrl = '';
window.platform = '';
window.enableOffline = 1;

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);
