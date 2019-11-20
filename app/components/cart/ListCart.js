// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './listcart.scss';
import { baseUrl } from '../../params';
import CommonStyles from '../styles/common.scss';
import { deleteItemCart } from '../../actions/homeAction';

type Props = {
  cartCurrent: Array,
  deleteItemCart: (payload: object) => void
};

class ListCart extends Component<Props> {
  props: Props;

  deleteAction = index => {
    const { deleteItemCart } = this.props;
    deleteItemCart(index);
  };

  getFirstMedia = item => {
    const gallery = item.media_gallery_entries
      ? item.media_gallery_entries
      : [];
    if (gallery.length > 0) {
      const image = gallery[0].file;
      return `${baseUrl}pub/media/catalog/product/${image}`;
    }
    // Return default image
    return `${baseUrl}pub/media/catalog/product/`;
  };

  renderItemPrice = item => {
    if (item.type_id && item.type_id !== 'bundle') {
      if (item.price.regularPrice) {
        return item.price.regularPrice.amount.value;
      }
      return item.price;
    }
    return 0;
  };

  render() {
    const { cartCurrent } = this.props;
    return (
      <div>
        <ul className={styles.listGroup}>
          {cartCurrent.data.map((item, index) => {
            return (
              <li key={`${item.id}${index}`} className={`${styles.item}`}>
                <div className={`${styles.tableFlex}`}>
                  <div
                    className={`${styles.tableFlex} ${styles.tableFlexLeft} pr-1 pb-2`}
                  >
                    <img
                      className={styles.sizeimgsmall}
                      src={this.getFirstMedia(item)}
                      alt=""
                    />
                  </div>
                  <div
                    className={`${styles.tableFlex} ${styles.tableFlexRight} ${styles.divElement} ${styles.wrapContent}`}
                  >
                    <div className={`${styles.title}`}>
                      <span>{item.name}</span>
                      <span className={styles.blockquote}>{item.sku}</span>
                    </div>
                    <div className={`pr-5 ${styles.spaceTable} ${styles.cost}`}>
                      <div>
                        <span>${this.renderItemPrice(item)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`p-0 ${styles.cancel}`}>
                    <a
                      onClick={() => this.deleteAction(index)}
                      role="presentation"
                      className={CommonStyles.pointer}
                    >
                      <i className={`far fa-times-circle ${styles.icon}`}></i>
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
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
)(ListCart);
