import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './listcart.scss';
import {
  deleteItemCart,
  updateIsShowModelEditingCartItem
} from '../../actions/homeAction';
import { formatCurrencyCode } from '../../common/settings';

type Props = {
  cartCurrent: Array,
  deleteItemCart: (payload: Object) => void,
  updateIsShowModelEditingCartItem: (payload: Object) => void,
  appInfo: Object
};

class ListCart extends Component<Props> {
  props: Props;

  deleteAction = index => {
    const { deleteItemCart } = this.props;
    deleteItemCart(index);
  };

  getFirstMedia = item => {
    const { appInfo } = this.props;
    // eslint-disable-next-line camelcase
    const baseImage = appInfo.product_image_base_url;
    const gallery = item.media_gallery_entries
      ? item.media_gallery_entries
      : [];
    if (gallery.length > 0) {
      const image = gallery[0].file;
      return `${baseImage}/pub/media/catalog/product/${image}`;
    }
    // Return default image
    return `${baseImage}/pub/media/catalog/product/`;
  };

  renderItemPrice = item => {
    if (!item.type_id || item.type_id !== 'bundle') {
      if (item.price.regularPrice) {
        return formatCurrencyCode(item.price.regularPrice.amount.value);
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

  editCartItem = (item, index) => {
    const { updateIsShowModelEditingCartItem } = this.props;
    updateIsShowModelEditingCartItem({ open: true, item, index });
  };

  render() {
    const { cartCurrent } = this.props;
    return (
      <div>
        <ul className={`${styles.listGroup} pl-2 pr-3`}>
          {cartCurrent.data.map((item, index) => {
            return (
              <li key={`${item.id}${index}`} className={`${styles.item}`}>
                <div className={styles.wrapLineProduct}>
                  <div className={styles.wrapImage}>
                    <img src={this.getFirstMedia(item)} alt="" />
                  </div>
                  <div className={styles.wrapInfo}>
                    <div
                      role="presentation"
                      className={styles.wrapProductName}
                      onClick={() => this.editCartItem(item, index)}
                    >
                      <span
                        dangerouslySetInnerHTML={{ __html: item.name }}
                      ></span>
                    </div>
                    <div className={styles.wrapPriceInfo}>
                      <div className={styles.wrapSku}>{item.sku}</div>
                      <div className={styles.wrapPrice}>
                        {item.pos_totalPriceFormat}
                      </div>
                    </div>
                  </div>
                  <div
                    role="presentation"
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
  appInfo: state.authenRd.appInfo
});

const mapDispatchToProps = dispatch => {
  return {
    deleteItemCart: payload => dispatch(deleteItemCart(payload)),
    updateIsShowModelEditingCartItem: payload =>
      dispatch(updateIsShowModelEditingCartItem(payload))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListCart);
