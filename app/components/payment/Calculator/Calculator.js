import React, { Component } from 'react';
import { connect } from 'react-redux';
type Props = {
  toggleModalCalculatorStatus: boolean
};
class Calculator extends Component {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      solveValue: ''
    };
  }

  clearScreen = () => {
    this.setState({ solveValue: '' });
  };

  backScreen = () => {
    let { solveValue } = this.state;
    if (solveValue === 'Error') {
      this.setState({ solveValue: '' });
      return;
    }
    solveValue = solveValue.slice(0, solveValue.length - 1);
    this.setState({ solveValue: solveValue });
  };

  btnPress = event => {
    const { solveValue } = this.state;
    const preValue = solveValue;
    if (preValue === 'Error') {
      this.setState({ solveValue: event });
    } else this.setState({ solveValue: preValue + event });
  };

  calculate = () => {
    try {
      let { solveValue } = this.state;
      if (solveValue !== 'Error') {
        let input = eval(solveValue);
        this.setState({ solveValue: input.toString() });
      }
    } catch (err) {
      this.setState({ solveValue: 'Error' });
    }
  };

  render() {
    const { solveValue } = this.state;
    const { toggleModalCalculatorStatus } = this.props;
    return (
      <>
        <div
          className={`col-5 ${
            toggleModalCalculatorStatus === true ? '' : 'd-none'
          }`}
        >
          <div className="card">
            <div className="card-header">
              <h5 className="m-0">Calculator</h5>
            </div>
            <div className="card-body">
              <form className="mb-3" name="calc">
                <input
                  value={solveValue}
                  type="text"
                  className="screen form-control form-control-lg text-right"
                  name="result"
                  readOnly
                />
              </form>
              <div className="px-1">
                <div className="row px-2">
                  <div className="col-3 p-1">
                    <button
                      id="allClear"
                      type="button"
                      className="btn btn-block btn-lg btn-danger"
                      onClick={() => this.clearScreen()}
                    >
                      AC
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      id="clear"
                      type="button"
                      className="btn btn-block btn-lg btn-warning"
                      onClick={() => this.backScreen()}
                    >
                      CE
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('%')}
                    >
                      %
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      id="/"
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('/')}
                    >
                      ÷
                    </button>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('7')}
                    >
                      7
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('8')}
                    >
                      8
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('9')}
                    >
                      9
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('*')}
                    >
                      x
                    </button>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('4')}
                    >
                      4
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('5')}
                    >
                      5
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('6')}
                    >
                      6
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('-')}
                    >
                      -
                    </button>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('1')}
                    >
                      1
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('2')}
                    >
                      2
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('3')}
                    >
                      3
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('+')}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="row px-2">
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('0')}
                    >
                      0
                    </button>
                  </div>
                  <div className="col-3 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-light border"
                      onClick={() => this.btnPress('.')}
                    >
                      .
                    </button>
                  </div>
                  <div className="col-6 p-1">
                    <button
                      type="button"
                      className="btn btn-block btn-lg btn-success"
                      onClick={() => this.calculate('equals')}
                    >
                      =
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    toggleModalCalculatorStatus: state.mainRd.isOpenCalculator
  };
}
export default connect(
  mapStateToProps,
  null
)(Calculator);
