import LocaleCurrency from 'locale-currency';

/**
 * Get offline mode
 * @returns number
 */
export function getOfflineMode() {
  const posSystemConfigResult = window.config;
  return Number(
    posSystemConfigResult.general_configuration.enable_offline_mode
  );
}

export function checkValidateUrlLink(
  defaultProtocol,
  mainUrl,
  lastUrlRequired
) {
  const url = defaultProtocol + mainUrl + lastUrlRequired;
  if (mainUrl.length < 3) return false;
  if (url.indexOf('.') === -1) return false;
  if (url.lastIndexOf('http')) return false;
  if (url.indexOf(' ') !== -1) return false;
  if (url[url.length - 2] === '.') return false;
  try {
    new URL(url);
  } catch (_) {
    return false;
  }
  return true;
}

export function getGraphqlPath() {
  return `${window.mainUrl}graphql`;
}

/**
 * Limit loop using requestAnimationFrame if timeOut have param, interval will by timeOut config
 * @param fn
 * @param fps : number = 30 fps
 * @param timeOut
 */
export function limitLoop(fn, fps = 30, timeOut = null) {
  // Use var then = Date.now(); if you
  // don't care about targeting < IE9
  let then = new Date().getTime();
  const interval = timeOut || 1000 / fps;

  return (function loop() {
    window.requestAnimationFrame(loop);
    // again, Date.now() if it's available
    const now = new Date().getTime();
    const delta = now - then;
    if (delta > interval) {
      // Update time
      // now - (delta % interval) is an improvement over just
      // using then = now, which can end up lowering overall fps
      then = now - (delta % interval);
      // call the fn
      fn();
    }
  })(0);
}

export function formatCurrencyCode(value: number) {
  const locale = LocaleCurrency.getLocales(window.currency)[0];
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: window.currency
  });
  return formatter.format(value);
}

