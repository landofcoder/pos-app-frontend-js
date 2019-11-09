// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './listcart.scss';
import { baseUrl } from '../../params';
import CommonStyles from '../styles/common.scss';

type Props = {
  cartCurrent: Array
};

class ListCart extends Component<Props> {
  props: Props;

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

  render() {
    const { cartCurrent } = this.props;
    return (
      <div>
        <ul className={styles.listGroup}>
          {cartCurrent.data.map(item => {
            console.log(item);
            return (
              <li key={item.id} className={`${styles.item}`}>
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
                        <span>${item.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`p-0 ${styles.cancel}`}>
                    <a role="presentation" className={CommonStyles.pointer}>
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

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCart);
