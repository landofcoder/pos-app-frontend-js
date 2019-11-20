// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteItemCart } from '../../actions/homeAction';

type Props = {};

class CartCustomer extends Component<Props> {
  props: Props;

  render() {
    return <div>Cart customer</div>;
  }
}

const mapStateToProps = state => ({
  cartCurrent: state.mainRd.cartCurrent
});

const mapDispatchToProps = dispatch => {
  return {
    deleteItemCart: payload => dispatch(deleteItemCart(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CartCustomer);
