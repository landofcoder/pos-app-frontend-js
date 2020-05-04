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
  render() {
    const data = this.props.data;
    console.log('collapse');
    console.log(data);
    if (!data) return null;
    return (
      <>
        {data.map((item, index) => {
          return (
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{item.message}</td>
              <CollapseData data={item.data} />
            </tr>
          );
        })}
      </>
    );
  }
}
export default CollapseData;
