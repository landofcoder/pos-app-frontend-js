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

  getInventoryByOutletWareHouse(stock) {
    const { detailOutlet } = this.props;
    const listStock = stock && stock.stock ? stock.stock : [];
    const outletSource = detailOutlet.select_source;
    for (let i = 0; i < listStock.length; i += 1) {
      const stockItem = JSON.parse(listStock[i]);
      const stockCode = stockItem.code;
      if (stockCode === outletSource) {
        return stockItem.total_qty ? stockItem.total_qty : stockItem.quantity;
      }
    }
    return 0;
  }

  render() {
    const { stockItem, detailOutlet } = this.props;
    const outletSource = detailOutlet.select_source;
    const stockList = stockItem && stockItem.stock ? stockItem.stock : [];
    const { stockDetailOpen } = this.state;
    return (
      <>
        <Modal
          overlayClassName={ModalStyle.Overlay}
          shouldCloseOnOverlayClick
          onRequestClose={this.closeModel}
          className={`${ModalStyle.Modal}`}
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
                <ul className={`list-group ${Styles.wrapItems}`}>
                  {stockList.map((item, index) => {
                    const itemAssign = JSON.parse(item);
                    return (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span>
                          <span>
                            <Stock />
                            &nbsp;
                          </span>
                          {itemAssign.code}
                          {itemAssign.code === outletSource ? (
                            <>(Current)</>
                          ) : (
                            <></>
                          )}
                        </span>
                        <span className="badge badge-primary badge-pill">
                          {itemAssign.total_qty
                            ? itemAssign.total_qty
                            : itemAssign.quantity}
                        </span>
                      </li>
                    );
                  })}
                </ul>
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
            <span>{this.getInventoryByOutletWareHouse(stockItem)}</span>
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
    detailOutlet: state.mainRd.generalConfig.detail_outlet
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StockDisplay);
