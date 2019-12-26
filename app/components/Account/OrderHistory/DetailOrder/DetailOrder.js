import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalStyle from '../../../styles/modal.scss';
import Styles from './detail-order.scss';
import { getOrderHistoryDetail } from '../../../../actions/accountAction';
type Props = {
  orderHistoryDetail: {},
  order_id_history: number,
  isOpenDetailOrder: boolean,
  isLoadingOrderHistoryDetail: boolean,
  getOrderHistoryDetail: id => void
};
class DetailOrder extends Component {
  props: Props;
  componentDidMount() {
    const { getOrderHistoryDetail, order_id_history } = this.props;
    getOrderHistoryDetail(order_id_history);
  }
  render() {
    const { isOpenDetailOrder, isLoadingOrderHistoryDetail } = this.props;
    return (
      <>
        <div className={Styles.wrapDetailOrder}>
          <div
            className={ModalStyle.modal}
            style={{ display: isOpenDetailOrder ? 'block' : 'none' }}
          >
            <div className={ModalStyle.modalContent}>
              <div className="modal-content">
                {isLoadingOrderHistoryDetail ? (
                  <div className="d-flex justify-content-center mt-5 mb-5">
                    <div
                      className="spinner-border text-secondary"
                      role="status"
                    >
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="modal-header">
                      <h5 className="modal-title"></h5>
                      <div className="col-md-3 p-0"></div>
                    </div>
                    <div className="modal-body">
                      <div>
                        <div className="form-group"></div>
                        <div className="input-group mb-3"></div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <div className="col-md-2 p-0"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    orderHistoryDetail: state.mainRd.orderHistoryDetail,
    order_id_history: state.mainRd.order_id_history,
    isOpenDetailOrder: state.mainRd.isOpenDetailOrder,
    isLoadingOrderHistoryDetail: state.mainRd.isLoadingOrderHistoryDetail
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getOrderHistoryDetail: id => dispatch(getOrderHistoryDetail(id))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailOrder);
