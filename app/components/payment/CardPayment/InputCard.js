import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onCardPaymentFieldOnChange } from '../../../actions/homeAction';

class InputCard extends Component {
  props: Props;

  carInfoOnChange = (field, e) => {
    const { onCardPaymentFieldOnChange } = this.props;
    onCardPaymentFieldOnChange({ field, value: e.target.value });
  };

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
                          className="form-control"
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
                        className="form-control"
                        maxLength={2}
                        onChange={e => this.carInfoOnChange('expMonth', e)}
                        value={expMonth}
                      />
                    </div>
                    <div className="col-3 pl-1">
                      <label htmlFor="exampleFormControlInput1">Exp date</label>
                      <input
                        className="form-control"
                        maxLength={2}
                        onChange={e => this.carInfoOnChange('expYear', e)}
                        value={expYear}
                      />
                    </div>
                    <div className="col-3 pl-0">
                      <label htmlFor="exampleFormControlInput1">CSC</label>
                      <input
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
