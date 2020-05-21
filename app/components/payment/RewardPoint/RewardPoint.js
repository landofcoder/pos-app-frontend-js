import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import { fetchRewardPoint } from '../../../actions/homeAction';

class RewardPoint extends Component<Props> {
  componentDidMount() {
    const { fetchRewardPoint } = this.props;
    fetchRewardPoint();
  }

  render() {
    return (
      <div className="col-5">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Reward point</h5>
            <Slider />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRewardPoint: () => dispatch(fetchRewardPoint())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RewardPoint);
