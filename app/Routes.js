import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getDefaultColor } from './actions/accountAction';
import routes from './constants/routes';
import App from './containers/App';
import PosContainer from './containers/PosContainer';
import Account from './containers/AccountContainer';
type Props = {
  defaultColor: object
};
class Routes extends Component {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { defaultColor } = this.props;
    console.log(defaultColor);
    return (
      <div
        data-theme={
          defaultColor.general_configuration !== undefined
            ? defaultColor.general_configuration.web_pos_color
            : 'default'
        }
      >
        <App>
          <Switch>
            <Route path={routes.ACCOUNT} component={Account} />
            <Route path={routes.POS} component={PosContainer} />
          </Switch>
        </App>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    defaultColor: state.mainRd.posSystemConfig
  };
}
export default connect(
  mapStateToProps,
  null
)(Routes);
