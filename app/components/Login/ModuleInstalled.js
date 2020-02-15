import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../styles/common.scss';
import styles from './pagelogin.scss';
import {
  getModuleInstalled,
  setMainUrlWorkPlace,
  changeToModuleInstalled
} from '../../actions/authenAction';

type Props = {
  loading: boolean,
  getModuleInstalled: () => void,
  moduleInstalled: object,
  setMainUrlWorkPlace: (payload: string) => void,
  changeToModuleInstalled: (payload: boolean) => void,
  error: boolean,
  senseUrl: string
};
class ModuleInstalled extends Component {
  props: Props;

  componentDidMount() {
    const { getModuleInstalled } = this.props;
    getModuleInstalled();
  }

  backToWorkPlace = () => {
    const { changeToModuleInstalled } = this.props;
    changeToModuleInstalled(false);
  };

  refreshModuleInstalledCheck = () => {
    const { getModuleInstalled } = this.props;
    getModuleInstalled();
  };

  checkAcceptConditions = () => {
    let lengthData = 0;
    let lengthDataCheck = 0;
    const { moduleInstalled, error } = this.props;
    Object.keys(moduleInstalled).map(key => {
      lengthData += 1;
      if (moduleInstalled[key] === true) lengthDataCheck += 1;
    });

    if (lengthData > 0 && lengthDataCheck === lengthData && !error) {
      console.log(lengthData);
      return true;
    }
    return false;
  };

  showModuleInstalled = (check, moduleName) => {
    return (
      <div key={moduleName}>
        <i
          className={`far ${check ? 'fa-check-circle' : 'fa-times-circle'} ${
            check ? styles.validColor : styles.invalidColor
          } pr-1`}
        ></i>
        <label className="form-check-label">{moduleName}</label>
      </div>
    );
  };

  submitSuiteUrl = () => {
    const { setMainUrlWorkPlace, senseUrl } = this.props;
    setMainUrlWorkPlace(senseUrl);
  };

  render() {
    const { loading, moduleInstalled, error } = this.props;
    console.log('module installed:', moduleInstalled);
    return (
      <>
        <div className={`${commonStyles.contentColumn} ${styles.wrapPage} pl-0 pr-0`}>
          <div className="col-sm-6 col-md-5 col-lg-4">
            <div className="form-group">
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
                      Your URL address didn&apos;t support POS&apos;s services.
                      Please try again
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        All modules require:
                      </h5>
                      {Object.keys(moduleInstalled).map(key => {
                        return this.showModuleInstalled(
                          moduleInstalled[key],
                          key
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="form-group mt-3">
                <div className="form-check">
                  <div className="row">
                    <div className="col-4 pl-0 pr-2">
                      <button
                        type="button"
                        className="btn btn-secondary btn-block"
                        onClick={() => this.refreshModuleInstalledCheck()}
                      >
                        {loading ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          'Re-check'
                        )}
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
    changeToModuleInstalled: payload =>
      dispatch(changeToModuleInstalled(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleInstalled);
