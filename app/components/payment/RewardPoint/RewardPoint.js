import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import { fetchRewardPointCondition } from '../../../actions/homeAction';

class RewardPoint extends Component<Props> {
  componentDidMount() {
    const { fetchRewardPointCondition } = this.props;
    fetchRewardPointCondition();
  }

  render() {
    const { isShowRewardPoint, isLoadingRewardPointInfo } = this.props;
    return (
      <>
        {isShowRewardPoint ? (
          <div className="col-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Reward point</h5>
                {isLoadingRewardPointInfo ? (
                  <div className="d-flex justify-content-center mb-2">
                    <div
                      className="spinner-border spinner-border-sm text-secondary"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="form-group">
                  <select className="custom-select custom-select-sm">
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <div className="mt-3">
                    <Slider />
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <button
                    disabled
                    type="button"
                    className="btn btn-outline-dark btn-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isShowRewardPoint: state.mainRd.checkout.rewardPoint.isShowRewardPoint,
    isLoadingRewardPointInfo:
      state.mainRd.checkout.rewardPoint.isLoadingRewardPointInfo
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRewardPointCondition: () => dispatch(fetchRewardPointCondition())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RewardPoint);
