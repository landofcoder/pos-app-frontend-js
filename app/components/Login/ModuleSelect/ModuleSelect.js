import React, { Component } from 'react';
import { connect } from 'react-redux';
import commonStyles from '../../styles/common.scss';
import styles from './moduleselect.scss';
import {
  getModuleInstalled,
  setMainUrlWorkPlace,
  learnUrlWorkPlace
} from '../../../actions/authenAction.js';
type Props = {
  loading: boolean,
  getModuleInstalled: () => void,
  moduleInstalled: object,
  setMainUrlWorkPlace: (payload: string) => void,
  learnUrlWorkPlace: () => void
};
class ModuleSelected extends Component {
  props: Props;
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { getModuleInstalled } = this.props;
    getModuleInstalled();
  }
  backToWorkPlace = () => {
    const { learnUrlWorkPlace, setMainUrlWorkPlace } = this.props;
    learnUrlWorkPlace();
    setMainUrlWorkPlace('');
  };
  refreshMoudleInstalledCheck = () => {
    const { getModuleInstalled } = this.props;
    getModuleInstalled();
  };
  checkAcceptConditions = () => {
    let condition = true;
    const { moduleInstalled } = this.props;
    Object.keys(moduleInstalled).map(key => {
      if (!moduleInstalled[key]) condition = false;
    });
    return condition;
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
  render() {
    const { loading, moduleInstalled } = this.props;
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
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapModulePage}`}
        >
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
              {Object.keys(moduleInstalled).map(key => {
                return this.showModuleInstalled(moduleInstalled[key], key);
              })}
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
                      >
                        Confirm
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
    moduleInstalled: state.authenRd.moduleInstalled
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getModuleInstalled: () => dispatch(getModuleInstalled()),
    setMainUrlWorkPlace: payload => dispatch(setMainUrlWorkPlace(payload)),
    learnUrlWorkPlace: () => dispatch(learnUrlWorkPlace())
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleSelected);
