import React, { Component } from 'react';
import { connect } from 'react-redux';
import { counterProduct } from '../../../reducers/db/products';
import { startLoop, stopLoop } from '../../../common/settings';
import { gotoPOS } from '../../../actions/homeAction';
import styles from './sync-screen.scss';
import CheckCircle from '../../commons/CheckCircle/CheckCircle';

type Props = {
  gotoPOS: () => void,
  setup: Object
};

class SyncScreen extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.showCounter = this.showCounter.bind(this);
  }

  state = {
    productNumber: 0,
    frameId: null
  };

  componentDidMount(): void {
    const frameId = startLoop(this.showCounter, 1000);
    this.setState({ frameId });
  }

  componentWillUnmount(): void {
    const { frameId } = this.state;
    stopLoop(frameId);
  }

  async showCounter() {
    const counter = await counterProduct();
    this.setState({ productNumber: counter });
  }

  nextToMainPage = () => {
    const { gotoPOS } = this.props;
    gotoPOS();
  };

  render() {
    const loading = true;
    const { productNumber } = this.state;
    const { setup } = this.props;
    const {
      stateFetchingConfig,
      stateSynchronizingCategoriesAndProducts,
      stateSyncProductBarCodeInventory
    } = setup;
    const allowNextButton =
      stateFetchingConfig === 1 &&
      stateSynchronizingCategoriesAndProducts === 1;
    return loading ? (
      <div>
        <div className="container center-loading">
          <div className={styles.wrapSyncInfo}>
            <div className="row">
              {stateFetchingConfig === 0 ? (
                <div
                  className="mr-2 mt-1 spinner-border spinner-border-sm text-secondary"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div className="mr-1">
                  <CheckCircle dimension={20} />
                </div>
              )}
              <span className="text-muted">Fetching configuration</span>
            </div>
            <div className="row">
              {stateSynchronizingCategoriesAndProducts === 0 ? (
                <div
                  className="mr-2 mt-1 spinner-border spinner-border-sm text-secondary"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div>
                  <CheckCircle dimension={20} />
                </div>
              )}
              <span className="text-muted">
                Products are synchronizing: {productNumber}{' '}
              </span>
            </div>
            <div className="row">
              {stateSyncProductBarCodeInventory === 0 ? (
                <div
                  className="mr-2 mt-1 spinner-border spinner-border-sm text-secondary"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <div>
                  <CheckCircle dimension={20} />
                </div>
              )}
              <span className="text-muted">
                Products barcode are synchronizing
              </span>
            </div>
            <div className={`row float-right mt-2 ${styles.wrapButton}`}>
              <button
                type="button"
                disabled={allowNextButton !== true}
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
    gotoPOS: () => dispatch(gotoPOS())
  };
}
function mapStateToProps(state) {
  return {
    setup: state.mainRd.setup
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SyncScreen);
