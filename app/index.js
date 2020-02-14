import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import db from './reducers/db/db';
// eslint-disable-next-line import/order
import { UsbScanner, getDevices } from 'usb-barcode-scanner';

console.log('get devices:', getDevices());

const scanner = new UsbScanner({
  vendorId: 7851,
  productId: 3075
  /** You could also initialize the scanner by giving entering the path variable:
   *  path: 'IOService:/AppleACPI etc...'
   * */
});

scanner.on('data', data => {
  console.log(data);
});

scanner.startScanning();

// const devices = HID.devices();
// console.log('devices:', devices);
// const device = new HID.HID(
//   'IOService:/AppleACPIPlatformExpert/PCI0@0/AppleACPIPCI/XHC1@14/XHC1@14000000/HS08@14500000/BARCODE SCANNER HID KBW@14500000/IOUSBHostInterface@0/IOUSBHostHIDDevice@14500000,0'
// );
// device.on('data', data => {
//   console.log('data:', data);
// });

// // Enable scan events for the entire document
// onScan.attachTo(document);
// // Register event listener
// document.addEventListener('scan', (scanCode, iQty) => {
//   console.log(`${iQty}x ${scanCode}`);
// });

// Open database
db.open();

const store = configureStore();

// Global config
window.config = {};
window.liveToken = '';
window.mainUrl = '';

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);