export const onScan = {
  attachTo(oDomElement, oOptions) {
    if (oDomElement.scannerDetectionData != undefined) {
      throw new Error(
        `onScan.js is already initialized for DOM element ${oDomElement}`
      );
    }

    const oDefaults = {
      onScan(sScanned, iQty) {}, // Callback after detection of a successfull scanning:  function(){sScancode, iCount)}()
      onScanError(oDebug) {}, // Callback after detection of a unsuccessfull scanning (scanned string in parameter)
      onKeyProcess(sChar, oEvent) {}, // Callback after receiving and processing a char (scanned char in parameter)
      onKeyDetect(iKeyCode, oEvent) {}, // Callback after detecting a keyDown (key char in parameter) - in contrast to onKeyProcess, this fires for non-character keys like tab, arrows, etc. too!
      onPaste(sPasted, oEvent) {}, // Callback after receiving a value on paste, no matter if it is a valid code or not
      keyCodeMapper(oEvent) {
        return String.fromCharCode(oEvent.which);
      }, // Custom function to decode a keydown event into a character. Must return decoded character or NULL if the given event should not be processed.
      onScanButtonLongPress() {}, // Callback after detection of a successfull scan while the scan button was pressed and held down
      scanButtonKeyCode: false, // Key code of the scanner hardware button (if the scanner button a acts as a key itself)
      scanButtonLongPressTime: 500, // How long (ms) the hardware button should be pressed, until a callback gets executed
      timeBeforeScanTest: 100, // Wait duration (ms) after keypress event to check if scanning is finished
      avgTimeByChar: 30, // Average time (ms) between 2 chars. Used to do difference between keyboard typing and scanning
      minLength: 6, // Minimum length for a scanning
      suffixKeyCodes: [9, 13], // Chars to remove and means end of scanning
      prefixKeyCodes: [], // Chars to remove and means start of scanning
      ignoreIfFocusOn: false, // do not handle scans if the currently focused element matches this selector or object
      stopPropagation: false, // Stop immediate propagation on keypress event
      preventDefault: false, // Prevent default action on keypress event
      reactToKeydown: true, // look for scan input in keyboard events
      reactToPaste: false, // look for scan input in paste events
      singleScanQty: 1 // Quantity of Items put out to onScan in a single scan
    };

    oOptions = this._mergeOptions(oDefaults, oOptions);

    // initializing options and variables on DomElement
    oDomElement.scannerDetectionData = {
      options: oOptions,
      vars: {
        firstCharTime: 0,
        lastCharTime: 0,
        stringWriting: '',
        callIsScanner: false,
        testTimer: false,
        longPressTimeStart: 0,
        longPressed: false
      }
    };

    // initializing handlers (based on settings)
    if (oOptions.reactToPaste === true) {
      oDomElement.addEventListener('paste', this._handlePaste);
    }
    if (oOptions.scanButtonKeyCode !== false) {
      oDomElement.addEventListener('keyup', this._handleKeyUp);
    }
    if (
      oOptions.reactToKeydown === true ||
      oOptions.scanButtonKeyCode !== false
    ) {
      oDomElement.addEventListener('keydown', this._handleKeyDown);
    }
  },

  detachFrom(oDomElement) {
    // detaching all used events
    if (oDomElement.scannerDetectionData.options.reactToPaste) {
      oDomElement.removeEventListener('paste', this._handlePaste);
    }
    if (oDomElement.scannerDetectionData.options.scanButtonKeyCode !== false) {
      oDomElement.removeEventListener('keyup', this._handleKeyUp);
    }
    oDomElement.removeEventListener('keydown', this._handleKeyDown);

    // clearing data off DomElement
    oDomElement.scannerDetectionData = undefined;
  },

  getOptions(oDomElement) {
    return oDomElement.scannerDetectionData.options;
  },

  setOptions(oDomElement, oOptions) {
    // check if some handlers need to be changed based on possible option changes
    switch (oDomElement.scannerDetectionData.options.reactToPaste) {
      case true:
        if (oOptions.reactToPaste === false) {
          oDomElement.removeEventListener('paste', this._handlePaste);
        }
        break;
      case false:
        if (oOptions.reactToPaste === true) {
          oDomElement.addEventListener('paste', this._handlePaste);
        }
        break;
    }

    switch (oDomElement.scannerDetectionData.options.scanButtonKeyCode) {
      case false:
        if (oOptions.scanButtonKeyCode !== false) {
          oDomElement.addEventListener('keyup', this._handleKeyUp);
        }
        break;
      default:
        if (oOptions.scanButtonKeyCode === false) {
          oDomElement.removeEventListener('keyup', this._handleKeyUp);
        }
        break;
    }

    // merge old and new options
    oDomElement.scannerDetectionData.options = this._mergeOptions(
      oDomElement.scannerDetectionData.options,
      oOptions
    );

    // reinitiallize
    this._reinitialize(oDomElement);
  },

  simulate(oDomElement, sTestString) {
    const oVars = oDomElement.scannerDetectionData.vars;
    oVars.firstCharTime = 0;
    oVars.lastCharTime = 0;
    oVars.stringWriting = sTestString;
    this._validateScanCode(oDomElement);
    return this;
  },

  _reinitialize(oDomElement) {
    const oVars = oDomElement.scannerDetectionData.vars;
    oVars.firstCharTime = 0;
    oVars.stringWriting = '';
  },

  _isFocusOnIgnoredElement(oDomElement) {
    ignoreSelectors = oDomElement.scannerDetectionData.options.ignoreIfFocusOn;

    if (!ignoreSelectors) {
      return false;
    }

    const oFocused = document.activeElement;

    // checks if ignored element is an array, and if so it checks if one of the elements of it is an active one
    if (Array.isArray(ignoreSelectors)) {
      for (let i = 0; i < ignoreSelectors.length; i++) {
        if (oFocused.matches(ignoreSelectors[i]) === true) {
          return true;
        }
      }
      // if the option consists of an single element, it only checks this one
    } else if (oFocused.matches(ignoreSelectors)) {
      return true;
    }

    // if the active element is not listed in the ignoreIfFocusOn option, return false
    return false;
  },

  _validateScanCode(oDomElement) {
    const oScannerData = oDomElement.scannerDetectionData;
    const oOptions = oScannerData.options;
    const iSingleScanQty = oScannerData.options.singleScanQty;
    const sScanCode = oScannerData.vars.stringWriting;
    const iFirstCharTime = oScannerData.vars.firstCharTime;
    const iLastCharTime = oScannerData.vars.lastCharTime;

    switch (true) {
      // detect codes that are too short
      case sScanCode.length < oOptions.minLength:
        var oScanError = {
          message: 'Receieved code is shorter then minimal length'
        };
        break;

      // detect codes that were entered too slow
      case iLastCharTime - iFirstCharTime >
        sScanCode.length * oOptions.avgTimeByChar:
        var oScanError = {
          message: 'Receieved code was not entered in time'
        };
        break;

      // if a code was not filtered out earlier it is valid
      default:
        oOptions.onScan.call(oDomElement, sScanCode, iSingleScanQty);
        var oEvent = new CustomEvent('scan', {
          detail: {
            scanCode: sScanCode,
            qty: iSingleScanQty
          }
        });
        oDomElement.dispatchEvent(oEvent);
        onScan._reinitialize(oDomElement);
        return true;
    }

    // If an error occurred (otherwise the method would return earlier) create an object for errordetection
    oScanError.scanCode = sScanCode;
    oScanError.scanDuration = iLastCharTime - iFirstCharTime;
    oScanError.avgTimeByChar = oOptions.avgTimeByChar;
    oScanError.minLength = oOptions.minLength;

    oOptions.onScanError.call(oDomElement, oScanError);

    var oEvent = new CustomEvent('scanError', oScanError);
    oDomElement.dispatchEvent(oEvent);

    onScan._reinitialize(oDomElement);
    return false;
  },

  _mergeOptions(oDefaults, oOptions) {
    const oExtended = {};
    let prop;
    for (prop in oDefaults) {
      if (Object.prototype.hasOwnProperty.call(oDefaults, prop)) {
        oExtended[prop] = oDefaults[prop];
      }
    }
    for (prop in oOptions) {
      if (Object.prototype.hasOwnProperty.call(oOptions, prop)) {
        oExtended[prop] = oOptions[prop];
      }
    }
    return oExtended;
  },

  _getNormalizedKeyNum(e) {
    let iKeyCode;
    if (window.event) {
      // IE
      iKeyCode = e.keyCode;
    } else if (e.which) {
      // Netscape/Firefox/Opera
      iKeyCode = e.which;
    }
    return iKeyCode;
  },

  _handleKeyDown(e) {
    // overwrite the which value of the event with keycode for cross platform compatibility
    e.which = onScan._getNormalizedKeyNum(e);
    const iKeyCode = e.which;
    const oOptions = this.scannerDetectionData.options;
    const oVars = this.scannerDetectionData.vars;

    oOptions.onKeyDetect.call(this, e.which, e);

    if (onScan._isFocusOnIgnoredElement(this)) {
      return;
    }

    // If it's just the button of the scanner, ignore it and wait for the real input
    if (
      oOptions.scanButtonKeyCode !== false &&
      iKeyCode == oOptions.scanButtonKeyCode
    ) {
      // if the button was first pressed, start a timeout for the callback, which gets interrupted if the scanbutton gets released
      if (!oVars.longPressed) {
        oVars.longPressTimer = setTimeout(
          oOptions.onScanButtonLongPress,
          oOptions.scanButtonLongPressTime,
          this
        );
        oVars.longPressed = true;
      }

      return;
    }

    if (oOptions.stopPropagation) {
      e.stopImmediatePropagation();
    }

    if (oOptions.preventDefault) {
      e.preventDefault();
    }

    switch (true) {
      // If it's not the first character and we encounter a terminating character, trigger scan process
      case oVars.firstCharTime &&
        oOptions.suffixKeyCodes.indexOf(iKeyCode) !== -1:
        e.preventDefault();
        e.stopImmediatePropagation();
        this.scannerDetectionData.vars.callIsScanner = true;
        break;

      // If it's the first character and we encountered one of the starting characters, don't process the scan
      case !oVars.firstCharTime &&
        oOptions.prefixKeyCodes.indexOf(iKeyCode) !== -1:
        e.preventDefault();
        e.stopImmediatePropagation();
        oVars.callIsScanner = false;
        break;

      // Otherwise, just add the character to the scan string we're building
      default:
        var character = oOptions.keyCodeMapper.call(this, e);
        if (character === null) {
          return;
        }
        oVars.stringWriting += character;
        oVars.callIsScanner = false;
        break;
    }

    if (!oVars.firstCharTime) {
      oVars.firstCharTime = Date.now();
    }

    oVars.lastCharTime = Date.now();

    if (oVars.testTimer) {
      clearTimeout(oVars.testTimer);
    }

    if (oVars.callIsScanner) {
      onScan._validateScanCode(this);
      oVars.testTimer = false;
    } else {
      oVars.testTimer = setTimeout(
        onScan._validateScanCode,
        oOptions.timeBeforeScanTest,
        this
      );
    }

    oOptions.onKeyProcess.call(this, character, e);
  },

  _handlePaste(e) {
    // if the focus is on an ignored element, abort
    if (onScan._isFocusOnIgnoredElement(this)) {
      return;
    }
    e.preventDefault();

    const sPasteString = (event.clipboardData || window.clipboardData).getData(
      'text'
    );
    this.scannerDetectionData.options.onPaste.call(this, sPasteString, event);

    const oVars = this.scannerDetectionData.vars;
    oVars.firstCharTime = 0;
    oVars.lastCharTime = 0;
    oVars.stringWriting = sPasteString;

    // validate the string
    onScan._validateScanCode(this);
  },

  _handleKeyUp(e) {
    // if the focus is on an ignored element, abort
    if (onScan._isFocusOnIgnoredElement(this)) {
      return;
    }

    const iKeyCode = onScan._getNormalizedKeyNum(e);

    // if hardware key is not being pressed anymore stop the timeout and reset
    if (iKeyCode == this.scannerDetectionData.options.scanButtonKeyCode) {
      clearTimeout(this.scannerDetectionData.vars.longPressTimer);
      this.scannerDetectionData.vars.longPressed = false;
    }
  }
};

/**
 * Default page number per page for product
 * @type {number}
 */
export const defaultPageSize = 20;

export function shippingMethodDefault(methodShipping) {
  console.log(methodShipping);
  switch (methodShipping) {
    case 'flatrate':
      return 'flatrate_flatrate';
    case 'freeshipping':
      return 'freeshipping_freeshipping';
    default:
      return methodShipping;
  }
}
