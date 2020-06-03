import React, { Component } from 'react';
import { connect } from 'react-redux';
import Styles from '../../pos.scss';
import Stock from '../stock';
import { getProductByCategory } from '../../../actions/homeAction';

class StockDisplay extends Component {
  props: Props;

  showStockDetail = () => {
    console.log('show stock detail');
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
    return (
      <>
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
