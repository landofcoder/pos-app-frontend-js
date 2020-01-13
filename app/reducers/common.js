export const cartCurrentDefaultData = {
  cartId: '',
  customerToken: '',
  data: [],
  customer: null, // Current customer for current cart
  isGuestCustomer: true
};

const testCartCurrentForReceipt = [
  {
    id: 533,
    name: 'Zoltan Gym Tee-XS-Blue',
    sku: 'MS06-XS-Blue',
    attribute_set_id: 9,
    weight: 1,
    media_gallery_entries: [
      {
        file: '/m/s/ms06-blue_main_1.jpg'
      },
      {
        file: '/m/s/ms06-blue_alt1_1.jpg'
      },
      {
        file: '/m/s/ms06-blue_back_1.jpg'
      }
    ],
    price: {
      regularPrice: {
        amount: {
          value: 29,
          currency: 'VND'
        }
      }
    },
    pos_qty: 1,
    pos_totalPrice: 29
  },
  {
    sku: '24-WG080',
    type_id: 'bundle',
    id: 46,
    name: 'Sprite Yoga Companion Kit',
    dynamic_sku: true,
    dynamic_price: true,
    dynamic_weight: true,
    price_view: 'PRICE_RANGE',
    media_gallery_entries: [
      {
        file: '/l/u/luma-yoga-kit-2.jpg'
      }
    ],
    ship_bundle_items: 'TOGETHER',
    items: [
      {
        option_id: 1,
        title: 'Sprite Stasis Ball',
        required: true,
        type: 'radio',
        position: 1,
        sku: '24-WG080',
        options: [
          {
            id: 1,
            qty: 1,
            position: 1,
            is_default: true,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Stasis Ball 55 cm',
            product: {
              id: 26,
              name: 'Sprite Stasis Ball 55 cm',
              sku: '24-WG081-blue',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-stability-ball.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 23
                  }
                }
              }
            }
          },
          {
            id: 2,
            qty: 1,
            position: 2,
            is_default: false,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Stasis Ball 65 cm',
            product: {
              id: 29,
              name: 'Sprite Stasis Ball 65 cm',
              sku: '24-WG082-blue',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-stability-ball.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 27
                  }
                }
              }
            }
          },
          {
            id: 3,
            qty: 1,
            position: 3,
            is_default: false,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Stasis Ball 75 cm',
            product: {
              id: 32,
              name: 'Sprite Stasis Ball 75 cm',
              sku: '24-WG083-blue',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-stability-ball.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 32
                  }
                }
              }
            }
          }
        ],
        option_selected: [1]
      },
      {
        option_id: 2,
        title: 'Sprite Foam Yoga Brick',
        required: true,
        type: 'radio',
        position: 2,
        sku: '24-WG080',
        options: [
          {
            id: 4,
            qty: 1,
            position: 1,
            is_default: true,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Foam Yoga Brick',
            product: {
              id: 21,
              name: 'Sprite Foam Yoga Brick',
              sku: '24-WG084',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-yoga-brick.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 5
                  }
                }
              }
            }
          }
        ],
        option_selected: [4]
      },
      {
        option_id: 3,
        title: 'Sprite Yoga Strap',
        required: true,
        type: 'radio',
        position: 3,
        sku: '24-WG080',
        options: [
          {
            id: 5,
            qty: 1,
            position: 1,
            is_default: true,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Yoga Strap 6 foot',
            product: {
              id: 33,
              name: 'Sprite Yoga Strap 6 foot',
              sku: '24-WG085',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-yoga-strap.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 14
                  }
                }
              }
            }
          },
          {
            id: 6,
            qty: 1,
            position: 2,
            is_default: false,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Yoga Strap 8 foot',
            product: {
              id: 34,
              name: 'Sprite Yoga Strap 8 foot',
              sku: '24-WG086',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-yoga-strap.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 17
                  }
                }
              }
            }
          },
          {
            id: 7,
            qty: 1,
            position: 3,
            is_default: false,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Yoga Strap 10 foot',
            product: {
              id: 35,
              name: 'Sprite Yoga Strap 10 foot',
              sku: '24-WG087',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-yoga-strap.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 21
                  }
                }
              }
            }
          }
        ],
        option_selected: [5]
      },
      {
        option_id: 4,
        title: 'Sprite Foam Roller',
        required: true,
        type: 'radio',
        position: 4,
        sku: '24-WG080',
        options: [
          {
            id: 8,
            qty: 1,
            position: 1,
            is_default: true,
            price: 0,
            price_type: 'FIXED',
            can_change_quantity: true,
            label: 'Sprite Foam Roller',
            product: {
              id: 22,
              name: 'Sprite Foam Roller',
              sku: '24-WG088',
              type_id: 'simple',
              media_gallery_entries: [
                {
                  file: '/l/u/luma-foam-roller.jpg'
                }
              ],
              price: {
                regularPrice: {
                  amount: {
                    value: 19
                  }
                }
              }
            }
          }
        ],
        option_selected: [8]
      }
    ],
    pos_qty: 1,
    pos_totalPrice: 61
  },
  {
    id: 1,
    name: 'Joust Duffle Bag',
    sku: '24-MB01',
    media_gallery_entries: [
      {
        file: '/m/b/mb01-blue-0.jpg'
      }
    ],
    type_id: 'simple',
    price: {
      regularPrice: {
        amount: {
          value: 34,
          currency: 'VND'
        }
      }
    },
    pos_qty: 1,
    pos_totalPrice: 34
  }
];

export const testCartCurrentForDefaultReceipt = {
  cartId: '',
  customerToken: '',
  data: [],
  customer: null, // Current customer for current cart
  isGuestCustomer: true
};
