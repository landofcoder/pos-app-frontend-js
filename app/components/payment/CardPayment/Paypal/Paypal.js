import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';

const CLIENT = {
  sandbox:
    'AWxiWYElw7IB1yqcqfXNnIhg7CqFF79UBxjSITMrqrsCHXCT5wCfBPHb8a-Atqi4FTGe-vAX9QfnWpAV',
  production: 'your_production_key'
};

const CLIENT_ID =
  process.env.NODE_ENV === 'production' ? CLIENT.production : CLIENT.sandbox;

let PayPalButton = null;
class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButtons: false,
      loading: true,
      paid: false
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      PayPalButton = window.paypal.Buttons.driver('react', { React, ReactDOM });
      this.setState({ loading: false, showButtons: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const scriptJustLoaded =
      !this.state.showButtons && !this.props.isScriptLoaded && isScriptLoaded;

    if (scriptJustLoaded) {
      if (isScriptLoadSucceed) {
        PayPalButton = window.paypal.Buttons.driver('react', {
          React,
          ReactDOM
        });
        this.setState({ loading: false, showButtons: true });
      }
    }
  }
  createOrder = (data, actions) => {
    console.log("hello");
    return actions.order.create({
      purchase_units: [
        {
          description: 'Mercedes G-Wagon',
          amount: {
            currency_code: 'USD',
            value: 200
          }
        }
      ]
    });
  };

  onApprove = (data, actions) => {
    actions.order.capture().then(details => {
      const paymentData = {
        payerID: data.payerID,
        orderID: data.orderID
      };
      console.log('Payment Approved: ', paymentData);
      this.setState({ showButtons: false, paid: true });
    });
  };

  render() {
    const { showButtons, loading, paid } = this.state;

    return (
      <div className="row">
        <div className="col-8 offset-2">
          <div className="main">
            {showButtons && (
              <div>
                <PayPalButton
                  createOrder={(data, actions) =>
                    this.createOrder(data, actions)
                  }
                  onApprove={(data, actions) => this.onApprove(data, actions)}
                />
              </div>
            )}

            {paid && (
              <div className="main">
                <h5>
                  Congrats! you just paid for that{' '}
                  <span role="img" aria-label="emoji">
                    {' '}
                    😉
                  </span>
                </h5>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default scriptLoader(
  `https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}`
)(PaypalButton);
