import React, { Component } from 'react';

type Props = {
  data: Array
};
class CollapseData extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {};
  }

  collapseObject = data => {
    const result = Object.keys(data).map(key => {
      return [key, data[key]];
    });
    return result;
  };

  renderCollapse = data => {
    if (typeof data === 'object') {
      let toArray = this.collapseObject(data);
      console.log('to array');
      console.log(toArray);
      return (
        <>
          {toArray.map((item, key) => {
            console.log(item);
            return (
              <>
                <div
                  className="row"
                  key={key + item}
                  style={{ width: '400px' }}
                >
                  <div className="col-3">
                    <span className="font-weight-bold">{item[0]}</span>
                  </div>
                  <div className="col">
                    <span>{typeof item[1] === 'string' ? item[1] : null}</span>
                  </div>
                </div>
                {this.renderCollapse(item[1])}
              </>
            );
          })}
        </>
      );
    }
    return null;
  };

  render() {
    const data = this.props.data;
    if (!data) return null;
    const logs = data.toString() || null;
    return <>{this.renderCollapse(data)}</>;
  }
}
export default CollapseData;
