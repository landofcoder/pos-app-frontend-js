import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getShowAllDevices,
  connectToDevice
} from '../../../actions/homeAction';

class ConnectDevices extends Component<Props> {
  props: Props;

  state = {
    deviceSelected: {}
  };

  componentDidMount(): void {
    const { getShowAllDevices } = this.props;
    getShowAllDevices();
  }

  connectDevice = () => {
    const { connectToDevice } = this.props;
    const { deviceSelected } = this.state;
    connectToDevice(deviceSelected);
  };

  handleChangeDevice = e => {
    const device = JSON.parse(e.target.value);
    this.setState({ deviceSelected: device });
  };

  render() {
    const {
      allDevices,
      errorConnect,
      connectedDeviceStatus,
      connectedDeviceItem
    } = this.props;
    console.log('connected device:', connectedDeviceItem);
    return (
      <div>
        <div className="row">
          <div className="col-md-3"></div>
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
                      <button type="button" className="btn btn-secondary">
                        Change
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="list-group">
                      <div className="form-group">
                        <select onChange={this.handleChangeDevice}>
                          {allDevices.map((device, index) => {
                            return (
                              <option
                                key={index}
                                value={JSON.stringify(device)}
                              >
                                {device.product}
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
    connectToDevice: payload => dispatch(connectToDevice(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectDevices);
