import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import db from './reducers/db/db';
import Sudoer from 'electron-sudo';

// const options = { name: 'electron sudo application' };
// const sudoer = new Sudoer(options);
// sudoer.spawn('echo 12121212121', ['$PARAM'], { env: { PARAM: 'VALUE' } })
//   .then(function(cp) {
//     console.log('hello world:', cp);
//     /*
//     cp.output.stdout (Buffer)
//     cp.output.stderr (Buffer)
//   */
//   });

// console.log('get devices:', getDevices());

// const scanner = new UsbScanner({
//   vendorId: 7851,
//   productId: 3075
//   /** You could also initialize the scanner by giving entering the path variable:
//    *  path: 'IOService:/AppleACPI etc...'
//    * */
// });
//
// scanner.on('data', data => {
//   console.log(data);
// });

// scanner.startScanning();

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
