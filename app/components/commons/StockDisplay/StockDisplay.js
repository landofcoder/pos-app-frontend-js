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

  getInventoryByOutletWareHouse(item) {
    if (item.type_id === 'configurable') {
      return '--';
    }

    const stock = item.stockItem;
    const { detailOutlet } = this.props;
    const listStock = stock && stock.stock ? stock.stock : [];
    const outletSource = detailOutlet.select_source;
    for (let i = 0; i < listStock.length; i += 1) {
      const stockItem = JSON.parse(listStock[i]);
      const stockCode = stockItem.code;
      if (stockCode === outletSource) {
        return stockItem.quantity ? stockItem.quantity : '--';
      }
    }
    return 0;
  }

  renderStockWarehouse = item => {
    const { detailOutlet } = this.props;
    console.log('detail outlet:', detailOutlet);
    let listVariants = [];
    if (item.variants && item.variants.length === 0) {
      listVariants.push(item);
    } else {
      listVariants = item.variants;
    }
    return (
      <div>
        {listVariants.map((item, index) => {
          let listStock = item.stock.stock;
          if (!listStock) {
            listStock = [];
          }
          return (
            <div key={index}>
              <b className="font-weight-bolder">{item.name}</b>
              <ul className="list-group list-group-flush mt-2">
                {listStock.map((itemStock, indexStock) => {
                  const stockItem = JSON.parse(itemStock);
                  return (
                    <li
                      key={indexStock}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {stockItem.code}
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
