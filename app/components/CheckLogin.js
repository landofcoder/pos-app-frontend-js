// @flow
import React, { Component } from 'react';
import { POS_LOGIN_STORAGE } from '../constants/authen';
import { LOGIN } from '../constants/routes';
import { Redirect } from 'react-router-dom';

class CheckLogin extends Component<Props> {
  props: Props;

  render() {
    if (localStorage.getItem(POS_LOGIN_STORAGE)) {
      const loginInfo = localStorage.getItem(POS_LOGIN_STORAGE);
      console.log('login info:', JSON.parse(loginInfo));
    } else {
      // Redirect to login
      return <Redirect to={LOGIN}/>;
    }

    return (
      <div>
        <div className="d-flex justify-content-center mt-3">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckLogin;
