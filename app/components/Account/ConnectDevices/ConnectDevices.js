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
          <div className="col-md-2"></div>
          <div className="col-md-6">
            <div className="card">
              <h5 className="card-header">Barcode scanner</h5>
              <div className="card-body">
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
                        className="btn btn-secondary btn-sm"
                      >
                        Change
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="list-group">
                      <div className="form-group row">
                        <div className="col-12">
                          <select
                            onChange={this.handleChangeDevice}
                            value={deviceSelected}
                            className="form-control custom-select-sm"
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
                      </div>
                      {errorConnect ? (
                        <>
                          <div className="form-group">
                            <p className="text-danger">
                              Error connect to device, please try the following:
                            </p>
                            <ul>
                              <li>Run app with root permission</li>
                              <li>Remove and re-plug the device</li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        <span></span>
                      )}
                      <div className="text-right">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
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
