// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

type Props = {
  cartCurrent: Array
};

class ListCart extends Component<Props> {
  props: Props;

  render() {
    const { cartCurrent } = this.props;
    return (
      <div>
        <ul className="list-group">
          {cartCurrent.data.map(item => (
            <li key={item.id} className="list-group-item">
              Cras justo odio
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  cartCurrent: state.mainRd.cartCurrent
});

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCart);
