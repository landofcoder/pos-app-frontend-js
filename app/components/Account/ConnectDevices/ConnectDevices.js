import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getShowAllDevices,
  connectToScannerDevice,
  changeScannerDevice
} from '../../../actions/homeAction';

class ConnectDevices extends Component<Props> {
  props: Props;

  state = {
    deviceSelected: 0 // index of array
  };

  componentDidMount(): void {
    const { getShowAllDevices } = this.props;
    getShowAllDevices();
  }

  connectDevice = () => {
    const { connectToScannerDevice } = this.props;
    const { deviceSelected } = this.state;
    connectToScannerDevice(deviceSelected);
  };

  handleChangeDevice = e => {
    const device = e.target.value;
    this.setState({ deviceSelected: device });
  };

  render() {
    const {
      allDevices,
      errorConnect,
      connectedDeviceStatus,
      connectedDeviceItem,
      changeScannerDevice
    } = this.props;
    const { deviceSelected } = this.state;

    let connectDisabled = false;

    if (Number(deviceSelected) === 0) {
      connectDisabled = true;
    }
    return (
      <div>
        <div className="row">
          <div className="col-md-3" />
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Barcode scanner</h5>
                {connectedDeviceStatus ? (
                  <>
                    <hr />
                    <span>Connected:</span>&nbsp;
                    <span className="font-weight-bold">
                      {connectedDeviceItem.product}
                    </span>
                    <div className="mt-3 pull-right text-right">
                      <button
                        onClick={changeScannerDevice}
                        type="button"
                        className="btn btn-secondary"
                      >
                        Change
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="list-group">
                      <div className="form-group">
                        <select
                          onChange={this.handleChangeDevice}
                          value={deviceSelected}
                        >
                          {allDevices.map((device, index) => {
                            return (
                              <option key={index} value={index}>
                                {device.product === ''
                                  ? 'Unknown device'
                                  : device.product}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="form-group">
                        {errorConnect ? (
                          <p className="text-danger">
                            Error connect to device, please run this application
                            with root permission
                          </p>
                        ) : (
                          <p></p>
                        )}
                      </div>
                      <div className="mt-4 text-right">
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={connectDisabled}
                          onClick={this.connectDevice}
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    allDevices: state.mainRd.hidDevice.allDevices,
    errorConnect: state.mainRd.hidDevice.errorConnect,
    connectedDeviceStatus: state.mainRd.hidDevice.connectedDeviceStatus,
    connectedDeviceItem: state.mainRd.hidDevice.connectedDeviceItem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getShowAllDevices: () => dispatch(getShowAllDevices()),
    connectToScannerDevice: payload =>
      dispatch(connectToScannerDevice(payload)),
    changeScannerDevice: payload => dispatch(changeScannerDevice(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDevices);
