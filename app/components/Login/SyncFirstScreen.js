import React, { Component } from 'react';
import { connect } from 'react-redux';
import { counterProduct } from '../../reducers/db/products';
import { limitLoop } from '../../common/settings';
import { gotoChildrenPanel } from '../../actions/homeAction';

type Props = {
  gotoChildrenPanel: () => void
};

class SyncFirstScreen extends Component {
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
          <h2>
            <small className="text-muted">
              Products are synchronizing: {productNumber}{' '}
            </small>
          </h2>
          <div className="spinner-border text-secondary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          &nbsp;
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={this.nextToMainPage}
          >
            Skip & Next
          </button>
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
)(SyncFirstScreen);
