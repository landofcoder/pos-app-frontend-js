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
            <li key={item.id} className={`list-group-item ${styles.item}`}>
              <div className={`row ${styles.tableFlex}`}>
                <div className="col-md-3 pr-5 pb-2">
                  <img
                    className={styles.sizeimgsmall}
                    src="https://images-na.ssl-images-amazon.com/images/I/81SHf40Ph3L._UL1500_.jpg"
                    alt=""
                  />
                </div>
                <div className={`col-md-9 pr-5 row ${styles.wrapContent}`}>
                  <div className={`col-md-9 ${styles.title}`}>
                    <span>Bolo Sport Watch</span>
                    <span className={styles.blockquote}>another thing</span>
                  </div>
                  <div
                    className={`col-md-3 pr-5 ${styles.spaceTable} ${styles.cost}`}
                  >
                    <div>
                      <span>$23.00</span>
                    </div>
                  </div>
                </div>
                <div className={`p-0 ${styles.cancel}`}>
                  <i className={`far fa-times-circle ${styles.icon}`}></i>
                </div>
              </div>
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
