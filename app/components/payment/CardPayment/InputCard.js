import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onCardPaymentFieldOnChange } from '../../../actions/homeAction';

const utilizeFocus = () => {
  const ref = React.createRef();
  const setFocus = () => {
    // eslint-disable-next-line no-unused-expressions
    ref.current && ref.current.focus();
  };

  return { setFocus, ref };
};

class InputCard extends Component {
  props: Props;

  constructor(props) {
    super();
    this.focusCvcInput = utilizeFocus();
    this.focusExpMonthInput = utilizeFocus();
    this.focusExpDateInput = utilizeFocus();
  }

  carInfoOnChange = (field, eParams) => {
    const e = eParams.target !== undefined ? eParams.target.value : eParams;
    switch (field) {
      case 'expMonth':
      case 'expYear':
      case 'cvc':
      case 'cardNumber':
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(e)) return;
        break;
      default:
        break;
    }
    if (field === 'expMonth') {
      if (e.length === 2 && +e[0] > 1) {
        this.carInfoOnChange('expMonth', `0${e[0]}`);
        this.carInfoOnChange('expYear', e[1]);
        this.focusExpDateInput.setFocus();
        return;
      }
      if (e.length === 2 && +e[0] === 1 && +e[1] > 2) {
        this.carInfoOnChange('expMonth', `0${e[0]}`);
        this.carInfoOnChange('expYear', e[1]);
        this.focusExpDateInput.setFocus();
        return;
      }
      if (e.length > 2) {
        this.carInfoOnChange('expYear', e[2]);
        this.focusExpDateInput.setFocus();
        return;
      }
    } else if (field === 'expYear') {
      if (e.length > 4) {
        this.carInfoOnChange('cvc', e[4]);
        this.focusCvcInput.setFocus();
        return;
      }
    } else if (field === 'cvc') {
      if (e.length > 3) return;
    }
    const { onCardPaymentFieldOnChange } = this.props;
    onCardPaymentFieldOnChange({ field, value: e });
  };

  // eslint-disable-next-line class-methods-use-this
  checkValidInputCardNumber() {
    const { cardPayment } = this.props;
    const { cardNumber } = cardPayment.cardInfo;
    if (cardNumber.length > 10 && cardNumber.length < 17) return 'is-valid';
    if (cardNumber.length !== 0) return 'is-invalid';
    return null;
  }

  render() {
    const { cardPayment } = this.props;
    const cardPaymentType = cardPayment.type;
    const {
      nameOnCard,
      cardNumber,
      expMonth,
      expYear,
      cvc
    } = cardPayment.cardInfo;

    console.log('card payment:', cardPayment);

    return (
      <div className="mt-4">
        {cardPaymentType ? (
          <div className="row">
            <div className="col-8 offset-2">
              <div className="card">
                <div className="card-header">Card</div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">
                          Name on Card
                        </label>
                        <input
                          value={nameOnCard}
                          className="form-control"
                          onChange={e => this.carInfoOnChange('nameOnCard', e)}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">
                          Card number
                        </label>
                        <input
                          className={
                            // eslint-disable-next-line prefer-template
                            `form-control ` + this.checkValidInputCardNumber()
                          }
                          value={cardNumber}
                          onChange={e => this.carInfoOnChange('cardNumber', e)}
                          type="password"
                        />
                      </div>
                    </div>
                    <div className="col-3 pr-1">
                      <label htmlFor="exampleFormControlInput1">
                        Exp month
                      </label>
                      <input
                        ref={this.focusExpMonthInput.ref}
                        id="cart-exp-month"
                        className="form-control"
                        onChange={e => this.carInfoOnChange('expMonth', e)}
                        value={expMonth}
                      />
                    </div>
                    <div className="col-3 pl-1">
                      <label htmlFor="exampleFormControlInput1">Exp date</label>
                      <input
                        ref={this.focusExpDateInput.ref}
                        id="cart-exp-year"
                        className="form-control"
                        onChange={e => this.carInfoOnChange('expYear', e)}
                        value={expYear}
                      />
                    </div>
                    <div className="col-3 pl-0">
                      <label htmlFor="exampleFormControlInput1">CSC</label>
                      <input
                        ref={this.focusCvcInput.ref}
                        className="form-control"
                        onChange={e => this.carInfoOnChange('cvc', e)}
                        type="password"
                        value={cvc}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cardPayment: state.mainRd.checkout.cardPayment
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCardPaymentFieldOnChange: payload =>
      dispatch(onCardPaymentFieldOnChange(payload))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputCard);
