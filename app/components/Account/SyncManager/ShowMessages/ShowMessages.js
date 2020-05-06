import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModalStyle from '../../../styles/modal.scss';
import CollapseData from './CollapseData/CollapseData';
import {
  ALL_PRODUCT_SYNC,
  CUSTOM_PRODUCT_SYNC,
  CUSTOMERS_SYNC,
  GENERAL_CONFIG_SYNC
} from '../../../../constants/authen.json';
import { showLogsAction } from '../../../../actions/accountAction';

type Props = {
  isShowLogsMessages: boolean,
  typeShowLogsMessages: string,
  syncManager: object,
  showLogsAction: (payload: Object) => void
};
class ShowMessages extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      collapseData: {}
    };
  }

  close = () => {
    const { showLogsAction } = this.props;
    showLogsAction({ status: false });
  };

  actionCollapseData = index => {
    const { collapseData } = this.state;
    if (collapseData[index]) {
      collapseData[index] = !collapseData[index];
    } else {
      collapseData[index] = true;
    }
    this.setState({ collapseData });
  };

  showTitleLog = () => {
    const { typeShowLogsMessages } = this.props;
    switch (typeShowLogsMessages) {
      case ALL_PRODUCT_SYNC:
        return 'Sync All Products Logs';
      case CUSTOM_PRODUCT_SYNC:
        return 'Sync Custom Products Logs';
      case CUSTOMERS_SYNC:
        return 'Customer Logs';
      case GENERAL_CONFIG_SYNC:
        return 'Sync Config Logs';
      default:
        break;
    }
  };

  showLog = () => {
    const { collapseData } = this.state;
    let data;
    const { typeShowLogsMessages, syncManager } = this.props;
    switch (typeShowLogsMessages) {
      case ALL_PRODUCT_SYNC:
        data = syncManager.syncAllProduct;
        break;
      case CUSTOM_PRODUCT_SYNC:
        data = syncManager.syncCustomProduct;
        break;
      case CUSTOMERS_SYNC:
        data = syncManager.syncCustomer;
        break;
      case GENERAL_CONFIG_SYNC:
        data = syncManager.syncConfig;
        break;
      default:
        break;
    }
    if (!data || !data.actionErrors || data.actionErrors.length === 0)
      return <span>Sync update is compelete!!</span>;
    return (
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Message</th>
          </tr>
        </thead>
        <tbody>
          {data.actionErrors.map((item, index) => {
            return (
              <>
                <tr
                  key={index}
                  onClick={() => {
                    this.actionCollapseData(index);
                  }}
                >
                  <th scope="row">{index + 1}</th>
                  <td>{item.message}</td>
                </tr>

                {collapseData[index] ? (
                  <>
                    <tr style={{ backgroundColor: '#fff' }}>
                      <th scope="row"></th>
                      <td>
                        <CollapseData data={item.data} />
                      </td>
                    </tr>
                  </>
                ) : null}
              </>
            );
          })}
        </tbody>
      </table>
    );
  };

  render() {
    const { isShowLogsMessages } = this.props;
    return (
      <div
        className={ModalStyle.modal}
        style={{
          display: isShowLogsMessages ? 'block' : 'none'
        }}
      >
        <div className={ModalStyle.modalContent}>
          <div className="modal-content" style={{ backgroundColor: '#F7F8FA' }}>
            <div className="modal-header">
              <h5 className="modal-title">{this.showTitleLog()}</h5>
            </div>
            <div className="modal-body">{this.showLog()}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  this.close();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isShowLogsMessages: state.mainRd.isShowLogsMessages,
    typeShowLogsMessages: state.mainRd.typeShowLogsMessages,
    syncManager: state.authenRd.syncManager
  };
}
function mapDispatchToProps(dispatch) {
  return {
    showLogsAction: payload => dispatch(showLogsAction(payload))
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowMessages);
