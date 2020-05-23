import React, { Component } from 'react';
import _ from 'lodash';
import { format, differenceInMinutes } from 'date-fns';
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
    const ruleIndex = event.target.value;
    this.setState({ activeRuleIndex: ruleIndex });
  };

  conditionRuleItems = rewardPointInfo => {
    const listRuleItems = rewardPointInfo
      ? rewardPointInfo.list_rules.items
      : [];

    let newListRuleItems;
    if (listRuleItems.length > 0) {
      newListRuleItems = _.filter(listRuleItems, item => {
        if (item.is_active === 1) {
          if (item.activeTo !== '') {
            const activeTo = format(
              new Date(item.active_to),
              'yyyy-MM-dd hh:m:s'
            );
            const diffMinuteLessThanFuture = differenceInMinutes(
              new Date(),
              new Date(activeTo)
            );
            if (diffMinuteLessThanFuture < 0) {
              return true;
            }
          }
        }
        return false;
      });
      return newListRuleItems;
    }

    return listRuleItems;
  };

  getSpendMinApplyPoints = (ruleActive, pointsBalance) => {
    return 100;
  };

  getSpendMaxApplyPoints = (ruleActive, pointsBalance) => {
    const spendMaxPoints = ruleActive ? ruleActive.spend_max_points : 0;
    // Max points by spendMaxPoints
    if (pointsBalance >= spendMaxPoints) {
      return spendMaxPoints;
    }
    if (pointsBalance < spendMaxPoints) {
      // Should cal by points step?
      return pointsBalance;
    }
    return 0;
  };

  enableApply = () => {
    return true;
  };

  render() {
    const {
      isShowRewardPoint,
      isLoadingRewardPointInfo,
      rewardPointInfo
    } = this.props;
    const listRuleItems = this.conditionRuleItems(rewardPointInfo);
    const { activeRuleIndex } = this.state;
    const ruleActive = listRuleItems[activeRuleIndex];
    const pointStep = ruleActive ? ruleActive.spend_points : 0;
    const customerBalancePoints = rewardPointInfo
      ? rewardPointInfo.total_points
      : 0;

    const { createSliderWithTooltip } = Slider;
    const Range = createSliderWithTooltip(Slider.Range);

    const maxSpendPointsApplyRules = this.getSpendMaxApplyPoints(
      ruleActive,
      customerBalancePoints
    );

    console.log('max spend points:', maxSpendPointsApplyRules);
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
                      <span className="font-weight-bolder">
                        {customerBalancePoints}
                      </span>{' '}
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
                        return (
                          <option key={i} value={i}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <></>
                  )}
                  <div className="mt-3">
                    <Range
                      step={pointStep}
                      max={maxSpendPointsApplyRules}
                      min={0}
                    />
                  </div>
                </div>
                <div className="mt-3 text-right">
                  <button
                    disabled={this.enableApply}
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
