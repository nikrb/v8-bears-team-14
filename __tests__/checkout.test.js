import React from 'react';
import 'jest-dom/extend-expect';

import { render, cleanup } from 'react-testing-library';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from '../store/reducers/index';

import Checkout from '../pages/checkout';

let store;

const data = {
  cart: [
    {
      name: "n'23",
      price: 185,
      images: [
        {
          big: 'e1834dc6-4bee-460d-b189-07984ba46266.jpg',
          medium: 'e1834dc6-4bee-460d-b189-07984ba46266300.jpg',
          thumb: 'e1834dc6-4bee-460d-b189-07984ba4626692.jpg'
        },
        {
          big: '8091d5f2-6f48-4cca-abd1-81cbcd65083f.jpg',
          medium: '8091d5f2-6f48-4cca-abd1-81cbcd65083f300.jpg',
          thumb: '8091d5f2-6f48-4cca-abd1-81cbcd65083f92.jpg'
        },
        {
          big: '49bfc75c-eac2-4bdb-9f36-755a3a3d30c7.webp',
          medium: '49bfc75c-eac2-4bdb-9f36-755a3a3d30c7300.webp',
          thumb: '49bfc75c-eac2-4bdb-9f36-755a3a3d30c792.webp'
        }
      ],
      _id: '5ca4d497f74b3d31ba254553',
      available: true,
      quantity: 1
    }
  ],
  buyItNow: {},
  shippingCost: 5,
  loadMore: 6,
  authenticate: {
    token: null
  }
};

const collections = ['blue variations', 'flow', 'various'];

afterEach(cleanup);
beforeEach(() => {
  store = createStore(reducer, data);
});

it('should render checkout page', () => {
  const { getByLabelText, getByPlaceholderText, getByText } = render(
    <Provider store={store}>
      <Checkout collections={collections} />
    </Provider>
  );
  expect(getByText('Dovile Jewellery')).toBeDefined();
  expect(getByText("n'23")).toBeDefined();
  expect(getByLabelText('First name')).toBeDefined();
  expect(getByLabelText('Last name')).toBeDefined();
  expect(getByLabelText('Email address')).toBeDefined();
  expect(getByLabelText('Phone number (optional)')).toBeDefined();
  expect(getByLabelText('Address')).toBeDefined();
  expect(getByLabelText('Apartment, suite, etc. (optional)')).toBeDefined();
  expect(getByLabelText('Country')).toBeDefined();
  expect(getByLabelText('City')).toBeDefined();
});
