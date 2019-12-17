import React, { Component } from "react";

class Calculator extends Component {
  render() {
    return (
      <>
        <div className="h-100 bg-light">
          <div className="container text-center h-100" id="calc">
            <div className="row h-100 align-items-center justify-content-center">
              <div className="col-lg-4 col-md-7 col-sm-9 col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="m-0">
                      BootstrapSnippet<sup className="text-warning">.net</sup>{" "}
                      Calculator
                    </h5>
                  </div>
                  <div className="card-body">
                    <form className="mb-3" name="calc">
                      <input
                        type="text"
                        className="screen form-control form-control-lg text-right"
                        name="result"
                        readonly
                      />
                    </form>
                    <div className="px-1">
                      <div className="row px-2">
                        <div className="col-3 p-1">
                          <button
                            id="allClear"
                            type="button"
                            className="btn btn-block btn-lg btn-danger"
                            onclick="clearScreen()"
                          >
                            AC
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="clear"
                            type="button"
                            className="btn btn-block btn-lg btn-warning"
                            onclick="clearScreen()"
                          >
                            CE
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="%"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            %
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="/"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            ÷
                          </button>
                        </div>
                      </div>
                      <div className="row px-2">
                        <div className="col-3 p-1">
                          <button
                            id="7"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            7
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="8"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            8
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="9"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            9
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="*"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            x
                          </button>
                        </div>
                      </div>
                      <div className="row px-2">
                        <div className="col-3 p-1">
                          <button
                            id="4"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            4
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="5"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            5
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="6"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            6
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="-"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            -
                          </button>
                        </div>
                      </div>
                      <div className="row px-2">
                        <div className="col-3 p-1">
                          <button
                            id="1"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            1
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="2"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            2
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="3"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            3
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="+"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="row px-2">
                        <div className="col-3 p-1">
                          <button
                            id="0"
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            0
                          </button>
                        </div>
                        <div className="col-3 p-1">
                          <button
                            id="."
                            type="button"
                            className="btn btn-block btn-lg btn-light border"
                            onclick="btnPress(this.id)"
                          >
                            .
                          </button>
                        </div>
                        <div className="col-6 p-1">
                          <button
                            id="equals"
                            type="button"
                            className="btn btn-block btn-lg btn-success"
                            onclick="calculate()"
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
