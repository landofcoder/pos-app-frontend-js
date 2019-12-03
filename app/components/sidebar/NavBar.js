import React, { Component } from 'react';
import Styles from './NavBar.scss';
import ListStyles from '../cart/listcart.scss';

class SideBar extends Component {
  render() {
    const { statusAction } = this.props;
    return (
      <>
        <nav
          className={`${Styles.sidebar} ${
            statusAction ? Styles.show : Styles.off
          }`}
        >
          <div className={`${Styles.header}`}>
            <span>Bootstrap Sidebar</span>
            <span>staff Opentechiz / Primary Location</span>
          </div>

          <ul className="list-group">
            <li
              className={`${Styles.listBorder} list-group-item list-group-item-action`}
            >
              <div className={Styles.flexIcon}>
                <a
                  href="#"
                  className="list-group-item-action fas fa-shopping-cart fa-2x"
                ></a>
              </div>
              <div className={Styles.flexContent}>
                <span>Checkout</span>
              </div>
            </li>
            <li
              className={`${Styles.listBorder} list-group-item list-group-item-action`}
            >
              <div className={Styles.flexIcon}>
                <a
                  href="#"
                  className="list-group-item-action fas fa-file-invoice fa-2x"
                ></a>
              </div>
              <div className={Styles.flexContent}>
                <span>Order history</span>
              </div>
            </li>

            <li
              className={`${Styles.listBorder} list-group-item list-group-item-action`}
            >
              <div className={Styles.flexIcon}>
                <a
                  href="#"
                  className="list-group-item-action fas fa-box-open fa-2x"
                ></a>
              </div>
              <div className={Styles.flexContent}>
                <span>On-hold Order</span>
              </div>
            </li>

            <li
              className={`${Styles.listBorder} list-group-item list-group-item-action`}
            >
              <div className={Styles.flexIcon}>
                <a
                  href="#"
                  className="list-group-item-action fas fa-cog fa-2x"
                ></a>
              </div>
              <div className={Styles.flexContent}>
                <span>Settings</span>
              </div>
            </li>
          </ul>
        </nav>
      </>
    );
  }
}
export default SideBar;
