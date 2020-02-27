import React, { Component } from 'react';
import { connect } from 'react-redux';

class InputCard extends Component {
  props: Props;

  render() {
    return (
      <div className="mt-4">
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
                      <input className="form-control" />
                    </div>
                  </div>
                  <div className="col-7 pr-0">
                    <label htmlFor="exampleFormControlInput1">
                      Card number
                    </label>
                    <input className="form-control" />
                  </div>
                  <div className="col-3">
                    <label htmlFor="exampleFormControlInput1">
                      Exp date
                    </label>
                    <input className="form-control" />
                  </div>
                  <div className="col-2 pl-0">
                    <label htmlFor="exampleFormControlInput1">
                      CSC
                    </label>
                    <input className="form-control" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InputCard);
