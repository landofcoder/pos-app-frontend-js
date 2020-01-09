// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './listcart.scss';
import { deleteItemCart } from '../../actions/homeAction';
import { formatCurrencyCode } from '../../common/product';

type Props = {
  cartCurrent: Array,
  deleteItemCart: (payload: object) => void,
  currencyCode: string
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
      return `${window.mainUrl}pub/media/catalog/product/${image}`;
    }
    // Return default image
    return `${window.mainUrl}pub/media/catalog/product/`;
  };

  renderItemPrice = item => {
    const { currencyCode } = this.props;
    if (!item.type_id || item.type_id !== 'bundle') {
      if (item.price.regularPrice) {
        return formatCurrencyCode(
          item.price.regularPrice.amount.value,
          currencyCode
        );
      }
      return item.price;
    }
    return this.sumBundlePrice(item);
  };

  /**
   * Sum bundle price
   * @param item
   */
  sumBundlePrice = item => {
    // Bundle type
    let price = 0;
    const { items } = item;
    items.forEach(itemBundle => {
      const listOptionSelected = this.findOptionSelected(
        itemBundle.option_selected,
        itemBundle.options
      );
      if (listOptionSelected.length > 0) {
        // Get product
        listOptionSelected.forEach(itemOption => {
          price += itemOption.product.price.regularPrice.amount.value;
        });
      }
    });
    return price;
  };

  /**
   * Find option selected
   * @param optionSelected
   * @param options
   */
  findOptionSelected = (optionSelected, options) => {
    const listProductSelected = [];
    options.forEach(item => {
      if (optionSelected.indexOf(item.id) !== -1) {
        // Exists item
        listProductSelected.push(item);
      }
    });
    return listProductSelected;
  };

  render() {
    const { cartCurrent } = this.props;
    return (
      <div>
        <ul className={styles.listGroup}>
          {cartCurrent.data.map((item, index) => {
            return (
              <li key={`${item.id}${index}`} className={`${styles.item}`}>
                <div className={styles.wrapLineProduct}>
                  <div className={styles.wrapImage}>
                    <img src={this.getFirstMedia(item)} alt="" />
                  </div>
                  <div className={styles.wrapInfo}>
                    <div className={styles.wrapProductName}>
                      <span>{item.name}</span>
                    </div>
                    <div className={styles.wrapPriceInfo}>
                      <div className={styles.wrapSku}>{item.sku}</div>
                      <div className={styles.wrapPrice}>
                        {item.pos_totalPriceFormat}
                      </div>
                    </div>
                  </div>
                  <div
                    className={styles.wrapClose}
                    onClick={() => this.deleteAction(index)}
                  >
                    <i className="fas fa-times"></i>
                  </div>
                  <div className={styles.wrapQtyNumber}>
                    <span>{item.pos_qty}</span>
                  </div>
                </div>
                <div className={styles.wrapPriceUnit}>
                  <span>1 Unit(s) at {this.renderItemPrice(item)}/Unit</span>
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
  cartCurrent: state.mainRd.cartCurrent,
  currencyCode: state.mainRd.shopInfoConfig[0]
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
