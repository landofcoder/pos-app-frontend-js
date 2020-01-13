import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../styles/common.scss';
import styles from './pagelogin.scss';
import {
  getModuleInstalled,
  setMainUrlWorkPlace,
  learnUrlWorkPlace,
  changeToModuleInstalled
} from '../../actions/authenAction.js';
type Props = {
  loading: boolean,
  getModuleInstalled: () => void,
  moduleInstalled: object,
  setMainUrlWorkPlace: (payload: string) => void,
  learnUrlWorkPlace: () => void,
  changeToModuleInstalled: payload => void,
  error: boolean,
  senseUrl: string
};
class ModuleInstalled extends Component {
  props: Props;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { getModuleInstalled } = this.props;
    getModuleInstalled();
  }
  backToWorkPlace = () => {
    const { changeToModuleInstalled } = this.props;
    changeToModuleInstalled(false);
  };
  refreshMoudleInstalledCheck = () => {
    const { getModuleInstalled } = this.props;
    getModuleInstalled();
  };
  checkAcceptConditions = () => {
    let lengthData = 0;
    let lengthDataCheck = 0;
    const { moduleInstalled, error } = this.props;
    Object.keys(moduleInstalled).map(key => {
      lengthData++;
      if (moduleInstalled[key] === true) lengthDataCheck++;
    });

    if (lengthData > 0 && lengthDataCheck === lengthData && !error) {
      console.log(lengthData);
      return true;
    }
    return false;
  };
  showModuleInstalled = (check, moduleName) => {
    return (
      <div key={moduleName} className="form-group">
        <div className="form-check">
          <i
            className={`far fa-check-circle ${
              check ? styles.validColor : styles.invalidColor
            } pr-1`}
          ></i>
          <label className="form-check-label">{moduleName}</label>
        </div>
      </div>
    );
  };
  submitSuiteUrl = () => {
    const { setMainUrlWorkPlace, senseUrl } = this.props;
    setMainUrlWorkPlace(senseUrl);
  };
  render() {
    const { loading, moduleInstalled, error } = this.props;
    if (loading) {
      return (
        <div className="d-flex justify-content-center mt-5 mb-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }
    return (
      <>
        <div className={`${commonStyles.contentColumn} ${styles.wrapPage}`}>
          <div className="col-sm-6 col-md-5 col-lg-4">
            <div className="col-2 pl-0 pr-2">
              <button
                type="button"
                className="btn btn-link"
                onClick={this.backToWorkPlace}
              >
                Back
              </button>
            </div>
            <form>
              {error ? (
                <div className="form-group">
                  <div className="form-check">
                    <label className="form-check-label">
                      Your URL address didn't support POS's services. Please try
                      again
                    </label>
                  </div>
                </div>
              ) : (
                Object.keys(moduleInstalled).map(key => {
                  return this.showModuleInstalled(moduleInstalled[key], key);
                })
              )}
              <div className="form-group">
                <div className="form-check">
                  <div className="row">
                    <div className="col-3 pl-0 pr-2">
                      <button
                        type="button"
                        className="btn btn-secondary btn-block"
                        onClick={() => this.refreshMoudleInstalledCheck()}
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="col-6 pl-0 pr-1">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={!this.checkAcceptConditions()}
                        onClick={() => this.submitSuiteUrl()}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    loading: state.authenRd.loadingModuleComponent,
    moduleInstalled: state.authenRd.moduleInstalled,
    error: state.authenRd.errorServiceModuleInstalled,
    senseUrl: state.authenRd.senseUrl
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getModuleInstalled: () => dispatch(getModuleInstalled()),
    setMainUrlWorkPlace: payload => dispatch(setMainUrlWorkPlace(payload)),
    learnUrlWorkPlace: () => dispatch(learnUrlWorkPlace()),
    changeToModuleInstalled: payload =>
      dispatch(changeToModuleInstalled(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleInstalled);
