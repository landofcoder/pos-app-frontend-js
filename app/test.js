import { UsbScanner, getDevices } from 'usb-barcode-scanner';

const scanner = new UsbScanner({
  vendorId: 7851,
  productId: 3075
  /** You could also initialize the scanner by giving entering the path variable:
   *  path: 'IOService:/AppleACPI etc...'
   * */
});
