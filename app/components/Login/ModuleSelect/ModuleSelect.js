import React, { Component } from 'react';
import commonStyles from '../../styles/common.scss';
import styles from './moduleselect.scss';
class ModuleSelected extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <>
        <div
          className={`${commonStyles.contentColumn} ${styles.wrapModulePage}`}
        >
          <div className="col-sm-12 col-md-4 col-lg-4 text-center">
            <span>Hello world</span>
          </div>
        </div>
      </>
    );
  }
}
export default ModuleSelected;
