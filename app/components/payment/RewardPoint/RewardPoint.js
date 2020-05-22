import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'rc-slider';
import { fetchRewardPointCondition } from '../../../actions/homeAction';

class RewardPoint extends Component<Props> {
  state = {
    activeRuleIndex: 0
  };

  componentDidMount() {
    const { fetchRewardPointCondition } = this.props;
    fetchRewardPointCondition();
  }

  onChangeActiveRuleIndex = event => {
    console.log('event:', event);
  };

  render() {
    const {
      isShowRewardPoint,
      isLoadingRewardPointInfo,
      rewardPointInfo
    } = this.props;
    const listRuleItems = rewardPointInfo
      ? rewardPointInfo.list_rules.items
      : [];
    const { activeRuleIndex } = this.state;
    const ruleActive = listRuleItems[activeRuleIndex];
    console.log('rule active:', ruleActive);
    const totalPoints = rewardPointInfo ? rewardPointInfo.total_points : 0;
    return (
      <>
        {isShowRewardPoint ? (
          <div className="col-5">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Reward points</h5>
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
                  <div className="mb-2">
                    <small className="text-dark font-weight-normal">
                      <span className="font-weight-bolder">{totalPoints}</span>{' '}
                      points available. Choose how many points to spend
                    </small>
                  </div>
                  {listRuleItems.length > 0 ? (
                    <select
                      value={activeRuleIndex}
                      onChange={this.onChangeActiveRuleIndex}
                      className="custom-select custom-select-sm"
                    >
                      {listRuleItems.map((item, i) => {
                        return <option key={i}>{item.name}</option>;
                      })}
                    </select>
                  ) : (
                    <></>
                  )}
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
      state.mainRd.checkout.rewardPoint.isLoadingRewardPointInfo,
    rewardPointInfo: state.mainRd.checkout.rewardPoint.info
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
