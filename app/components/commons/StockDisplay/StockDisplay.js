import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../../pos.scss';
import Stock from '../stock';
import { getProductByCategory } from '../../../actions/homeAction';
import ModalStyle from '../../styles/modal.scss';

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

  showStockDetail = () => {
    this.setState({ stockDetailOpen: true });
  };

  getInventoryByOutletWareHouse(stock) {
    const { detailOutlet } = this.props;
    const listStock = stock.stock ? stock.stock : [];
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
    const { stockItem } = this.props;
    const stockList = stockItem.stock ? stockItem.stock : [];
    const { stockDetailOpen } = this.state;
    return (
      <>
        <div
          className={ModalStyle.modal}
          id="payModal"
          style={{ display: stockDetailOpen ? 'block' : 'none' }}
        >
          <div className={ModalStyle.modalContent}>
            <div className={ModalStyle.close}>
              Close
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Stock inventory</h5>
                <ul className="list-group">
                  {stockList.map((item, index) => {
                    const itemAssign = JSON.parse(item);
                    return (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {itemAssign.code}
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
        </div>

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
