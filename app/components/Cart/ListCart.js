// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './listcart.scss';

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

          <li className={`list-group-item ${styles.item}`}>
            <div className="row">
              <div className="col-sm-3">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/I/81SHf40Ph3L._UL1500_.jpg"
                  alt=""
                />
              </div>
              <div className={`col-sm-6 p-0 ${styles.title}`}>
                <span>Bolo Sport Watch</span>
                <br />
                <span className={styles.blockquote}>another thing</span>
              </div>
              <div className={`col-sm-2 p-0 ${styles.cost}`}>
                <div>
                  <span>$23.00</span>
                </div>
              </div>
              <div className={`col-sm-1 p-0 ${styles.cancel}`}>
                <div>
                  <i className={`far fa-times-circle ${styles.icon}`}></i>
                </div>
              </div>
            </div>
          </li>
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
