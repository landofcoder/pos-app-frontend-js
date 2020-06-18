import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import Styles from './stock-display.scss';
import Stock from '../stock';
import { getProductByCategory } from '../../../actions/homeAction';
import ModalStyle from '../../styles/modal.scss';
import Close from '../x';

class StockDisplay extends Component {
  props: Props;

  state = {
    stockDetailOpen: false
  };

  componentDidMount(): void {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }

  escFunction = event => {
    if (event.keyCode === 27) {
      this.setState({ stockDetailOpen: false });
    }
  };

  closeModel = () => {
    this.setState({ stockDetailOpen: false });
  };

  showStockDetail = () => {
    this.setState({ stockDetailOpen: true });
  };

  getInventoryByOutletWareHouse = item => {
    switch (item.type_id) {
      case 'simple': {
        const listStock = item.stock.stock;
        return this.findDefaultQtyByOutletWareHouse(listStock);
      }
      case 'configurable':
        return '';
      default:
        return '';
    }
  };

  findDefaultQtyByOutletWareHouse = listStock => {
    if (listStock && listStock.length > 0) {
      const { detailOutlet } = this.props;
      const outletSource = detailOutlet.select_source;
      for (let i = 0; i < listStock.length; i += 1) {
        const stockItem = JSON.parse(listStock[i]);
        if (stockItem.code === outletSource) {
          return stockItem.quantity;
        }
      }
    }
    return '';
  };

  renderStockWarehouse = item => {
    const { detailOutlet } = this.props;
    const outletSource = detailOutlet.select_source;
    let listVariants = [];

    switch (item.type_id) {
      case 'simple':
        listVariants.push({ product: item });
        break;
      case 'configurable':
        listVariants = item.variants;
        break;
      default:
        break;
    }
    return (
      <div>
        {listVariants.map((item, index) => {
          const { product } = item;
          let listStock = product.stock.stock;
          if (!listStock) {
            listStock = [];
          }
          return (
            <div key={index}>
              <b className="font-weight-bolder">{product.name}</b>
              <ul className="list-group list-group-flush mt-2">
                {listStock.map((itemStock, indexStock) => {
                  const stockItem = JSON.parse(itemStock);
                  return (
                    <li
                      key={indexStock}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {stockItem.code}{' '}
                      {stockItem.code === outletSource ? '(Current)' : ''}
                      <span className="badge badge-primary badge-pill">
                        {stockItem.quantity}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { item } = this.props;
    const { stockDetailOpen } = this.state;
    return (
      <>
        <Modal
          overlayClassName={ModalStyle.Overlay}
          shouldCloseOnOverlayClick
          onRequestClose={this.closeModel}
          className={`${ModalStyle.Modal} ${Styles.stockModel}`}
          isOpen={stockDetailOpen}
          contentLabel="Example Modal"
        >
          <div className={ModalStyle.modalContent}>
            <div
              className={ModalStyle.close}
              role="presentation"
              onClick={this.closeModel}
            >
              <Close />
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Stock inventory</h5>
                <hr />
                {this.renderStockWarehouse(item)}
              </div>
            </div>
          </div>
        </Modal>
        <div
          role="presentation"
          className={`${Styles.wrapStock}`}
          onClick={this.showStockDetail}
        >
          <div className={`${Styles.stockIcon}`}>
            <Stock />
          </div>
          <div className={Styles.stockNumber}>
            <span>{this.getInventoryByOutletWareHouse(item)}</span>
          </div>
        </div>
      </>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getProductByCategory: payload => dispatch(getProductByCategory(payload))
  };
}

function mapStateToProps(state) {
  return {
    detailOutlet: state.mainRd.generalConfig.detail_outlet,
    productStock: state.mainRd.productStock
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockDisplay);
