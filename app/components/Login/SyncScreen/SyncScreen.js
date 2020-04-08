import React, { Component } from 'react';
import { connect } from 'react-redux';
import { counterProduct } from '../../../reducers/db/products';
import { limitLoop } from '../../../common/settings';
import { gotoChildrenPanel } from '../../../actions/homeAction';
import styles from './sync-screen.scss';

type Props = {
  gotoChildrenPanel: () => void
};

class SyncScreen extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.showCounter = this.showCounter.bind(this);
  }

  state = {
    productNumber: 0
  };

  componentDidMount(): void {
    limitLoop(this.showCounter, 30, 1000);
  }

  async showCounter() {
    const counter = await counterProduct();
    this.setState({ productNumber: counter });
  }

  nextToMainPage = () => {
    const { gotoChildrenPanel } = this.props;
    gotoChildrenPanel();
  };

  render() {
    const loading = true;
    const { productNumber } = this.state;
    return loading ? (
      <div>
        <div className="container center-loading">
          <div className={styles.wrapSyncInfo}>
            <div className="row">
              <span className="text-muted">
                Products are synchronizing: {productNumber}{' '}
              </span>
              <div
                className="ml-2 mt-1 spinner-border spinner-border-sm text-secondary"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            <div className="row">
              <small className="form-text text-muted">
                You can go head, this task will run as background
              </small>
            </div>
            <div className={`row float-right mt-2 ${styles.wrapButton}`}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.nextToMainPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <>{loading}</>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    gotoChildrenPanel: () => dispatch(gotoChildrenPanel())
  };
}

export default connect(
  null,
  mapDispatchToProps
)(SyncScreen);
