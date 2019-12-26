import React, { Component } from 'react';

class Calculator extends Component {
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
    const { solveValue } = this.state;
    this.setState({ solveValue: solveValue.slice(0, solveValue.length - 1) });
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
      const { solveValue } = this.state;
      const input = eval(solveValue);
      this.setState({ solveValue: input });
    } catch (err) {
      this.setState({ solveValue: 'Error' });
    }
  };

  render() {
    const { solveValue } = this.state;
    return (
      <>
        <div className="h-100 bg-light">
          <div className="container text-center h-100" id="calc">
            <div className="row h-100 align-items-center justify-content-center">
              <div className="col-lg-4 col-md-7 col-sm-9 col-12">
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
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default Calculator;
