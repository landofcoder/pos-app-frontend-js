// @flow
import * as React from 'react';

type Props = {
  children: React.Node
};

class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <div className="container-fluid">{children}</div>
      </React.Fragment>
    );
  }
}

export default App;
